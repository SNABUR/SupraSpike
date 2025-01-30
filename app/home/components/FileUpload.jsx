import React, {useState, useRef} from "react";


function FileUpload({ onFileSelect }) {
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const fileInputRef = useRef(null); 
  
  
    const handleDragOver = (event) => {
        event.preventDefault(); 
    };
  
    const handleDrop = (event) => {
        event.preventDefault();
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            setFile(file);
            updatePreview(file);
        }
    };
  
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
        updatePreview(file);
        onFileSelect(file);
    };
  
    const handleClick = () => {
      fileInputRef.current.click();
    };
  
    const updatePreview = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };
  
    const handleRemoveFile = () => {
      setFile(null);
      setPreviewUrl(null);
    };
  
  
  
    return (
        <div>
            <div
                onClick={handleClick} 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex border-dashed border-4 border-gray-500 py-1 px-5 text-center cursor-pointer"
                style={{ width: 240, minHeight: 150,  maxHeight: "auto" }}
            >
                {previewUrl ? (
                  <div className="relative">
                    <div className="flex justify-center">
                      <img src={previewUrl} alt="Preview" className="max-w-full max-h-96 object-contain" />
                    </div>
                    <div className="absolute top-0 right-0">
                      <button onClick={handleRemoveFile} className="text-black rounded-full p-1 cursor-pointer hover:bg-blue-100 text-3xl">
                        X
                      </button>
                    </div>
                  </div>
  
                ) : (
                  <div className="flex text-center text-gray-700 items-center justify-center italic">  
                      Drag and drop an image here, or click to select File Image
                  </div>
              )}
                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
  
                />
            </div>
  
        </div>
    );
  }

  export default FileUpload;