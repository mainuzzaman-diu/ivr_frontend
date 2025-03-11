import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BarChart, Users } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSummaryFor, setLoadingSummaryFor] = useState(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const fetchChats = async () => {
    if (!userId.trim()) {
      alert("Please enter a User ID!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/chat-history?user_id=${userId}`);
      const data = await res.json();
      console.log("Fetched Data:", data);
      setChatHistory(data.history);
    } catch (error) {
      console.error("Failed to fetch chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async (chatId) => {
    try {
      setLoadingSummaryFor(chatId);
      const response = await fetch("http://localhost:8000/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, user_id: userId }),
      });
      const data = await response.json();
      if (data.summary) {
        const updatedChats = chatHistory.map((chat) => {
          if (chat.id === chatId) {
            return { ...chat, summary: data.summary };
          }
          return chat;
        });
        setChatHistory(updatedChats);
      }
    } catch (error) {
      console.error("Failed to generate summary:", error);
    } finally {
      setLoadingSummaryFor(null);
    }
  };

  if (status === "loading") {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
        <nav className="mt-4">
          <ul className="list-unstyled">
            <li className="text-primary fw-bold d-flex align-items-center gap-2 mb-3">
              <BarChart size={20} /> Dashboard
            </li>
            <li className="d-flex align-items-center gap-2">
              <Users size={20} /> Teams
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h4 fw-bold mb-0">Dashboard</h1>
          <div className="d-flex align-items-center gap-3">
            <Image
              src={session?.user?.image || "/user.png"}
              alt="User"
              width={40}
              height={40}
              className="rounded-circle"
            />
            <button className="btn btn-danger" onClick={() => signOut()}>
              Logout
            </button>
          </div>
        </div>

        {/* Container for search input & results */}
        <div className="container-fluid px-0">
          <div className="row">
            <div className="col-12 col-md-6">
              <h5 className="fw-semibold">Search Chats by User ID</h5>
              {/* <div className="input-group my-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter User ID..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <button className="btn btn-primary" onClick={fetchChats}>
                  Search
                </button>
              </div> */}
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // Prevents page reload
                  fetchChats(); // Calls the fetchChats function
                }}
                className="d-flex"
              >
                <input
                  type="text"
                  className="form-control my-3"
                  placeholder="Enter User ID..."
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                />
                <button
                  type="submit"
                  className="btn btn-primary ms-2 my-3"
                >
                  Search
                </button>
              </form>

            </div>
          </div>

          {/* Chat History */}
          <div className="row">
            {isLoading ? (
              <div className="col-12 text-center my-5">
                <span className="spinner-border text-primary" role="status"></span>
                <p className="mt-2">Fetching data...</p>
              </div>
            ) : !chatHistory || chatHistory.length === 0 ? (
              <div className="col-12 text-center p-3">
                <div className="alert alert-info mb-0">
                  No chat history found.
                </div>
              </div>
            ) : (
              chatHistory.map((chat) => (
                <div key={chat.id} className="col-12 col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-header d-flex justify-content-between">
                      <span className="fw-bold">Chat ID: {chat.id}</span>
                      <small className="text-muted">
                        {new Date(chat.timestamp * 1000).toLocaleString()}
                      </small>
                    </div>
                    <div className="card-body">
                      <p className="card-text">
                        <strong>Message:</strong> {chat.message}
                      </p>
                      <p className="card-text">
                        <strong>Response:</strong> {chat.response}
                      </p>
                      <p className="card-text">
                        <strong>Cost (Estimated):</strong>{" "}
                        {(chat.total_cost ?? 0).toFixed(6)}$
                      </p>
                      <p className="card-text">
                        <strong>Summary:</strong>{" "}
                        {chat.summary ? chat.summary : "No summary yet."}
                      </p>
                    </div>
                    <div className="card-footer bg-white text-end">
                      {/* <button
                        className="btn btn-primary rounded-pill px-4 fw-semibold"
                        onClick={() => handleGenerateSummary(chat.id)}
                        disabled={loadingSummaryFor === chat.id}
                      >
                        {loadingSummaryFor === chat.id ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm"
                              role="status"
                              aria-hidden="true"
                            />
                            &nbsp;Generating...
                          </>
                        ) : (
                          "Generate Summary"
                        )}
                      </button> */}
                      <button
                        className="btn btn-gradient rounded-pill px-4 fw-semibold"
                        onClick={() => handleGenerateSummary(chat.id)}
                        disabled={loadingSummaryFor === chat.id}
                      >
                        {loadingSummaryFor === chat.id ? "Generating..." : "Generate Summary"}
                      </button>

                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/router";
// import { BarChart, Users } from "lucide-react";
// import "bootstrap/dist/css/bootstrap.min.css";

// export default function Dashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const [chatHistory, setChatHistory] = useState([]);
//   const [userId, setUserId] = useState(""); // User ID input state
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     }
//   }, [status, router]);

//   // Function to fetch chat history based on user input
//   const fetchChats = async () => {
//     if (!userId.trim()) {
//       alert("Please enter a User ID!");
//       return;
//     }

//     setIsLoading(true); // Show loading animation
//     try {
//       const res = await fetch(`http://localhost:8000/chat-history?user_id=${userId}`);
//       const data = await res.json();
//       console.log("Fetched Data:", data);
//       setChatHistory(data.history);
//     } catch (error) {
//       console.error("Failed to fetch chat history:", error);
//     } finally {
//       setIsLoading(false); // Hide loading animation
//     }
//   };
//   const [loadingSummaryFor, setLoadingSummaryFor] = useState(null);

//   // Generate summary for a specific chat
//   const handleGenerateSummary = async (chatId) => {
//     try {
//       setLoadingSummaryFor(chatId);
//       const response = await fetch("http://localhost:8000/generate-summary", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ chat_id: chatId, user_id: userId }),
//       });
//       const data = await response.json();
//       if (data.summary) {
//         // Update the summary in the local state
//         const updatedChats = chatHistory.map((chat) => {
//           if (chat.id === chatId) {
//             return { ...chat, summary: data.summary };
//           }
//           return chat;
//         });
//         setChatHistory(updatedChats);
//       }
//     } catch (error) {
//       console.error("Failed to generate summary:", error);
//     } finally {
//       setLoadingSummaryFor(null);
//     }
//   };
//   if (status === "loading") {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   return (
//     <div className="d-flex min-vh-100 bg-light">
//       {/* Sidebar */}
//       <div className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
//         <Image src="/logo.png" alt="Logo" width={60} height={60} />
//         <nav className="mt-4">
//           <ul className="list-unstyled">
//             <li className="text-primary fw-bold d-flex align-items-center gap-2">
//               <BarChart size={20} /> Dashboard
//             </li>
//             <li className="d-flex align-items-center gap-2">
//               <Users size={20} /> Teams
//             </li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="flex-grow-1 p-4">
//         <div className="d-flex justify-content-between align-items-center">
//           <h1 className="h4 fw-bold">Dashboard</h1>
//           <div className="d-flex align-items-center gap-3">
//             <Image src={session?.user?.image || '/user.png'} alt="User" width={40} height={40} className="rounded-circle" />
//             <button className="btn btn-danger" onClick={() => signOut()}>Logout</button>
//           </div>
//         </div>

//         {/* Search Input */}
//         <div className="mt-4">
//           <h5 className="fw-semibold">Search Chats by User ID</h5>
//           <div className="d-flex">
//             <input
//               type="text"
//               className="form-control my-3"
//               placeholder="Enter User ID..."
//               value={userId}
//               onChange={(e) => setUserId(e.target.value)}
//             />
//             <button className="btn btn-primary ms-2 my-3" onClick={fetchChats}>
//               Search
//             </button>
//           </div>

//           {/* Chat History */}
//           <div className="card p-3 shadow-sm">
//             {isLoading ? (
//               <div className="text-center">
//                 <span className="spinner-border text-primary" role="status"></span>
//                 <p>Fetching data...</p>
//               </div>
//             ) : (
//               <div className="chat-grid">
//                 {!chatHistory || chatHistory.length === 0 ? (
//                   <div className="text-center p-3">No chat history found.</div>
//                 ) : (
//                   chatHistory.map((chat) => (
//                     <div key={chat.id} className="border p-3 mb-2 rounded bg-white shadow-sm">
//                       <div className="d-flex justify-content-between">
//                         <span className="fw-bold">Chat ID: {chat.id}</span>
//                         <span className="text-muted">{new Date(chat.timestamp * 1000).toLocaleString()}</span>
//                       </div>
//                       <p className="mt-2"><strong>Message:</strong> {chat.message}</p>
//                       <p><strong>Response:</strong> {chat.response}</p>
//                       <p>
//                         <strong>Cost (Estimated):</strong>{" "}
//                         {(chat.total_cost ?? 0).toFixed(6)}$
//                       </p>

//                       {/* <p><strong>Summary:</strong> {chat.summary}</p> */}
//                       <p>
//                         <strong>Summary:</strong>{" "}
//                         {chat.summary ? chat.summary : "No summary yet."}
//                       </p>
//                       {/* <button
//                         className="btn btn-sm btn-secondary"
//                         onClick={() => handleGenerateSummary(chat.id)}
//                       >
//                         Generate Summary
//                       </button> */}
//                       <button
//                         className="btn btn-sm btn-secondary"
//                         onClick={() => handleGenerateSummary(chat.id)}
//                         disabled={loadingSummaryFor === chat.id}
//                       >
//                         {loadingSummaryFor === chat.id ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
//                             &nbsp;Generating...
//                           </>
//                         ) : (
//                           "Generate Summary"
//                         )}
//                       </button>
//                     </div>
//                   ))
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

