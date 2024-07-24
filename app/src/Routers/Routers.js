import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import FileUpload from '../pages/FileUpload'; 
import MainChat from '../pages/MainChat'; 
import styles from './routers.css';

const Layout = () => {
  return (
    <div className="layout">
      <div className="file-upload-main">
        <FileUpload />
      </div>
      <div className="main-chat">
        <MainChat />
      </div>
    </div>
  );
};

const Routers = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* <Route path="/" element={<FileUpload />} /> 
          <Route path="/main-chat" element={<MainChat />} />  */}
          <Route path="/" element={<Layout />} />
        </Routes>
      </Router>
    </div>
  );
};

export default Routers;