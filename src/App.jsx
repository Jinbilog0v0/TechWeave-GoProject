import { Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import About from "./Pages/About.jsx";

export default function App() {
  return (
	<div>
  	<nav>
    	<NavLink to="/" end>Home</NavLink>
    	{" | "}
    	<NavLink to="/about">About</NavLink>
  	</nav>

  	<Routes>
    	<Route path="/" element={<Home />} />
    	<Route path="/about" element={<About />} />
  	</Routes>
	</div>
  );
}

import { useState } from 'react'
import { Routes, Route, Link ,NavLink } from "react-router-dom";


function App() {

  return (
    <>
  <div>
    
  </div>
    </>
  )
}

export default App
