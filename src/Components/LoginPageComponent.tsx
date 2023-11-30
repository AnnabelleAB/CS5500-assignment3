import React, { useState, useEffect } from "react";
import "./LoginPageComponent.css";
import Card from "react-bootstrap/Card";
import { FaUserAstronaut } from "react-icons/fa";
/**
 * Login PageComponent is the component that will be used to display the login page
 * If the user is logged in, then this component will display the list of documents
 * that the user has access to.  Each document will have a button that will allow the
 * user to edit the document. when the user clicks on the button, the user will be
 * taken to the document page.
 * @returns
 */

import SpreadSheetClient from "../Engine/SpreadSheetClient";
import { spread } from "axios";

interface LoginPageProps {
  spreadSheetClient: SpreadSheetClient;
}

function LoginPageComponent({
  spreadSheetClient,
}: LoginPageProps): JSX.Element {
  const [userName, setUserName] = useState(
    window.sessionStorage.getItem("userName") || ""
  );
  const [documents, setDocuments] = useState<string[]>([]);

  // SpreadSheetClient is fetching the documents from the server so we should
  // check every 1/20 of a second to see if the documents have been fetched
  useEffect(() => {
    const interval = setInterval(() => {
      const sheets = spreadSheetClient.getSheets();
      if (sheets.length > 0) {
        setDocuments(sheets);
      }
    }, 50);
    return () => clearInterval(interval);
  });

  function getUserLogin() {
    return (
      <div>
        <input
          style={{
            padding: "10px",
            fontSize: "20px",
            borderRadius: "5px",
            border: "1px solid black",
          }}
          type="text"
          placeholder="Your name"
          defaultValue={userName}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              // get the text from the input
              let userName = (event.target as HTMLInputElement).value;
              window.sessionStorage.setItem("userName", userName);
              // set the user name
              setUserName(userName);
              spreadSheetClient.userName = userName;
            }
          }}
        />
      </div>
    );
  }

  function checkUserName(): boolean {
    if (userName === "") {
      alert("Please enter a user name");
      return false;
    }
    return true;
  }
  function loadDocument(documentName: string) {
    // set the document name
    spreadSheetClient.documentName = documentName;
    // reload the page

    // the href needs to be updated.   Remove /documnents from the end of the URL
    const href = window.location.href;
    const index = href.lastIndexOf("/");
    let newURL = href.substring(0, index);
    newURL = newURL + "/" + documentName;
    window.history.pushState({}, "", newURL);
    window.location.reload();
  }

  function logout() {
    // clear the user name
    window.sessionStorage.setItem("userName", "");
    // reload the page
    window.location.reload();
  }

  function buildFileSelector() {
    if (userName === "") {
      return <div></div>;
    }

    const sheets: string[] = spreadSheetClient.getSheets();
    // make a table with the list of sheets and a button beside each one to edit the sheet
    return (
      <>
        <div>
          <div className="username">
            <table>
              <th style={{width:'100%'}}>
                <FaUserAstronaut /> Hello! {userName}{" "}
              </th>
              <th>
                <button className="logoutbtn" onClick={() => logout()}>
                  Logout
                </button>
              </th>
            </table>
          </div>
        </div>
        <div>
          <table className="wholeTable">
            <thead>
              <tr className="selector-title">
                <th className="first">Document Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sheets.map((sheet) => {
                return (
                  <tr className="selector-item">
                    <td className="first">{sheet}</td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="editbtn"
                        onClick={() => loadDocument(sheet)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </>
    );
  }

  function getLoginPanel() {
    return (
      <div style={{ textAlign: "center" }}>
        <h1>Welcome Back</h1>
        {getUserLogin()}
      </div>
    );
  }

  function loginPage() {
    if (userName === "") {
      return <td>{getLoginPanel()}</td>;
    }
    return (
      <table>
        <tbody>
          <tr>
            <td>{buildFileSelector()}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return <div className="LoginPageComponent">{loginPage()}</div>;
}

export default LoginPageComponent;
