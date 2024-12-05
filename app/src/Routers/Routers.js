import React, { useState } from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate } from 'react-router-dom';
import { ChatProvider } from '../utils/ChatContext';
import ImageUpload from '../pages/ImageUpload';
import ChatLayout from '../pages/ChatLayout';


const Routers = () => {
  return (
    <ChatProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ImageUpload />}/>
          <Route path="/chat" element={<ChatLayout />}/>
        </Routes>
      </Router>
    </ChatProvider>
  );
};

export default Routers;