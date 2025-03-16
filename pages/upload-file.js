import React, { useState } from "react";

export default function UploadFilePage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // Prepare form data
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      // Make sure this URL matches your FastAPI "upload" endpoint
      const res = await fetch("http://localhost:8000/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        // Attempt to parse error details from the response
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || "Upload failed");
      }

      const data = await res.json();
      setUploadStatus(`File '${data.filename}' uploaded successfully!`);
    } catch (error) {
      setUploadStatus(`Error uploading file: ${error.message}`);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">Upload File</h2>
      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label htmlFor="fileInput" className="form-label fw-semibold">
            Choose a JSON file
          </label>
          <input
            type="file"
            className="form-control"
            id="fileInput"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Upload
        </button>
      </form>

      {uploadStatus && (
        <div className="alert alert-info mt-3">{uploadStatus}</div>
      )}
    </div>
  );
}
