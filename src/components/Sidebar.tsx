import React from "react";
import Link from "next/link";

interface SidebarProps {
  isAdmin: boolean; // Replace with your actual admin check logic
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin }) => {
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 h-full p-4">
      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        >
          Dashboard
        </Link>
        <Link
          href="/profile"
          className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
        >
          Profile
        </Link>
        {isAdmin && (
          <Link
            href="/admin"
            className="block px-4 py-2 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition"
          >
            Admin Dashboard
          </Link>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
