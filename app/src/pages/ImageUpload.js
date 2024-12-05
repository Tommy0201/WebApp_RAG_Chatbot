import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './imageUpload.css';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [isValidFile, setIsValidFile] = useState(false);
    const [processedImage, setProcessedImage] = useState(null); 
    const [extractedText, setExtractedText] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();
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

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const fileType = selectedFile.type;
            if (fileType === 'image/jpeg' || fileType === 'image/png' || fileType === 'image/jpg') {
                setFile(selectedFile);
                setIsValidFile(true); 
            } else {
                alert('Only JPG or PNG files.');
                setFile(null);
                setIsValidFile(false);
            }
        }
    };

    const handleUpload = async () => {
        if (isValidFile) {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            try {
                const response = await fetch('http://localhost:8000/image_processing', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const imageBlob = await response.blob(); 
                    const imageUrl = URL.createObjectURL(imageBlob);
                    setProcessedImage(imageUrl); 
                } else {
                    alert('Failed to process the image.');
                }
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Error uploading image. Please try again.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleTextConvert = async () => {
        if (processedImage) {
            const formData = new FormData();
            formData.append('image', file);

            try {
                const host = process.env.REACT_APP_CHOST || "http://localhost";
                const port = process.env.REACT_APP_CPORT || "8000";
                const service_uri = `${host}:${port}/image_to_text`;

                const response = await fetch(service_uri, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    setExtractedText(result.extracted_text);
                } else {
                    alert('Failed to extract text from the image.');
                }
            } catch (error) {
                console.error('Error converting image to text:', error);
                alert('Error extracting text. Please try again.');
            }
        }
    };

    const handleRetake = () => {
        setFile(null);
        setIsValidFile(false);
        setProcessedImage(null);
        setExtractedText('');
    };


    const handleSubmit = async () => {
        if (extractedText && file) {
            const formData = new FormData();
            formData.append('submit_text',extractedText)
            formData.append('image',file)

            const host = process.env.REACT_APP_CHOST || "http://localhost";
            const port = process.env.REACT_APP_CPORT || "8000";
            const service_uri = `${host}:${port}/text_to_database`;

            try {
                const response = await fetch(service_uri, {
                    method: 'POST',
                    body: formData,
                });
                const confirmMessage = await response.json();
                console.log("Response message: ",confirmMessage)

            } catch (error) {
                console.error('Error submitting extracted text to database');
            }
        }
        navigate('/chat');
    };

    return (
        <div className="upload-page">
            <h1>Upload Your Image (JPG or PNG)</h1>

            {!isValidFile && !processedImage && (
                <>
                    <label htmlFor="file-upload" className="upload-image-btn">Choose File</label>
                    <input type="file" id="file-upload" accept=".jpg,.jpeg,.png" onChange={handleFileChange} style={{ display: 'none' }} />
                    <h2>or</h2>
                    <h1>Straight to Chatbot</h1>
                    <button className="upload-image-btn" onClick={handleSubmit}>Chat</button>
                </>
            )}

            {isValidFile && !processedImage && !isUploading && (
                <div className="file-info">
                    <p>Selected File: {file.name}</p>
                    <button className="upload-image-btn" id= "preprocessing-btn"onClick={handleUpload}>Preprocessing</button>
                </div>
            )}

            {isUploading && <p>Uploading...</p>}

            {processedImage && (
                <div className="content-container">
                    <div className="processed-image-container">
                        <h2>Processed Image</h2>
                        <div className="image-wrapper">
                            <img src={processedImage} alt="Processed" className="processed-image" />
                        </div>
                        <div className="action-buttons">
                            <button className="upload-image-btn" onClick={handleRetake}>Retake</button>
                            <button className="upload-image-btn" onClick={handleTextConvert}>Text Conversion</button>
                        </div>
                    </div>

                    <div className="text-extracted-container">
                        <h2>Extracted Text</h2>
                        <p>p.s.: works well as long as key words/ideas are included. Text order might not matter</p>
                        <textarea
                            className="text-box"
                            value={extractedText}
                            onChange={(e) => setExtractedText(e.target.value)}
                        />
                            <button className="upload-image-btn" onClick={handleSubmit}>Chat</button>
                    </div>
                </div>
            )}
        </div>
    );
};



export default ImageUpload;
