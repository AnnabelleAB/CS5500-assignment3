import React, { useState, useEffect } from "react";
import MessageList from "./MessageList";
import { ChatItem } from "../Server/ChatItem";
import "./ChatWindow.css";
import { GoSearch } from "react-icons/go";
import { BsChatDots } from "react-icons/bs";
import { IoIosSend } from "react-icons/io";

interface ChatWindowProps {
  // allMessages: ChatItem[];
  message: string;
  onMessageChange(event: React.FormEvent<HTMLInputElement>): void;
  sendMessage(event: React.MouseEvent<HTMLButtonElement>): void;
  filteredWord: string;
  onFilteredWordChange(event: React.FormEvent<HTMLInputElement>): void;
  addFilteredWords(event: React.MouseEvent<HTMLButtonElement>): void;
}

function ChatWindow({
  message,
  onMessageChange,
  sendMessage,
  filteredWord,
  onFilteredWordChange,
  addFilteredWords,
}: ChatWindowProps) {
  const [displayedMessages, setDisplayedMessages] = useState<ChatItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allMessages, setAllMessages] = useState<ChatItem[]>([]);

  useEffect(() => {
    setDisplayedMessages(allMessages.slice(0, 20)); // Initially display only 20 messages
  }, [allMessages]);

  useEffect(() => {
    const fetchNewMessages = () => {
      // http://localhost:3005/all-messages 
      fetch("https://cs5500-assignment3-xn1z.onrender.com/all-messages")
        .then((response) => response.json())
        .then((newMessages) => {
          // Update the displayed messages only if there are new messages
          if (newMessages.length !== allMessages.length) {
            setAllMessages(newMessages);
            setDisplayedMessages(newMessages.slice(0, 20));
          }
        })
        .catch((error) => console.error("Error fetching new messages:", error));
    };

    const messagePollingInterval = setInterval(fetchNewMessages, 50); // Poll every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(messagePollingInterval);
  }, [allMessages]);
  const handleSendMessage = (event: React.MouseEvent<HTMLButtonElement>) => {
    sendMessage(event);
    setDisplayedMessages([...displayedMessages]);
  };

  const loadMoreMessages = () => {
    const currentLength = displayedMessages.length;
    const moreMessages = allMessages.slice(currentLength, currentLength + 20);
    setDisplayedMessages([...displayedMessages, ...moreMessages]);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query) {
      const filteredMessages = allMessages.filter((msg) =>
        msg.content.toLowerCase().includes(query.toLowerCase())
      );
      setDisplayedMessages(filteredMessages);
    } else {
      setDisplayedMessages(allMessages.slice(0, 20));
    }
  };

  const handleAddFilteredWord = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    addFilteredWords(event);
    setDisplayedMessages([...displayedMessages]);
  };

  return (
    <div className="chat-window">
      <h5>
        Chat Window <BsChatDots size={20} style={{ fontStyle: "bold" }} />
      </h5>
      <input
        type="text"
        placeholder="Search Message History..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      <div className="message-container">
        <MessageList messages={displayedMessages} />
      </div>

      <div className="input-container">
        <input
          placeholder="Type a message..."
          value={message}
          onChange={onMessageChange}
          className="message-input"
        >
        </input>
        <button onClick={handleSendMessage} className="sendbtn">Send </button>
        {searchQuery === "" && (
          <button onClick={loadMoreMessages} className="sendbtn">Load More</button>
        )}
      </div>

      <>
        <div style={{ fontSize: "14px" }}>Enter Filtered Words</div>
        <input
          type="text"
          placeholder="Enter Filtered Words..."
          value={filteredWord}
          onChange={onFilteredWordChange}
        />
        <button onClick={handleAddFilteredWord}>Add</button>
      </>
    </div>
  );
}

export default ChatWindow;
