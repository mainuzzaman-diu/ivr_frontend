// components/Layout.js
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { BarChart, Users, FilePlus } from "lucide-react";

export default function Layout({ children }) {
  const { data: session, status } = useSession(); // Get session data

  return (
    <div className="d-flex bg-light" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="bg-white shadow-sm p-4" style={{ width: "250px" }}>
        <Image src="/logo.png" alt="Logo" width={60} height={60} />
        <nav className="mt-4">
          <ul className="list-unstyled">
            <li className="text-primary fw-bold d-flex align-items-center gap-2 mb-3">
              <Link href="/dashboard" className="text-decoration-none d-flex align-items-center gap-2">
                <BarChart size={20} /> Dashboard
              </Link>
            </li>
            <li className="d-flex align-items-center gap-2">
              <Link href="/teams" className="text-decoration-none d-flex align-items-center gap-2">
                <Users size={20} /> Teams
              </Link>
            </li>
            <li className="text-primary fw-bold d-flex align-items-center gap-2 mt-3">
              <Link href="/upload-file" className="text-decoration-none d-flex align-items-center gap-2">
                <FilePlus size={20} /> Upload File
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow-1 p-4">
        {/* Top Right User Info & Logout */}
        <div className="d-flex justify-content-end align-items-center gap-3 mb-3">
          {session?.user ? (
            <>
              <Image src={session.user.image || "/user.png"} alt="User" width={40} height={40} className="rounded-circle" />
              <button className="btn btn-danger" onClick={() => signOut()}>
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
