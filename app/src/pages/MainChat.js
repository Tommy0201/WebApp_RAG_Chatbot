import React from 'react';
import styles from './chat.css';

const MainChat = () => {
  return (
    <div className="main-chat-container">
      <div className="chat-container">
        {/* Chat messages will go here */}
        <div className="messages">
          THIS IS THE MAINCHAT
        </div>
      </div>
      <div className="input-bar">
        <input type="text" placeholder="Chat with your bot..." />
        <button>Send</button>
      </div>
    </div>
  )
}

export default MainChat;
