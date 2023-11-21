import React from "react";
import MessageList from "./MessageList";
import { ChatItem } from "../Server/ChatItem";
import "./ChatWindow.css";
import { GoSearch } from "react-icons/go";
import { BsChatDots } from "react-icons/bs";
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
      <h5>Chat Window <BsChatDots size={20} style={{fontStyle:"bold"}}/></h5>
      <div style={{fontSize:"14px"}}><GoSearch /> Search Message History</div>
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