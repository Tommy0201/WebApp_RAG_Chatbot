import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import FileUpload from '../pages/FileUpload'; 
import MainChat from '../pages/MainChat'; 
import { ChatProvider } from '../utils/ChatContext';
import styles from './routers.css';

const Layout = () => {

  const [sessions,setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [showInputBar,setShowInputBar] = useState(false);
  const [isBotRespond, setIsBotRespond] = useState(false);

  useEffect(() => {
    const deleteDatabase = async () => {
      const host = process.env.REACT_APP_CHOST || "http://localhost";
      const port = process.env.REACT_APP_CPORT || "8000";
      const service_uri = `${host}:${port}/delete_data`;
      try {
        const response = await fetch(service_uri, {
          method: 'DELETE',
        });
        if (!response.ok) {
          console.log("Failed to delete database");
        }
        console.log("Successfully delete database", response);

      } catch (error) {
        console.log("Failed to send delete request to database ", error)
      }
    };
    deleteDatabase();
  },[]);

  const createNewSession = () => {
    const newSessionId = Date.now();
    setSessions(prevSessions =>
      [...prevSessions, 
      {id:newSessionId, name:`Session ${sessions.length + 1}`, messages: []}]);
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
  return (
    <div className="layout">

      <div className="file-upload-main">
        <FileUpload onFileUpload={createNewSession} />
      </div>

      <div className="sessions-list">
        <button onClick={createNewSession}>Add Session</button>
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

const Routers = () => {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default Routers;