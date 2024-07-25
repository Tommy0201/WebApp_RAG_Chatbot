import React, { useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import FileUpload from '../pages/FileUpload'; 
import MainChat from '../pages/MainChat'; 
import { ChatProvider } from '../utils/ChatContext';
import styles from './routers.css';

const Layout = () => {
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

  const [showInputBar,setShowInputBar] = useState(false);
  const handleShowInputBar = () => {
    setShowInputBar(true);
  };


  return (
    <div className="layout">
      <div className="file-upload-main">
        <FileUpload onFileUpload={handleShowInputBar} />
      </div>
      <div className="main-chat">
        <MainChat showInputBar={showInputBar} />
      </div>
    </div>
  );
};

const Routers = () => {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          {/* <Route path="/" element={<FileUpload />} /> 
          <Route path="/main-chat" element={<MainChat />} />  */}
          <Route path="/" element={<Layout />} />
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default Routers;