import React from "react";
import { Routes, Route} from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import LandingPage from "./Pages/LandingPage";
import AddProject from "./Pages/AddProject";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import ForgotPassword from "./Components/ForgotPassword";


export default function App(){
	return(
		<div>

			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/home" element={<Home />} />
				<Route path="/about" element={<About />} />				
				<Route path="/addproject" element={<AddProject />} />
				<Route path="/login" element={<Login />} />
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/register" element={<Registration />} />
			</Routes>

		</div>
	)
}


