import React from "react";
import "@fontsource/poppins";
import { Routes, Route} from "react-router-dom";
import Home from "./Pages/Home";
import About from "./Pages/About";
import LandingPage from "./Pages/LandingPage";
import AddProject from "./Pages/AddProject";
import Login from "./Components/Login";
import Registration from "./Components/Registration";
import ForgotPassword from "./Components/ForgotPassword";
import PersonalWorkspace from "./Pages/PersonalWorkspace";
import CollaborativeWorkspace from "./Pages/CollaborativeWorkspace";
import ExpenseTrack from "./Pages/ExpenseTrack";
import Settings from "./Pages/Settings";



export default function App(){
	return(
		<div>

			<Routes>
				<Route path="/" element={<LandingPage />} />

				<Route path="/register" element={<Registration />} />
				<Route path="/login" element={<Login />} />	
				<Route path="/forgot-password" element={<ForgotPassword />} />
				<Route path="/home" element={<Home />} />					
				<Route path="/personalworkspace" element={<PersonalWorkspace />} />
				<Route path="/collaborativeworkspace" element={<CollaborativeWorkspace />} />
				<Route path="/expensetrack" element={<ExpenseTrack />} />
				<Route path="/addproject" element={<AddProject />} />
				<Route path="/about" element={<About />} />
				<Route path="/settings" element={<Settings />} />
			</Routes>

		</div>
	)
}