import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import FileUpload from '../pages/FileUpload'; 
import MainChat from '../pages/MainChat'; 

const Routers = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<FileUpload />} /> 
          <Route path="/main-chat" element={<MainChat />} /> 
        </Routes>
      </Router>
    </div>
  );
};

export default Routers;