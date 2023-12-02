import React, { useState, useEffect } from "react";
import Formula from "./Formula";
import Status from "./Status";
import KeyPad from "./KeyPad";
import SpreadSheetClient from "../Engine/SpreadSheetClient";
import SheetHolder from "./SheetHolder";
import "./SpreadSheet.css";
import { ButtonNames } from "../Engine/GlobalDefinitions";
import ChatWindow from "./ChatWindow";
import { ChatItem } from "../Server/ChatItem";

interface SpreadSheetProps {
  documentName: string;
  spreadSheetClient: SpreadSheetClient;
}

function SpreadSheet({ documentName, spreadSheetClient }: SpreadSheetProps) {
  const [formulaString, setFormulaString] = useState(spreadSheetClient.getFormulaString());
  const [resultString, setResultString] = useState(spreadSheetClient.getResultString());
  const [cells, setCells] = useState(spreadSheetClient.getSheetDisplayStringsForGUI());
  const [statusString, setStatusString] = useState(spreadSheetClient.getEditStatusString());
  const [currentCell, setCurrentCell] = useState(spreadSheetClient.getWorkingCellLabel());
  const [currentlyEditing, setCurrentlyEditing] = useState(spreadSheetClient.getEditStatus());
  const [userName, setUserName] = useState(window.sessionStorage.getItem("userName") || "");
  const [message, setMessage] = useState("");
  const [filteredWord, setFilteredWord] = useState("");
  const [filteredWords, setFilteredWords] = useState<string[]>([]);

  function updateDisplayValues(): void {
    spreadSheetClient.userName = userName;
    spreadSheetClient.documentName = documentName;
    setFormulaString(spreadSheetClient.getFormulaString());
    setResultString(spreadSheetClient.getResultString());
    setStatusString(spreadSheetClient.getEditStatusString());
    setCells(spreadSheetClient.getSheetDisplayStringsForGUI());
    setCurrentCell(spreadSheetClient.getWorkingCellLabel());
    setCurrentlyEditing(spreadSheetClient.getEditStatus());
   spreadSheetClient.getFilteredWords().then(words => {
     setFilteredWords(words);
    });
    const errorOccurred = spreadSheetClient.getErrorOccurred();
    if (errorOccurred !== "") {
      alert(errorOccurred)
      alert(errorOccurred);
    }

  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateDisplayValues();
    }, 50);
    return () => clearInterval(interval);
  });


  function returnToLoginPage() {
    const href = window.location.href;
    const index = href.lastIndexOf("/");
    let newURL = href.substring(0, index);
    newURL = newURL + "/documents";
    window.history.pushState({}, "", newURL);
    window.location.reload();
  }

  function sendMessage(event: React.MouseEvent<HTMLButtonElement>): void {
    if (filteredWords.some(word => message.toLowerCase().split(" ").includes(word))) {
      alert("Your message contains inappropriated words! Please remove and try again.")
    }else {
      spreadSheetClient.addMessage(userName, message);
      setMessage("");
    }
  }

  function addFilteredWords(event: React.MouseEvent<HTMLButtonElement>): void {
    spreadSheetClient.addFilteredWord(filteredWord);
    setFilteredWord("");
  }

  function onMessageChange(event: React.FormEvent<HTMLInputElement>): void {
    setMessage(event.currentTarget.value);
  }

  function onFilteredWordChange(event: React.FormEvent<HTMLInputElement>): void {
    setFilteredWord(event.currentTarget.value);
  }

  async function onCommandButtonClick(text: string): Promise<void> {
    if (!checkUserName()) {
      return;
    }
    switch (text) {
      case ButtonNames.edit_toggle:
        spreadSheetClient.setEditStatus(!currentlyEditing);
        break;
      case ButtonNames.clear:
        spreadSheetClient.removeToken();
        break;
      case ButtonNames.allClear:
        spreadSheetClient.clearFormula();
        break;
      // Add other cases as needed
    }
  }

  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!checkUserName()) {
      return;
    }
    const text = event.currentTarget.textContent || "";
    spreadSheetClient.setEditStatus(true);
    spreadSheetClient.addToken(text);
  }

  function onCellClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!checkUserName()) {
      return;
    }
    const cellLabel = event.currentTarget.getAttribute("cell-label") || "";
    if (currentlyEditing) {
      spreadSheetClient.addCell(cellLabel);
    } else {
      spreadSheetClient.requestViewByLabel(cellLabel);
    }
  }

  function checkUserName(): boolean {
    if (userName === "") {
      alert("Please enter a user name");
      return false;
    }
    return true;
  }

  return (
    <div>
      <div className="btnandstatus">
        <button className="backbtn" onClick={returnToLoginPage}>
          Back to Document List
        </button>
        <Status statusString={statusString} userName={userName}></Status>
      </div>
      <table className="main">
        <tbody>
          <tr>
            <td>
              <Formula
                formulaString={formulaString}
                resultString={resultString}
              ></Formula>
              <SheetHolder
                cellsValues={cells}
                onClick={onCellClick}
                currentCell={currentCell}
                currentlyEditing={currentlyEditing}
              ></SheetHolder>
              <KeyPad
                onButtonClick={onButtonClick}
                onCommandButtonClick={onCommandButtonClick}
                currentlyEditing={currentlyEditing}
              ></KeyPad>
            </td>
            <td>
              <ChatWindow
                message={message}
                onMessageChange={onMessageChange}
                sendMessage={sendMessage}
                filteredWord={filteredWord}
                onFilteredWordChange={onFilteredWordChange}
                addFilteredWords={addFilteredWords}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SpreadSheet;
