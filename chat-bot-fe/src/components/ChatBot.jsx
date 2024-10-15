import React, { useState } from 'react';
import axios from 'axios';
import { AiOutlineSend } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';

const ChatBot = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light');

  const handleSubmit = async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      await sendMessage();
    }
  };

  const sendMessage = async () => {
    setLoading(true);
    setError('');
    setMessages((prev) => [...prev, { text: prompt, type: 'user' }]);

    try {
      const res = await axios.post('http://localhost:3000/generate', { prompt });
      setMessages((prev) => [...prev, { text: res.data.response, type: 'bot' }]);
      setPrompt('');
    } catch (err) {
      setError('An error occurred while generating content.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <div className={`w-full max-w-md p-4 rounded-md shadow-md flex flex-col ${theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-black'}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Chat Bot</h1>
          <button onClick={toggleTheme} className="focus:outline-none">
            {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
          </button>
        </div>

        <div className="flex-grow overflow-auto mb-4 h-[70vh]" style={{ maxHeight: '70vh' }}>
          <div className="flex flex-col space-y-2 overflow-auto scrollbar-hidden" style={{ maxHeight: '100%' }}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-md ${msg.type === 'user' ? (theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white') : (theme === 'dark' ? 'bg-gray-700 text-gray-100' : 'bg-gray-300 text-black')}`}
              >
                {msg.text}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex">
          <textarea
            value={prompt}
            onKeyDown={handleSubmit}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your message..."
            rows="3"
            className={`w-full p-2 border rounded-md focus:outline-none resize-none overflow-hidden ${theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
            style={{ maxHeight: '80px', overflowY: 'auto' }}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded-md ml-2 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            <AiOutlineSend size={24} />
          </button>
        </form>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <style jsx>{`
        .scrollbar-hidden::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hidden {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ChatBot;
