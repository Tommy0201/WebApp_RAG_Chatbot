import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JSZip from 'jszip';
import './imageUpload.css';

const ImageUpload = () => {
    const [files, setFiles] = useState([]);
    const [isValidFiles, setIsValidFiles] = useState(false);
    const [processedImages, setProcessedImages] = useState([]);
    const [extractedText, setExtractedText] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const navigate = useNavigate();

    const extractImagesFromZip = async (zipBlob) => {
        const urls = [];
        const zip = new JSZip();
        
        try {
            const contents = await zip.loadAsync(zipBlob);
            
            for (const filename of Object.keys(contents.files)) {
                if (!contents.files[filename].dir) {
                    const blob = await contents.files[filename].async('blob');
                    const url = URL.createObjectURL(new Blob([blob], { type: 'image/jpeg' }));
                    urls.push(url);
                }
            }
            
            return urls;
        } catch (error) {
            console.error('Error extracting images from zip:', error);
            throw error;
        }
    };



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
            } catch (error) {
                console.log("Failed to send delete request to database ", error)
            }
        };
        deleteDatabase();
    }, []);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(file => 
            file.type === 'image/jpeg' || 
            file.type === 'image/png' || 
            file.type === 'image/jpg'
        );

        if (validFiles.length !== selectedFiles.length) {
            alert('Only JPG or PNG files are allowed.');
        }

        if (validFiles.length > 0) {
            setFiles(validFiles);
            setIsValidFiles(true);
        } else {
            setFiles([]);
            setIsValidFiles(false);
        }
    };

    const handleUpload = async () => {
        if (isValidFiles) {
            setIsUploading(true);
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            try {
                const response = await fetch('http://localhost:8000/images_processing', {
                    method: 'POST',
                    body: formData,
                });
 
                if (response.ok) {
                    // Handle single image or zip file response
                    const contentType = response.headers.get('content-type');
                    
                    if (contentType === 'image/jpeg') {
                        // Single image response
                        const blob = await response.blob();
                        const url = URL.createObjectURL(blob);
                        setProcessedImages([url]);
                    } else if (contentType === 'application/zip') {
                        // Multiple images in zip file
                        const zipBlob = await response.blob();
                        const processedUrls = await extractImagesFromZip(zipBlob);
                        setProcessedImages(processedUrls);
                    } else {
                        throw new Error('Unexpected response type');
                    }
                } else {
                    alert('Failed to process images.');
                }
            } catch (error) {
                console.error('Error uploading images:', error);
                alert('Error uploading images. Please try again.');
            } finally {
                setIsUploading(false);
            }

        }
    };

    const handleTextConvert = async () => {
        if (processedImages.length > 0) {
            const formData = new FormData();
            files.forEach(file => formData.append('images', file));

            try {
                const host = process.env.REACT_APP_CHOST || "http://localhost";
                const port = process.env.REACT_APP_CPORT || "8000";
                const service_uri = `${host}:${port}/images_to_text`;

                const response = await fetch(service_uri, {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const result = await response.json();
                    setExtractedText(result.extracted_texts);
                } else {
                    alert('Failed to extract text from images.');
                }
            } catch (error) {
                console.error('Error converting images to text:', error);
                alert('Error extracting text. Please try again.');
            }
        }
    };

    const handleRetake = () => {
        // Clean up URLs to prevent memory leaks
        processedImages.forEach(url => URL.revokeObjectURL(url));
        setFiles([]);
        setIsValidFiles(false);
        setProcessedImages([]);
        setExtractedText('');
    };

    const handleSubmit = async () => {
        if (extractedText && files.length > 0) {
            const formData = new FormData();
            formData.append('submit_text', extractedText);
            formData.append('image', files[0]); // Using first image for PDF generation

            const host = process.env.REACT_APP_CHOST || "http://localhost";
            const port = process.env.REACT_APP_CPORT || "8000";
            const service_uri = `${host}:${port}/text_to_database`;

            try {
                const response = await fetch(service_uri, {
                    method: 'POST',
                    body: formData,
                });
                if (response.ok) {
                    const pdfBlob = await response.blob();
                    const pdfUrl = URL.createObjectURL(pdfBlob);
                    navigate('/chat', { state: { file: pdfUrl } });
                } else {
                    alert('Failed to process the images and generate PDF.');
                }
            } catch (error) {
                console.error('Error submitting extracted text to database');
            }
        }
        navigate('/chat');
    };

    return (
        <div className="upload-page">
            <h1>Upload Your Images (JPG or PNG)</h1>

            {!isValidFiles && processedImages.length === 0 && (
                <>
                    <label htmlFor="file-upload" className="upload-image-btn">Choose Files</label>
                    <input type="file" id="file-upload" accept=".jpg,.jpeg,.png" onChange={handleFileChange} multiple style={{ display: 'none' }} />
                    <h2>or</h2>
                    <h1>Straight to Chatbot</h1>
                    <button className="upload-image-btn" onClick={handleSubmit}>Chat</button>
                </>
            )}

            {isValidFiles && processedImages.length === 0 && !isUploading && (
                <div className="file-info">
                    <p>Selected Files: {files.map(f => f.name).join(', ')}</p>
                    <button className="upload-image-btn" id="preprocessing-btn" onClick={handleUpload}>Preprocessing</button>
                </div>
            )}

            {isUploading && <p>Uploading...</p>}
            {processedImages.length > 0 && (
        <div className="content-container">
            <div className="processed-image-container">
                <h2>Processed Images</h2>
                <div className="image-scroll-container">
                    <div className="image-wrapper">
                        {processedImages.map((imgUrl, index) => (
                            <img key={index} src={imgUrl} alt={`Processed ${index + 1}`} className="processed-image" />
                        ))}
                    </div>
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


