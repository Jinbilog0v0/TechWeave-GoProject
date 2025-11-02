import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaHome, FaUser, FaUsers, FaDollarSign, FaCog } from 'react-icons/fa'

const Sidebar = () => {
  return (
    <div className='w-[60px] h-screen bg-green-700 p-3.5'>
        <div className='flex flex-col gap-10 text-center justify-center'>
            <NavLink to="/home" className={({isActive}) => isActive ? "text-gray-700 font-bold underline" : "text-gray-100 hover:text-gray-700"} > <FaHome size={30}/> </NavLink>
            <NavLink to="/personal" className={({isActive}) => isActive ? "text-gray-700 font-bold underline" : "text-gray-100 hover:text-gray-700"} >  <FaUser size={26}/> </NavLink>
            <NavLink to="/collaborative" className={({isActive}) => isActive ? "text-gray-700 font-bold underline" : "text-gray-100 hover:text-gray-700"} > <FaUsers size={30}/> </NavLink>
            <NavLink to="/expense" className={({isActive}) => isActive ? "text-gray-700 font-bold underline" : "text-gray-100 hover:text-gray-700"} > <FaDollarSign size={30} /> </NavLink>
            <NavLink to="/settings" className={({isActive}) => isActive ? "text-gray-700 font-bold underline" : "text-gray-100 hover:text-gray-700"}> <FaCog size={30} /> </NavLink>
        </div>
    </div>
  )
}

export default Sidebar