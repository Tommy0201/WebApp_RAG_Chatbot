import React, { useContext, useState } from 'react';
import styles from './upload.css';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { ChatContext } from '../utils/ChatContext';

const FileUpload = ({onFileUpload}) => {
  const { setMessages } = useContext(ChatContext);
  const [files, setFiles] = useState([]);
  const maxFiles = 5;
  const [hasSubmitted, sethasSubmitted] = useState(false);

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    const newFiles = [...files, ...uploadedFiles].slice(0, maxFiles);
    setFiles(newFiles);
    console.log(newFiles);
  };

  const handleDeleteFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((item,i)=> i!== index));
  }

  const handleSubmit = async () => {
    if (hasSubmitted) return;
    sethasSubmitted(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file); // Ensure 'files' matches the backend's expected key
    });
    console.log("Form Data: ", formData);

    const host = process.env.REACT_APP_CHOST || "http://localhost";
    const port = process.env.REACT_APP_CPORT || "8000";
    const service_uri = `${host}:${port}/upload_file`;
    try {
      const response = await fetch(service_uri, {
        method: 'POST',
        body: formData,
      });
      const botIntro = await response.json();
      console.log("Receiving response from backend: ", botIntro);
      onFileUpload();
      setMessages(prevMessages => [...prevMessages, { sender: 'bot', message: botIntro.message }]);

    } catch (error) {
      console.log("Error trying to send request to backend: ", error);
    }
  };

  return (
    <div className='file-upload'>

        <h1 className="upload-txt">Upload Your PDF Files</h1> 

        {!hasSubmitted && (
          <div className="upload-buttons">
            <label htmlFor="file-input" className="custom-file-upload">Choose File</label>
            <input id="file-input" type="file" onChange={handleFileChange} accept="application/pdf" multiple className="hidden-input" disabled={files.length >= maxFiles}/>
          </div>
        )}

        {files.length > 0 && (
          <div className="file-uploaded">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="namess">{file.name}</div>
                  {!hasSubmitted && (
                    <button className="delete-button" onClick={() => handleDeleteFile(index)}><RemoveCircleOutlineIcon/></button>
                  )}
                  </div>
              ))}
          </div>
        )}

        {files.length === maxFiles && (
          <div className="max-mess">You have reached maximum number of uploaded files allowed</div>
        )}

      <div className="submit-section">
        {files.length > 0 && !hasSubmitted && (
          <button className="submit-button" onClick={handleSubmit}>Submit</button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
