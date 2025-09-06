import React from "react";
export default function Navbar() {
  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-transparent backdrop-blur-md">
      <h2 className="text-2xl font-bold">SnapMind</h2>
      <ul className="flex space-x-6 text-sm md:text-base font-medium">
        <li className="hover:text-pink-300 transition cursor-pointer">Home</li>
        <li className="hover:text-green-300 transition cursor-pointer">
          Categories
        </li>
        <li className="hover:text-blue-300 transition cursor-pointer">About</li>
      </ul>
    </nav>
  );
}
