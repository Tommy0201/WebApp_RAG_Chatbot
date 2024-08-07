import React, { useState, useContext, useEffect } from 'react';
import styles from './chat.css';
import { ChatContext } from '../utils/ChatContext';

const MainChat = ({showInputBar, sessionId, sessions, setSessions, setIsBotRespond }) => {
  const [inputMess,setInputMess] = useState("");
  const { messages, setMessages } = useContext(ChatContext);

  const currentSession = Array.isArray(sessions) ? sessions.find(session => session.id === sessionId) : null;

  useEffect(()=> {
    if (currentSession && currentSession.messages) {
      setMessages(currentSession.messages);
    } else {
      setMessages([]);
    }
  }, [sessionId, currentSession, setMessages]);

  const handleInputChange = (event) => {
    setInputMess(event.target.value);
  }

  const handleSendMessage = async () => {
    if (inputMess.trim()) {
      const message = inputMess.trim();
      const newMessages = [...messages, { sender: 'user', message: message }];
      updateSessionMessages(sessionId, newMessages);
      setMessages(newMessages);
      setInputMess("");
      await botResponse(message);
    }
  }

  const updateSessionMessages = (sessionId, newMessages) => {
    setSessions(prevSessions => 
      prevSessions.map(session => 
        session.id === sessionId ? { ...session, messages: newMessages } : session
      )
    );
  }
  const botResponse = async (message) => {
    setIsBotRespond(true);
    const host = process.env.REACT_APP_CHOST || "http://localhost";
    const port = process.env.REACT_APP_CPORT || "8000";
    var service_uri = `${host}:${port}/chat_stream`;
    try {
      const response = await fetch(service_uri, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({"message":message})
      })
      // console.log("Response from bot: ",response)
      // BEFORE STREAMING IS HERE
      // const botAnswer = await response.json();
      // STREAMING START HERE
      const reader = response.body.getReader();
      let botMessage = ""
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        const chunk = new TextDecoder().decode(value);
        botMessage += chunk;
        setMessages(prevMessages => {
          const newMessages = [...prevMessages];
          if (newMessages.length && newMessages[newMessages.length - 1].sender === 'bot') {
            newMessages[newMessages.length - 1].message = botMessage;
          } else {
            newMessages.push({ sender: 'bot', message: botMessage });
          }
          updateSessionMessages(sessionId,newMessages);
          return newMessages;
        });
      }
    }
    catch (error) {
      console.log("Error trying get AI message",error);
    } finally {
      setIsBotRespond(false);
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
