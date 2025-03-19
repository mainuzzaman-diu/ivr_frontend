// pages/upload_qa.js
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";

export default function UploadQA() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const [category, setCategory] = useState("faq");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true); // Start loading

    try {
      const response = await fetch("http://localhost:8000/embed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          data: { question, answer },
        }),
      });

      if (!response.ok) throw new Error("Failed to embed data");
      const result = await response.json();
      setMessage(`Successfully embedded with ID: ${result.id}`);

      setQuestion("");
      setAnswer("");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  if (status === "loading") {
    return (
      <div className="loading-container">
        <p>Loading...</p>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          p {
            font-size: 1.125rem;
            color: #374151;
          }
        `}</style>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="container">
        <h1>Upload Question & Answer</h1>

        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="faq">FAQ</option>
                <option value="tuition">Tuition</option>
                <option value="general">General</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="question">Question</label>
              <input
                id="question"
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="answer">Answer</label>
              <textarea
                id="answer"
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter the answer here"
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? <div className="loader"></div> : "Submit"}
            </button>
          </form>

          {message && <div className="message">{message}</div>}
        </div>

        <style jsx>{`
          .container {
            min-height: 100vh;
            background-color: #f3f4f6;
            padding: 2rem 1rem;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 1.5rem;
          }

          .form-container {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            width: 100%;
            max-width: 32rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          label {
            display: block;
            font-size: 0.875rem;
            font-weight: 600;
            color: #4b5563;
            margin-bottom: 0.5rem;
          }

          select,
          input,
          textarea {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #e5e7eb;
            border-radius: 0.5rem;
            background-color: #f9fafb;
            font-size: 0.875rem;
            transition: all 0.2s ease;
          }

          select:focus,
          input:focus,
          textarea:focus {
            outline: none;
            border-color: #6366f1;
            box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
            background-color: white;
          }

          textarea {
            resize: vertical;
            min-height: 6rem;
          }

          .submit-btn {
            width: 100%;
            padding: 0.75rem;
            background-color: #4f46e5;
            color: white;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .submit-btn:disabled {
            background-color: #a5b4fc;
            cursor: not-allowed;
          }

          .loader {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #4f46e5;
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
            margin-top: 1rem;
            font-size: 0.875rem;
            color: #4b5563;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return null;
}


// // pages/upload_qa.js
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/router";
// import React, { useState, useEffect } from "react";

// export default function UploadQA() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   // Redirect unauthenticated users to the login page
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     }
//   }, [status, router]);

//   // State for form inputs
//   const [category, setCategory] = useState("faq");
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [message, setMessage] = useState("");

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(""); // Clear previous messages

//     try {
//       const response = await fetch("http://localhost:8000/embed", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           category,
//           data: { question, answer },
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to embed data");
//       }

//       const result = await response.json();
//       setMessage(`Successfully embedded with ID: ${result.id}`);
//       // Clear form fields after success
//       setQuestion("");
//       setAnswer("");
//     } catch (error) {
//       setMessage(`Error: ${error.message}`);
//     }
//   };

//   // Show loading state
//   if (status === "loading") {
//     return <p className="text-center mt-10">Loading...</p>;
//   }

//   // Render form for authenticated users
//   if (status === "authenticated") {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
//         <div className="w-full max-w-md bg-white rounded-md shadow-md p-6">
//           <h1 className="text-2xl font-semibold mb-6 text-center">Upload Question and Answer</h1>
//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Category Dropdown */}
//             <div>
//               <label
//                 htmlFor="category"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Category:
//               </label>
//               <select
//                 id="category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md
//                            focus:outline-none focus:ring-1 focus:ring-indigo-500
//                            focus:border-indigo-500"
//               >
//                 <option value="faq">FAQ</option>
//                 <option value="tuition">Tuition</option>
//                 <option value="general">General</option>
//               </select>
//             </div>

//             {/* Question Input */}
//             <div>
//               <label
//                 htmlFor="question"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Question:
//               </label>
//               <input
//                 type="text"
//                 id="question"
//                 value={question}
//                 onChange={(e) => setQuestion(e.target.value)}
//                 required
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md
//                            focus:outline-none focus:ring-1 focus:ring-indigo-500
//                            focus:border-indigo-500"
//                 placeholder="Enter your question"
//               />
//             </div>

//             {/* Answer Textarea */}
//             <div>
//               <label
//                 htmlFor="answer"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Answer:
//               </label>
//               <textarea
//                 id="answer"
//                 value={answer}
//                 onChange={(e) => setAnswer(e.target.value)}
//                 required
//                 rows={4}
//                 className="block w-full px-3 py-2 border border-gray-300 rounded-md
//                            focus:outline-none focus:ring-1 focus:ring-indigo-500
//                            focus:border-indigo-500"
//                 placeholder="Enter the answer here"
//               />
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md
//                          hover:bg-indigo-700 focus:outline-none focus:ring-2
//                          focus:ring-indigo-500 focus:ring-offset-2"
//             >
//               Submit
//             </button>
//           </form>

//           {/* Status / Error Message */}
//           {message && (
//             <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Return nothing if not authenticated
//   return null;
// }
