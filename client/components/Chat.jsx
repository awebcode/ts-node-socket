import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

const ChatComponent = () => {
  const chatWindowRef = useRef(null);
  const [messages, setMessages] = useState(
    (typeof window !== "undefined" && JSON.parse(localStorage.getItem("chatMessages"))) ||
      []
  );
  const [offset, setOffset] = useState(10);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (messages.length === 0) {
      socket.emit("get older messages", 0);
    } else {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }

    socket.on("older messages", (olderMessages) => {
      setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
      setIsLoading(false); // Set isLoading to false once messages are received
    });

    socket.on("chat message", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    });

    return () => {
      socket.off("older messages");
      socket.off("chat message");
    };
  }, [messages]);

  const fetchOlderMessages = () => {
    if (!isLoading) {
      setIsLoading(true);
      socket.emit("get older messages", offset);
      setOffset((prevOffset) => prevOffset + 10);
    }
  };

  const handleScroll = (e) => {
    const { scrollTop } = e.target;
    if (scrollTop === 0) {
      fetchOlderMessages();
    }
  };

  const sendMessage = (e) => {
    if (inputValue.trim() !== "") {
      socket.emit("chat message", inputValue);
      setInputValue("");
      console.log(566)
    }
  };
  

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gray-200">
      <div
        className="flex-1 flex flex-col overflow-y-auto p-4"
        ref={chatWindowRef}
        onScroll={handleScroll}
      >
        {isLoading && <div className="text-center py-2 text-gray-500">Loading...</div>}
        {messages.map((message, index) => (
          <div key={index} className="flex items-start mb-2">
            <div className="bg-blue-500 text-white text-sm rounded-lg p-6">{message}</div>
          </div>
        ))}
      </div>
      <div className="bg-white flex p-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 rounded-l-md border-gray-300 border p-3"
          onKeyDown={sendMessage}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r-md"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;
