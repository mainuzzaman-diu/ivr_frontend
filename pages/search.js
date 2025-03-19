// pages/search.js
import React, { useState } from "react";

export default function Search() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setResults([]);
    setIsLoading(true); // Start loading

    try {
      const url = new URL("http://localhost:8000/search");
      url.searchParams.append("query", query);
      if (category) {
        url.searchParams.append("category", category);
      }

      const response = await fetch(url, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to search");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="container">
      <h1>Search</h1>
      <form onSubmit={handleSearch} className="search-form">
        <div className="form-group">
          <label htmlFor="query">Query:</label>
          <input
            type="text"
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category (optional):</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="faq">FAQ</option>
            <option value="tuition">Tuition</option>
            <option value="general">General</option>
          </select>
        </div>
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? <div className="loader"></div> : "Search"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}
      <div className="results-container">
        {results.length > 0 ? (
          <ul className="results-list">
            {results.map((result, index) => (
              <li key={index} className="result-item">
                <p><strong>Score:</strong> {result.score}</p>
                <p><strong>Category:</strong> {result.metadata.category}</p>
                <p><strong>Question:</strong> {result.metadata.question}</p>
                <p><strong>Answer:</strong> {result.metadata.answer}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        h1 {
          font-size: 2rem;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }

        .search-form {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        label {
          display: block;
          font-weight: bold;
          margin-bottom: 5px;
          color: #555;
        }

        input, select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
          margin-bottom: 10px;
        }

        .search-button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .search-button:hover {
          background-color: #0056b3;
        }

        .search-button:disabled {
          background-color: #a5b4fc;
          cursor: not-allowed;
        }

        .loader {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #007bff;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .message {
          color: #d9534f;
          text-align: center;
          margin-bottom: 20px;
        }

        .results-container {
          background: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .results-list {
          list-style: none;
          padding: 0;
        }

        .result-item {
          background: white;
          padding: 15px;
          border-radius: 4px;
          margin-bottom: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .result-item p {
          margin: 5px 0;
          color: #333;
        }

        .result-item strong {
          color: #555;
        }
      `}</style>
    </div>
  );
}