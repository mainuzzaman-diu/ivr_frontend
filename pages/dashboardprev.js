import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";

// Reusable Overview Card Component
const OverviewCard = ({ title, count, badgeColor }) => {
  return (
    <div className="overview-card">
      <div className="card-header">
        <h3>{title}</h3>
        {badgeColor && <span className="badge" style={{ backgroundColor: badgeColor }}>{count}</span>} {/* Conditional badge */}
        {!badgeColor && <span className="badge">{count}</span>} {/* Default badge */}
      </div>
      <div className="card-body">
        {/* You can add charts or more detailed info here later */}
      </div>
    </div>
  );
};

// Project Card Component
const ProjectCard = ({ projectName, progress, lastUpdate, projectType }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <span className="project-type-badge">{projectType}</span> {/* Project type badge */}
        <h3>{projectName}</h3>
      </div>
      <div className="project-progress">
        <div className="progress-bar-container"> {/* Progress bar container */}
          <div className="progress-bar" style={{ width: progress }}></div> {/* Dynamic width */}
        </div>
        <span className="progress-text">Progress in {progress} - {lastUpdate}</span>
      </div>
    </div>
  );
};

// Task Item Component
const TaskItem = ({ taskText, checked, overdue }) => {
  return (
    <div className="task-item">
      <label className="checkbox-container">
        <input type="checkbox" checked={checked} />
        <span className="checkmark"></span> {/* Custom checkbox */}
        <span className="task-label">{taskText}</span>
      </label>
      {overdue && <span className="overdue-label">{overdue}</span>} {/* Overdue label */}
    </div>
  );
};


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [chatHistory, setChatHistory] = useState([]);
  const [search, setSearch] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch chat data (example - you might adapt or remove this for your actual dashboard)
  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/chat?search=${submittedSearch}&page=${page}`);
        const data = await res.json();
        setChatHistory(data.chatHistory);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (status === "authenticated") {
      fetchChats();
    }
  }, [submittedSearch, page, status]);

  if (status === "loading") {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-brand">
          <Image
            src="/logo.png"
            alt="DRC"
            className="logo rounded-logo"
            width={80}
            height={80}
            style={{ borderRadius: '50%' }}
          />
        </div>
        <nav className="sidebar-menu">
          <ul>
            <li className="active"><a href="#"><i className="icon-dashboard"></i> Dashboard</a></li>
            <li><a href="#"><i className="icon-chats"></i> App Pages</a></li>
            <li><a href="#"><i className="icon-projects"></i> Auth</a></li>
            <li><a href="#"><i className="icon-account"></i> User</a></li>
            <li><a href="#"><i className="icon-settings"></i> Layouts</a></li>
            <li><a href="#"><i className="icon-settings"></i> Landing Page</a></li>
            <li className=""><a href="#"><i className="icon-dashboard"></i> INTERFACES</a></li>
            <li><a href="#"><i className="icon-chats"></i> Components</a></li>
            <li><a href="#"><i className="icon-projects"></i> Forms</a></li>
            <li><a href="#"><i className="icon-account"></i> Tables</a></li>
            <li><a href="#"><i className="icon-settings"></i> Collections</a></li>
            <li><a href="#"><i className="icon-settings"></i> Level Menu</a></li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Bar */}
        <header className="topbar">
          <div className="topbar-left">
            <div className="search-container">
              <input
                type="text"
                placeholder="Q Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="btn-search"
                onClick={() => {
                  setSubmittedSearch(search);
                  setPage(1);
                }}
              >
                Search
              </button>
            </div>
          </div>
          <div className="topbar-right">
            <div className="user-info">
              <span className="user-name">Beni Artsandi</span>
              <span className="user-role">Marketing Manager</span>
            </div>
            <div className="user-menu">
              <Image src={session?.user?.image || '/user.png'} alt="User" className="user-avatar" width={35} height={35} />
            </div>
          </div>
        </header>

        {/* Dashboard Overview */}
        <div className="dashboard-overview">
          <OverviewCard title="Teams" count={8} />
          <OverviewCard title="Projects" count={12} />
          <OverviewCard title="Active Tasks" count={64} />
          <OverviewCard title="ONGOING TASKS" count={8} badgeColor="#f59f80" />
        </div>

        {/* Completion Tasks */}
        <div className="overview-card completion-tasks-card">
          <div className="card-header">
            <h3>Completion Tasks</h3>
          </div>
          <div className="card-body">
            <div className="bar-chart-placeholder">
              {/* Chart will be rendered here */}
            </div>
          </div>
        </div>

        {/* Tasks Performance & Leaderboard */}
        <div className="dashboard-overview">
          {/* Tasks Performance */}
          <div className="overview-card tasks-performance-card">
            <div className="card-header">
              <h3>Tasks Performance</h3>
            </div>
            <div className="card-body performance-charts">
              <div className="donut-chart-placeholder">
                {/* Donut chart 1 */}
              </div>
              <div className="donut-chart-placeholder">
                {/* Donut chart 2 */}
              </div>
              <div className="donut-chart-placeholder">
                {/* Donut chart 3 */}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="overview-card leaderboard-card">
            <div className="card-header">
              <h3>Leaderboard</h3>
            </div>
            <div className="card-body leaderboard-content">
              <div className="leaderboard-header-row">
                <span>Tasks</span>
                <span>Completed</span>
                <span>Active</span>
                <span>Overdue</span>
              </div>
              {/* Leaderboard list items will go here */}
              <div className="leaderboard-item-row">
                <div className="leaderboard-user">
                  <Image src="/user.png" alt="User 1" className="leaderboard-avatar" width={30} height={30} />
                  <span>Tasks</span>
                </div>
                <span className="completed-tasks">100%</span>
                <span className="active-tasks">75%</span>
                <span className="overdue-tasks">60%</span>
              </div>
              <div className="leaderboard-item-row">
                <div className="leaderboard-user">
                  <Image src="/user.png" alt="User 2" className="leaderboard-avatar" width={30} height={30} />
                  <span>Computed</span>
                </div>
                <span className="completed-tasks">80%</span>
                <span className="active-tasks">90%</span>
                <span className="overdue-tasks">20%</span>
              </div>
              <div className="leaderboard-item-row">
                <div className="leaderboard-user">
                  <Image src="/user.png" alt="User 3" className="leaderboard-avatar" width={30} height={30} />
                  <span>Althe</span>
                </div>
                <span className="completed-tasks">95%</span>
                <span className="active-tasks">65%</span>
                <span className="overdue-tasks">10%</span>
              </div>
            </div>
          </div>
        </div>


        {/* Active Projects and Active Tasks: To-Dos */}
        <div className="dashboard-overview">
          {/* Active Projects */}
          <div className="active-projects-section">
            <h2>Active Projects</h2>
            <div className="active-projects-grid">
              <ProjectCard
                projectName="Looper Admin Theme"
                progress="74%"
                lastUpdate="Last update 1h"
                projectType="LT"
              />
              <ProjectCard
                projectName="Smart Paper"
                progress="88%"
                lastUpdate="Last update 2h"
                projectType="SP"
              />
              <ProjectCard
                projectName="Online Store"
                progress="24%"
                lastUpdate="Last update 2d"
                projectType="OS"
              />
            </div>
          </div>

          {/* Active Tasks: To-Dos */}
          <div className="active-tasks-section">
            <h2>Active Tasks: To-Dos</h2>
            <div className="active-tasks-list">
              <TaskItem taskText="Looper Admin Theme (1/3)" checked={true} />
              <TaskItem taskText="Eat com on the cob" checked={false} />
              <TaskItem taskText="Misuppitsher-al-sangria" checked={false} />
              <TaskItem taskText="Have a barbecue" checked={false} />
              <TaskItem taskText="Ride a roller coasters" checked={false} overdue="Overdue in 3 days" />
            </div>
          </div>
        </div>


      </div>

      {/* Global Styles */}
      <style jsx global>{`
        body {
          background-color: #f4f6f9;
          font-family: 'Inter', sans-serif;
          margin: 0;
          padding: 0;
        }

        .dashboard {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex-grow: 1;
          padding: 20px;
          background-color: #f4f6f9;
        }


        .sidebar {
          width: 240px; /* Slightly narrower sidebar to match image */
          background-color: #1e1e2d;
          color: #fff;
          padding: 20px;
          overflow-y: auto; /* In case menu is longer than viewport */
          height: 100vh; /* Ensure sidebar takes full height */
          position: sticky; /* Sticky sidebar */
          top: 0;      /* Sticky sidebar */
        }

        .sidebar-brand {
          margin-bottom: 30px;
          text-align: center; /* Center logo in sidebar */
        }

        .sidebar-brand .logo {
          max-width: 100%; /* Ensure logo fits within sidebar width */
          height: auto;    /* Maintain aspect ratio */
        }

        .sidebar-menu ul {
          list-style: none;
          padding: 0;
        }

        .sidebar-menu li {
          margin-bottom: 12px; /* Reduced margin to match image spacing */
          padding: 6px 0;     /* Added vertical padding to menu items */
        }

        .sidebar-menu a {
          color: #7e8299;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 12px; /* Adjusted gap for icons */
          padding: 8px 15px; /* Add padding for better click area and visual appeal */
          border-radius: 8px; /* Slightly rounded menu items */
          transition: background-color 0.2s ease; /* Smooth background transition */
        }

        .sidebar-menu a:hover, .sidebar-menu li.active a {
          color: #fff;
          background-color: #2c2c3d; /* Darker background on hover/active */
        }

        .sidebar-menu li.active a {
          font-weight: 500; /* Slightly bolder active text */
          /* Example for active state visual - you can adjust to match image more closely */
          /* border-left: 3px solid #50cd89;  Green active border - adjust color to match image light blue if needed */
          background-color: #37374a; /* Active background - adjust to match image */
        }
        .sidebar-menu li.active a::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: #50cd89; /* Or your desired active color */
          border-radius: 0 8px 8px 0;
        }
        .sidebar-menu li.active {
          position: relative; /* Required for absolute positioning of pseudo-element */
        }


        .sidebar-menu i { /* Style your icons - adjust size and color */
          font-size: 1.2em;
          color: #7e8299; /* Icon color - same as inactive text */
          width: 20px;     /* Fixed width for icon space */
          text-align: center;/* Center icons in their space */
        }
        .sidebar-menu li.active i, .sidebar-menu a:hover i {
          color: #fff;      /* Icon color on active/hover */
        }
        .sidebar-menu li:first-of-type{ /* Style for 'Dashboard' which is active in image */
          margin-top: 15px; /* Add some top margin for the first item */
        }
        .sidebar-menu li:nth-child(7) { /* Style for 'INTERFACES' header */
          margin-top: 25px; /* Add space before 'INTERFACES' header */
          margin-bottom: 8px;
          color: #fff; /* Make header text white */
          font-weight: bold; /* Make header text bold */
          font-size: 0.9em; /* Slightly smaller font size for header */
          text-transform: uppercase; /* Uppercase header text */
          letter-spacing: 0.5px; /* Add letter spacing for header text */
          padding: 0 15px; /* Keep horizontal padding consistent */
        }
        .sidebar-menu li:nth-child(7) a { /* Remove hover/active styles from header */
          padding: 0;
          background: none;
        }
        .sidebar-menu li:nth-child(7) a:hover, .sidebar-menu li:nth-child(7).active a {
          color: #fff; /* Ensure header text stays white on hover/active (though disabled) */
          background: none;
        }


        .topbar {
          display: flex;
          justify-content: space-between; /* Space between left and right parts */
          align-items: center;
          margin-bottom: 20px;
          padding: 15px 20px; /* Add padding to topbar */
          background-color: #fff; /* White topbar background */
          border-radius: 8px;     /* Rounded topbar corners */
          box-shadow: 0 1px 3px rgba(0,0,0,0.08); /* Subtle shadow */
        }

        .topbar-left, .topbar-right {
          display: flex;                      /* Flex containers for left/right items */
          align-items: center;
        }
        .topbar-right {
          gap: 20px; /* Spacing between user info and avatar */
        }

        .search-container {
          display: flex;
          align-items: center; /* Vertically align input and button */
        }

        .search-container input[type="text"] {
          padding: 8px 12px;
          border: 1px solid #e0e6ed; /* Light border */
          border-radius: 6px 0 0 6px; /* Rounded left corners */
          border-right: none;        /* Remove right border to join button */
          font-size: 0.9rem;
          color: #4b4b4b;
          width: 200px;             /* Adjust width as needed */
          background-color: #f9f9fb; /* Light background color */
        }
        .search-container input[type="text"]:focus {
          outline: none;              /* Remove focus outline */
          border-color: #c0c6cf;     /* Slightly darker border on focus */
        }

        .btn-search {
          padding: 8px 12px;
          background-color: #50cd89; /* Green search button - adjust to match image blue */
          color: #fff;
          border: none;
          border-radius: 0 6px 6px 0; /* Rounded right corners */
          font-size: 0.9rem;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .btn-search:hover {
          background-color: #3aa369; /* Darker green on hover - adjust to match image blue */
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 10px; /* Spacing between user info and avatar */
        }

        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
        }
        .user-info {
          display: flex;
          flex-direction: column;   /* Stack name and role vertically */
          align-items: flex-end;    /* Align text to the end (right) */
          text-align: right;       /* Ensure text alignment within container */
        }

        .user-name {
          font-weight: 500;          /* Bolder user name */
          font-size: 0.95rem;
          color: #32325d;          /* Darker text color */
          margin-bottom: 2px;       /* Slight bottom margin */
        }

        .user-role {
          font-size: 0.85rem;
          color: #7e8299;          /* Lighter role text */
        }


        .dashboard-overview {
          display: grid; /* Use grid for responsive layout */
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); /* Responsive columns */
          gap: 20px;
          margin-bottom: 30px;
        }

        .overview-card {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08); /* Lighter shadow */
          border: 1px solid #e0e6ed;               /* Light border */
        }

        .card-header {
          display: flex;
          justify-content: space-between; /* Title and badge on opposite sides */
          align-items: center;
          margin-bottom: 15px;
        }

        .card-header h3 {
          margin: 0;
          font-size: 1.1rem;
          color: #32325d; /* Darker title text */
          font-weight: 500;
        }

        .badge {
          background-color: #50cd89; /* Default badge color - green, adjust to light blue or as needed */
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: bold;
        }

        .completion-tasks-card { /* Specific class for Completion Tasks card if needed */
          /* You can add specific styles here if this card needs to be different */
        }

        .bar-chart-placeholder {
          height: 200px; /* Fixed height for placeholder - adjust as needed */
          background-color: #f0f0f0; /* Light grey placeholder background */
          border-radius: 6px;
          /* Add more styling to visually represent a bar chart if desired, e.g., using CSS gradients */
          /* Example:  background-image: linear-gradient(to bottom, #f0f0f0 80%, #ddd 80% 100%); */
        }

        .tasks-performance-card { /* Specific class for Tasks Performance card */
          /* Add specific styles if needed */
        }

        .performance-charts {
          display: flex;                  /* Arrange donut charts horizontally */
          justify-content: space-around; /* Space them out evenly */
          align-items: center;
          gap: 15px;
        }

        .donut-chart-placeholder {
          width: 80px;   /* Adjust size as needed */
          height: 80px;  /* Adjust size as needed */
          border-radius: 50%;
          background-color: #e0e0e0; /* Grey placeholder color */
          /* You can use CSS radial gradients to simulate donut chart appearance */
          /* Example: background-image: radial-gradient(circle, #e0e0e0 60%, transparent 60%); */
        }
        .leaderboard-card { /* Specific class for Leaderboard card */
          /* Add specific styles if needed */
        }
        .leaderboard-content {
          padding-top: 10px; /* Add some padding inside leaderboard content */
        }

        .leaderboard-header-row, .leaderboard-item-row {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr; /* Adjust column widths as needed */
          gap: 10px;
          padding: 8px 0;
          align-items: center;
          border-bottom: 1px solid #e8e8e8; /* Separator line between rows */
        }
        .leaderboard-header-row {
          font-weight: bold;           /* Bold header text */
          color: #4b4b4b;             /* Darker header text */
          border-bottom-color: #c0c0c0; /* Thicker separator for header */
        }
        .leaderboard-header-row span, .leaderboard-item-row span {
          font-size: 0.9rem;        /* Adjust font size in leaderboard */
          text-align: center;         /* Center text in columns */
          color: #636363;
        }
        .leaderboard-header-row span:first-child, .leaderboard-item-row .leaderboard-user {
          text-align: left;         /* Left align first column (User/Tasks) */
        }

        .leaderboard-item-row:last-child { /* Remove border from last item */
          border-bottom: none;
        }
        .leaderboard-user {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .leaderboard-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }


        .active-projects-section, .active-tasks-section {
          background-color: #fff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.08); /* Lighter shadow */
          border: 1px solid #e0e6ed;               /* Light border */
          margin-bottom: 20px;                     /* Spacing between sections */
        }
        .active-projects-section h2, .active-tasks-section h2 {
          font-size: 1.2rem;
          color: #32325d;
          margin-top: 0;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .active-projects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Responsive project cards */
          gap: 20px;
        }

        .project-card {
          background-color: #f9f9fb; /* Lighter background for project cards */
          border-radius: 8px;
          padding: 15px;
          border: 1px solid #e8e8e8; /* Light border for project cards */
        }

        .project-header {
          display: flex;
          align-items: center;
          margin-bottom: 10px;
          gap: 10px;
        }
        .project-type-badge {
          background-color: #ddecf8; /* Light blue badge background - adjust color */
          color: #4e7ea8;           /* Darker blue text - adjust color */
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: bold;
          text-transform: uppercase;
        }

        .project-header h3 {
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
          color: #4b4b4b;
        }

        .project-progress {
          /* Styles for progress bar and text */
        }

        .progress-bar-container {
          background-color: #e0e6ed; /* Grey progress bar background */
          border-radius: 10px;
          height: 8px;              /* Adjust progress bar height */
          margin-bottom: 5px;
          overflow: hidden;         /* Clip overflowing content for rounded corners */
        }

        .progress-bar {
          background-color: #50cd89; /* Green progress bar color - adjust to match image light blue */
          height: 100%;
          border-radius: 10px;
          width: 0%; /* Set width dynamically based on progress prop */
        }
        .progress-text {
          font-size: 0.85rem;
          color: #7e8299;
        }


        .active-tasks-list {
          /* Styles for task list */
        }

        .task-item {
          display: flex;
          align-items: center;
          justify-content: space-between; /* Space between checkbox/label and overdue label */
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0; /* Separator between tasks */
        }
        .task-item:last-child {
          border-bottom: none; /* Remove border from last task item */
        }
        .checkbox-container {
          display: flex;
          align-items: center;
          position: relative; /* Needed for custom checkbox */
          padding-left: 25px; /* Space for checkbox */
          cursor: pointer;
          font-size: 0.9rem;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          color: #4b4b4b;
        }

        .checkbox-container input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }

        .checkmark {
          position: absolute;
          top: 0;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: #eee;
          border-radius: 3px;
          border: 1px solid #ccc;
        }

        .checkbox-container:hover input ~ .checkmark {
          background-color: #d2d2d2;
        }

        .checkbox-container input:checked ~ .checkmark {
          background-color: #50cd89; /* Green checkbox fill - adjust to match image light blue */
          border-color: #50cd89;    /* Green checkbox border - adjust to match image light blue */
        }

        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }

        .checkbox-container input:checked ~ .checkmark:after {
          display: block;
        }

        .checkbox-container .checkmark:after {
          left: 6px;
          top: 3px;
          width: 4px;
          height: 8px;
          border: solid white;
          border-width: 0 2px 2px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
        }
        .task-label {
          margin-left: 8px;      /* Spacing between checkbox and label */
        }
        .overdue-label {
          color: #f59f80;          /* Orange/red overdue color - adjust as needed */
          font-size: 0.85rem;
          font-weight: 500;
        }

      `}</style>
    </div>
  );
}
