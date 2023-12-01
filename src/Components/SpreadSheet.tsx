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
  // const [allMessages, setAllMessages] = useState<ChatItem[]>([]);
  const [needsUpdate, setNeedsUpdate] = useState(false);
  const [filteredWord, setFilteredWord] = useState("");

  // fetch('/all-messages')
  //   .then(response => response.json())
  //   .then(data => {
  //     setAllMessages(data);
  //   })
  //   .catch(error => {
  //     console.error('Error fetching messages:', error);
  //   });
  // useEffect(() => {
  //   const fetchURL = "http://localhost:3005/all-messages";
  //   fetch(fetchURL)
  //     .then(response => response.json())
  //     .then(data => {
  //       setAllMessages(data);
  //     })
  //     .catch(error => {
  //       console.error('Error fetching messages:', error);
  //     });
  // }, []); // Empty dependency array to run only on component mount



  function updateDisplayValues(): void {
    if (needsUpdate) {
      spreadSheetClient.userName = userName;
      spreadSheetClient.documentName = documentName;
      setFormulaString(spreadSheetClient.getFormulaString());
      setResultString(spreadSheetClient.getResultString());
      setStatusString(spreadSheetClient.getEditStatusString());
      setCells(spreadSheetClient.getSheetDisplayStringsForGUI());
      setCurrentCell(spreadSheetClient.getWorkingCellLabel());
      setCurrentlyEditing(spreadSheetClient.getEditStatus());
      const errorOccurred = spreadSheetClient.getErrorOccurred();
      if (errorOccurred !== "") {
        alert(errorOccurred);
      }
      setNeedsUpdate(false);
    }
  }

  useEffect(() => {
    if (needsUpdate) {
      updateDisplayValues();
    }
  }, [needsUpdate]);

  function returnToLoginPage() {
    const href = window.location.href;
    const index = href.lastIndexOf("/");
    let newURL = href.substring(0, index);
    newURL = newURL + "/documents";
    window.history.pushState({}, "", newURL);
    window.location.reload();
  }

  function sendMessage(event: React.MouseEvent<HTMLButtonElement>): void {
    spreadSheetClient.addMessage(userName, message);
    setMessage("");
    setNeedsUpdate(true);
  }

  function addFilteredWords(event: React.MouseEvent<HTMLButtonElement>): void {
    spreadSheetClient.addFilteredWord(filteredWord);
    setFilteredWord("");
    setNeedsUpdate(true);
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
    setNeedsUpdate(true);
  }

  function onButtonClick(event: React.MouseEvent<HTMLButtonElement>): void {
    if (!checkUserName()) {
      return;
    }
    const text = event.currentTarget.textContent || "";
    spreadSheetClient.setEditStatus(true);
    spreadSheetClient.addToken(text);
    setNeedsUpdate(true);
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
    setNeedsUpdate(true);
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
                // allMessages={allMessages}
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
