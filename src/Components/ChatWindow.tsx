import React from "react";
import MessageList from "./MessageList";
import { ChatItem } from "../Server/ChatItem";
import "./ChatWindow.css";

interface ChatWindowProps {
    message: string;
    messages: ChatItem[];
    onMessageChange(event: React.FormEvent<HTMLInputElement>): void;
    sendMessage(event: React.MouseEvent<HTMLButtonElement>): void;
    loadMoreMessages(): void;
}

function ChatWindow({message, messages, onMessageChange, sendMessage, loadMoreMessages}: ChatWindowProps) {
  return (
    <div className="chat-window">
        <div className="message-container">
          <MessageList messages={messages} />
        </div>
        <div className="input-container">
          <input placeholder="Type a message..." value={message} onChange={onMessageChange}>
          </input>
          <button onClick = {sendMessage}>
            Send
          </button>
          <button onClick={loadMoreMessages}>
            Load More
          </button>
        </div>
      </div>
  );
}

export default ChatWindow;