import React, { useState, useContext } from 'react';
import styles from './chat.css';
import { ChatContext } from '../utils/ChatContext';

const MainChat = ({showInputBar}) => {
  const [inputMess,setInputMess] = useState("");
  const { messages, setMessages } = useContext(ChatContext);

  const handleInputChange = (event) => {
    setInputMess(event.target.value);
  }

  const handleSendMessage = async () => {
    if (inputMess.trim()) {
      const message = inputMess.trim();
      setMessages([...messages, { sender: 'user', message: message }]);
      // console.log("messages: ",messages)
      setInputMess("");
      if (message) {
        await botResponse(message);
      }
      else {
        console.log("Sending message is empty!")
      }
    }
  }
  const botResponse = async (message) => {
    const host = process.env.REACT_APP_CHOST || "http://localhost";
    const port = process.env.REACT_APP_CPORT || "8000";
    var service_uri = `${host}:${port}/chat`;
    try {
      const response = await fetch(service_uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"message":message})
      })
      // console.log("Response from bot: ",response)
      const botAnswer = await response.json();
      // console.log("type of botanswer: ",typeof(botAnswer));
      // console.log("botAnswer: ",botAnswer);
      setMessages(prevMessages => [...prevMessages,{ sender: 'bot', message: botAnswer.message}])
    }
    catch (error) {
      console.log("Error trying get AI message",error);
    }
  }

  return (
    <div className="main-chat-container">

      <div className="chat-container"> 
        <div className="messages"></div>
          {messages.map((msg,index)=> (
            <div key={index} className={`message-item ${msg.sender}-message`}>
              {msg.message}
            </div>
          ))}
      </div>

      {showInputBar && (
        <div className="input-bar">
          <input 
          type="text" 
          placeholder="Chat with your bot..." 
          value={inputMess}
          onChange={handleInputChange}
          />
          <button onClick= {handleSendMessage}>Send</button>
        </div>
      )}

    </div>
  )
}

export default MainChat;
