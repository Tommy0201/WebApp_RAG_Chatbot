import React, { useState } from 'react';
import styles from './upload.css';

const FileUpload = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
    console.log(uploadedFiles);
  };

  const handleSubmit = async () => {
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
      const result = await response.json();
      if (!response.ok) {
        alert(result.error);
      }
      console.log("Receiving response from backend: ", result);
    } catch (error) {
      console.log("Error trying to send request to backend: ", error);
    }
  };

  return (
    <div className='file-upload'>
      <h1 className="upload-txt">Upload Your PDF Files</h1> 

      <div className="upload-buttons">
        <label htmlFor="file-input" className="custom-file-upload">
          Choose File
        </label>
        <input id="file-input" type="file" onChange={handleFileChange} accept="application/pdf" multiple className="hidden-input" />
        {files.length > 0 && (
          <div className="file-uploaded">
            <div className="file-names">
              {files.map((file, index) => (
                <div key={index} className="files">{file.name}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="submit-button">
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default FileUpload;
