import React from "react";
import { ChatItem } from "../Server/ChatItem";

/**
 * The status component is a simple component that displays the status of the calculator.
 * 
 * The status is determined by a string that is passed in as a prop.
 */

interface MessageListProps {
  messages: ChatItem[]
} // interface MessageListProps

const convertDate = (timestamp: number | { _seconds: number; _nanoseconds: number }) => {
    return new Date (typeof timestamp === 'number' ? timestamp : (timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000)).toLocaleTimeString();
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <ul>
          {messages.map((item) => <li><label>{item.user} : </label>{item.content} at {convertDate(item.timestamp)}</li>)}
  </ul>
  );
}

export default MessageList;