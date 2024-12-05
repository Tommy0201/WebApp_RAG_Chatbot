import React, { useState, useEffect, useCallback } from 'react';
import FileUpload from './FileUpload';
import MainChat from './MainChat';
import styles from '../Routers/routers.css';

const ChatLayout = () => {

    const [sessions,setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [showInputBar,setShowInputBar] = useState(false);
    const [isBotRespond, setIsBotRespond] = useState(false);
  
    // useEffect(() => {
    //   const deleteDatabase = async () => {
    //     const host = process.env.REACT_APP_CHOST || "http://localhost";
    //     const port = process.env.REACT_APP_CPORT || "8000";
    //     const service_uri = `${host}:${port}/delete_data`;
    //     try {
    //       const response = await fetch(service_uri, {
    //         method: 'DELETE',
    //       });
    //       if (!response.ok) {
    //         console.log("Failed to delete database");
    //       }
    //       console.log("Successfully delete database", response);
  
    //     } catch (error) {
    //       console.log("Failed to send delete request to database ", error)
    //     }
    //   };
    //   deleteDatabase();
    // },[]);
  
    const createNewSession = () => {
      const newSessionId = Date.now();
      console.log("Creating new session with ID:", newSessionId);  // Log to verify session creation
      setSessions(prevSessions =>
        [...prevSessions, 
        { id: newSessionId,
          name:`Session ${sessions.length + 1}`, 
          messages: [{ sender: 'bot', message: 'Based on your uploaded documents, how can I assist you today?' }],
        }]);
      setActiveSessionId(newSessionId);
      setShowInputBar(true);


    }
    const handleSessionClick = useCallback((sessionId) => {
      if (!isBotRespond){
        setActiveSessionId(sessionId);
        setShowInputBar(true);
      }
    }, [isBotRespond]);
  
  
    const updateSessionMessages = (sessionId, newMessages) => {
      setSessions(prevSessions => 
        prevSessions.map(session => 
          session.id === sessionId ? { ...session, messages: newMessages } : session
        )
      );
    };

    const handleFileUpload = (botMessage) => {
      console.log("Handle File Upload Called")
      if (activeSessionId) {
          console.log("Active session exist")
          // Find the session and update the messages
          setSessions(prevSessions => 
              prevSessions.map(session => 
                  session.id === activeSessionId 
                  ? { ...session, messages: [...session.messages, { sender: 'bot', message: botMessage }] }
                  : session
              )
          );
      }
  };

    return (
      <div className="layout">
        <div className="side-bar">
          <div className="file-upload-main">
                <FileUpload 
                  createNewSession={createNewSession} 
                  onFileUpload={handleFileUpload}
                />
          </div>
          <div className="sessions-container">
            <button className="add-session-btn" onClick={createNewSession} disabled={isBotRespond}>Add Session</button>
            <div className="sessions-list">
              {sessions.map(session => (
                <button 
                  key={session.id} 
                  className={`session-item ${session.id === activeSessionId ? 'active' : ''}`} 
                  onClick={() => handleSessionClick(session.id)}
                  disabled={isBotRespond}
                >
                  {session.name}
                </button>
              ))}
            </div>
          </div>
        </div>
  
        {activeSessionId && (
          <div className="main-chat">
            <MainChat 
              showInputBar={showInputBar} 
              sessionId={activeSessionId}
              sessions={sessions} 
              setSessions={setSessions}
              updateSessionMessages={updateSessionMessages}
              setIsBotRespond={setIsBotRespond}
            />
          </div>
        )}
      </div>
    );
  };

  export default ChatLayout;