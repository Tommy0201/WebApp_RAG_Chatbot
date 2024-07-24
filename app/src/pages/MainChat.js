import React, { useState } from 'react';
import styles from './chat.css';

const MainChat = () => {
  const [inputMess,setInputMess] = useState("");
  const [messages,setMessages] = useState([]);

  const handleInputChange = (event) => {
    setInputMess(event.target.value);
  }

  const handleSendMessage = () => {
    if (inputMess.trim()) {
      setMessages([...messages, { sender: 'user', message: inputMess }]);
      console.log("messages: ",messages)
      setInputMess("");
    }
  }

  return (
    <div className="main-chat-container">
      <div className="chat-container">
        {/* Chat messages will go here */}
        <div className="messages"></div>
          {messages.map((msg,index)=> (
            <div key={index} className={`message-item ${msg.sender}-message`}>
              {msg.message}
            </div>
          ))}

      </div>

      <div className="input-bar">
        <input 
        type="text" 
        placeholder="Chat with your bot..." 
        value={inputMess}
        onChange={handleInputChange}
        />
        <button onClick= {handleSendMessage}>Send</button>
      </div>
    </div>
  )
}

export default MainChat;
