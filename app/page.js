'use client';

import Head from 'next/head';
import { useState, useEffect } from 'react';
import PieSocket from 'piesocket-js';
import { v4 as uuidv4 } from 'uuid'; 

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [channel, setChannel] = useState(null);
  const [username, setUsername] = useState(`User_${uuidv4().slice(0, 8)}`);
  var pieSocket = new PieSocket({
    clusterId: "free.blr2",
    apiKey: "B9UKgvptNTWrZxfCUTquFp7nKVsYqu2LtmBao5Jg",
    notifySelf: true
  });

  useEffect(() => {
    pieSocket.subscribe("chat-room").then((channel) => {
      console.log("Channel is ready");
      setChannel(channel);
      channel.listen("new_message", (data, meta) => {
        console.log("New message: ", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });
    });
  }, []);

  const handleSendMessage = () => {
    if (!channel) return;
    channel.publish("new_message", {
      message: newMessage,
      sender: username
    });
    setNewMessage('');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-end bg-gray-100">
      <Head>
        <title>Chat App</title>
      </Head>
      <ul className="list-none mb-4 flex flex-col items-center justify-center m-8">
        {messages.map((message, index) => (
          <li key={index} className="flex flex-wrap mb-2">
            <span className="text-gray-700">{message.sender}: {message.message}</span>
          </li>
        ))}
      </ul>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="bg-white rounded-md p-2 text-gray-700"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ml-2"
        > 
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
