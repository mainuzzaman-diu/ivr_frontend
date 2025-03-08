import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { BarChart, PieChart, Users, MessageSquare } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [chatHistory, setChatHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // useEffect(() => {
  //   const fetchChats = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await fetch(`/api/chat?search=${search}&page=${page}`);
  //       const data = await res.json();
  //       setChatHistory(data.chatHistory);
  //       setTotalPages(data.totalPages);
  //     } catch (error) {
  //       console.error("Failed to fetch chat history:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   if (status === "authenticated") {
  //     fetchChats();
  //   }
  // }, [search, page, status]);
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/chat-history?user_id=default_user`);
        const data = await res.json();
        console.log("Data is: ", data);
        setChatHistory(data.history);  // API returns history array
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchChats();
    }
  }, [status]);

  if (status === "loading") {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="d-flex min-vh-100 bg-light">
      {/* Sidebar */}
      <div className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
        <nav className="mt-4">
          <ul className="list-unstyled">
            <li className="text-primary fw-bold d-flex align-items-center gap-2">
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
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h4 fw-bold">Dashboard</h1>
          <div className="d-flex align-items-center gap-3">
            <Image src={session?.user?.image || '/user.png'} alt="User" width={40} height={40} className="rounded-circle" />
            <button className="btn btn-danger" onClick={() => signOut()}>Logout</button>
          </div>
        </div>

        {/* Chat History */}
        <div className="mt-4">
          <h5 className="fw-semibold">Recent Chats</h5>
          <input type="text" className="form-control my-3" placeholder="Search chats..." value={search} onChange={(e) => setSearch(e.target.value)} />
          {/* <div className="card p-3 shadow-sm">
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chat-grid">
                {chatHistory.length === 0 ? (
                  <div className="text-center p-3">No chat history found.</div>
                ) : (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className="border p-3 mb-2 rounded bg-white shadow-sm">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Chat ID: {chat.id}</span>
                        <span className="text-muted">{new Date(chat.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="mt-2"><strong>Message:</strong> {chat.message}</p>
                      <p><strong>Response:</strong> {chat.response}</p>
                      <p><strong>Summary:</strong> Dummy Text</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div> */}
          {/* <div className="card p-3 shadow-sm">
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chat-grid">
                {chatHistory.length === 0 ? (
                  <div className="text-center p-3">No chat history found.</div>
                ) : (
                  chatHistory.map((chat, index) => (
                    <div key={index} className="border p-3 mb-2 rounded bg-white shadow-sm">
                      <p><strong>Chat:</strong> {chat}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div> */}
          <div className="card p-3 shadow-sm">
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : (
              <div className="chat-grid">
                {chatHistory.length === 0 ? (
                  <div className="text-center p-3">No chat history found.</div>
                ) : (
                  chatHistory.map((chat) => (
                    <div key={chat.id} className="border p-3 mb-2 rounded bg-white shadow-sm">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">Chat ID: {chat.id}</span>
                        <span className="text-muted">{new Date(chat.timestamp * 1000).toLocaleString()}</span>
                      </div>
                      <p className="mt-2"><strong>Message:</strong> {chat.message}</p>
                      <p><strong>Response:</strong> {chat.response}</p>
                      <p><strong>Summary:</strong> {chat.summary}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>


          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-primary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
            <span>Page {page} of {totalPages}</span>
            <button className="btn btn-primary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
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

// // Utility function to generate summary
// function generateSummary(message, response) {
//   const maxLen = 60;
//   const shortMsg = message.length > maxLen ? message.substring(0, maxLen) + "..." : message;
//   const shortRes = response.length > maxLen ? response.substring(0, maxLen) + "..." : response;
//   return `Msg: ${shortMsg}\nRes: ${shortRes}`;
// }

// export default function Dashboard() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [chatHistory, setChatHistory] = useState([]);
//   const [search, setSearch] = useState("");
//   const [submittedSearch, setSubmittedSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isLoading, setIsLoading] = useState(false);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     }
//   }, [status, router]);

//   // Fetch chat data
//   useEffect(() => {
//     const fetchChats = async () => {
//       setIsLoading(true);
//       try {
//         const res = await fetch(`/api/chat?search=${submittedSearch}&page=${page}`);
//         const data = await res.json();
//         setChatHistory(data.chatHistory);
//         setTotalPages(data.totalPages);
//       } catch (error) {
//         console.error("Failed to fetch chat history:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     if (status === "authenticated") {
//       fetchChats();
//     }
//   }, [submittedSearch, page, status]);

//   if (status === "loading") {
//     return <div className="text-center mt-5">Loading...</div>;
//   }

//   return (
//     <div className="dashboard">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="sidebar-brand">
//           {/* <img src="/path/to/logo.png" alt="Keen" className="logo" /> */}
//           <Image
//             src="/logo.png"
//             alt="DRC"
//             className="logo rounded-logo"
//             width={80}
//             height={80}
//             style={{ borderRadius: '50%' }}  // Added inline style for rounded shape
//           />

//           {/* <Image src="/logo.png" alt="Keen" className="logo" width={40} height={40} /> */}

//         </div>
//         <nav className="sidebar-menu">
//           <ul>
//             <li className="active"><a href="#"><i className="icon-dashboard"></i> Dashboard</a></li>
//             <li><a href="#"><i className="icon-chats"></i> Chats</a></li>
//             <li><a href="#"><i className="icon-projects"></i> Projects</a></li>
//             <li><a href="#"><i className="icon-account"></i> Account</a></li>
//             <li><a href="#"><i className="icon-settings"></i> Settings</a></li>
//           </ul>
//         </nav>
//       </div>

//       {/* Main Content */}
//       <div className="main-content">
//         {/* Top Bar */}
//         <header className="topbar">
//           <div className="search-container">
//             <input
//               type="text"
//               placeholder="Search chats..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <button
//               className="btn-search"
//               onClick={() => {
//                 setSubmittedSearch(search);
//                 setPage(1);
//               }}
//             >
//               Search
//             </button>
//           </div>
//           <div className="user-menu">
//             <Image src={session?.user?.image || '/user.png'} alt="User" className="user-avatar" width={60} height={60} />
//             {/* <img src={session?.user?.image || '/default-avatar.png'} alt="User" className="user-avatar" /> */}
//           </div>
//         </header>

//         {/* Dashboard Overview */}
//         <div className="dashboard-overview">
//           <div className="overview-card">
//             <div className="card-header">
//               <h3>Chat Interactions</h3>
//               <span className="badge bg-primary">69</span>
//             </div>
//             <div className="card-body">
//               <div className="progress-container">
//                 <div className="progress-bar"></div>
//                 <div className="progress-details">
//                   <span>Total Chats: 69,700</span>
//                   <span className="text-success">+12.5%</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="performance-overview">
//             <h4>Performance Overview</h4>
//             <div className="performance-chart"></div>
//           </div>
//         </div>

//         {/* Chat History */}
//         <div className="chat-history">
//           <h2>Recent Chats</h2>
//           {isLoading ? (
//             <div className="loader"></div>
//           ) : (
//             <div className="chat-grid">
//               {chatHistory.map((chat) => (
//                 <div key={chat.id} className="chat-card">
//                   <div className="chat-header">
//                     <span>Chat ID: {chat.id}</span>
//                     <span className="timestamp">
//                       {new Date(chat.timestamp).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="chat-body">
//                     <p><strong>Message:</strong> {chat.message}</p>
//                     <p><strong>Response:</strong> {chat.response}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Pagination */}
//           <div className="pagination">
//             <button
//               disabled={page <= 1}
//               onClick={() => setPage(page - 1)}
//             >
//               Previous
//             </button>
//             <span>Page {page} of {totalPages}</span>
//             <button
//               disabled={page >= totalPages}
//               onClick={() => setPage(page + 1)}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Global Styles */}
//       <style jsx global>{`
//         body {
//           background-color: #f4f6f9;
//           font-family: 'Inter', sans-serif;
//         }

//         .dashboard {
//           display: flex;
//           min-height: 100vh;
//         }

//         .sidebar {
//           width: 250px;
//           background-color: #1e1e2d;
//           color: #fff;
//           padding: 20px;
//         }

//         .sidebar-brand .logo {
//           max-width: 120px;
//           margin-bottom: 30px;
//         }

//         .sidebar-menu ul {
//           list-style: none;
//           padding: 0;
//         }

//         .sidebar-menu li {
//           margin-bottom: 15px;
//         }

//         .sidebar-menu a {
//           color: #7e8299;
//           text-decoration: none;
//           display: flex;
//           align-items: center;
//           gap: 10px;
//         }

//         .sidebar-menu li.active a {
//           color: #fff;
//           font-weight: bold;
//         }

//         .main-content {
//           flex-grow: 1;
//           padding: 20px;
//           background-color: #f4f6f9;
//         }

//         .topbar {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           margin-bottom: 20px;
//         }

//         .search-container {
//           display: flex;
//           gap: 10px;
//         }

//         .user-menu {
//           display: flex;
//           align-items: center;
//           gap: 15px;
//         }

//         .user-avatar {
//           width: 40px;
//           height: 40px;
//           border-radius: 50%;
//         }

//         .dashboard-overview {
//           display: flex;
//           gap: 20px;
//           margin-bottom: 30px;
//         }

//         .overview-card {
//           background-color: #fff;
//           border-radius: 8px;
//           padding: 20px;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//           flex-grow: 1;
//         }

//         .chat-history {
//           background-color: #fff;
//           border-radius: 8px;
//           padding: 20px;
//           box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//         }

//         .chat-grid {
//           display: grid;
//           grid-template-columns: repeat(2, 1fr);
//           gap: 20px;
//         }

//         .chat-card {
//           border: 1px solid #e4e6ef;
//           border-radius: 8px;
//           padding: 15px;
//         }
//       `}</style>
//     </div>
//   );
// }
