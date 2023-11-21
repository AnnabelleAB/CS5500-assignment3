import React from "react";
import { LuFileSpreadsheet } from "react-icons/lu";
import "./Header.css";

export default function Header() {
  return (
    <>
      <div className="headerbc">
        <LuFileSpreadsheet size={22} style={{ color: "white" }} />
        <text className="header">SpreedSheet</text>
      </div>
    </>
  );
}
