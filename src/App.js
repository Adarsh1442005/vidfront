import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';


function App() {
  return (
//    
<div className="bg-gray-900 text-white min-h-screen px-4 py-8">
  <div className="max-w-6xl mx-auto space-y-12">
    <header className="animate-pulse text-center">
      <h1 className="text-2xl md:text-4xl font-bold">
        Welcome To The Video Calling App!
      </h1>
    </header>

    <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10">
      {/* Left Section: Links */}
      <section className="flex flex-col items-center space-y-4 text-center">
        <Link
          to="/login"
          className="w-32 border border-blue-500 px-4 py-2 rounded text-blue-500 hover:bg-blue-50"
        >
          Login
        </Link>
        <Link
          to="/Signin"
          className="w-32 border border-blue-500 px-4 py-2 rounded text-blue-500 hover:bg-blue-50"
        >
          Signin
        </Link>
        <Link
          to="/signout"
          className="w-32 border border-blue-500 px-4 py-2 rounded text-blue-500 hover:bg-blue-50"
        >
          Signout
        </Link>
        <Link
          to="/signout"
          className="w-32 border border-blue-500 px-4 py-2 rounded text-blue-500 hover:bg-blue-50"
        >
          Start Calling
        </Link>
      </section>

      {/* Divider */}
      <div className="hidden lg:block w-px h-40 bg-gray-300"></div>

      {/* Image */}
      <img
        src="https://cdn.dribbble.com/users/2045015/screenshots/18273110/online_video_calling_website_ui_ux_design1_4x.jpg"
        alt="Video Call UI"
        className="w-full max-w-xs md:max-w-sm h-auto rounded shadow"
      />

      {/* Animated List */}
      <div className="border border-white rounded-md overflow-hidden w-full max-w-sm ml-auto h-full">
        <ul className="text-green-500 flex flex-col space-y-5 text-center font-bold animate-scrollUp">
          <li>Talk to Your Friend</li>
          <li>Look the Smartness of Your Friend</li>
          <li>Talk to Your Family at Any Place</li>
          <li>Enjoy Your Work with Family</li>
        </ul>
      </div>
    </div>
  </div>
  <footer className="bg-gray-800 text-white mt-12">
  <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
    <p className="text-sm text-center md:text-left">
      © {new Date().getFullYear()} Adarsh Pandey. All rights reserved.
    </p>
    <p className="text-sm italic text-center md:text-left">
      Built with ❤️ using React & Tailwind CSS
    </p>
    <div className="flex space-x-4">
      <a href="#" className="hover:text-blue-400">LinkedIn</a>
      <a href="#" className="hover:text-blue-400">GitHub</a>
      <a href="#" className="hover:text-blue-400">Portfolio</a>
    </div>
  </div>
</footer>

</div>
  );
}

export default App;
