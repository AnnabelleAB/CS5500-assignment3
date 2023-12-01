import React from "react";
import { ChatItem } from "../Server/ChatItem";
import { reverse } from "dns";
import "./MessageList.css";

/**
 * The status component is a simple component that displays the status of the calculator.
 *
 * The status is determined by a string that is passed in as a prop.
 */

interface MessageListProps {
  messages: ChatItem[];
} // interface MessageListProps

const convertDate = (
  timestamp: number | { _seconds: number; _nanoseconds: number }
) => {
  const date = new Date(
    typeof timestamp === "number"
      ? timestamp
      : timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000
  );
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const message = messages.slice().reverse();
  return (
    <ul className="message-list">
      {message.map((item) => (
        <li className="message-item">
          <div>
          <div className="item-username">
            {item.user}
            <a className="item-time">     {convertDate(item.timestamp)}</a>

          </div>
          </div>
          <div className="arrowbox1-left">
            <div className="item-content">{item.content}</div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default MessageList;
