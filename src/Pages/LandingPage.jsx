import React from 'react'
import { Link } from 'react-router-dom'


const LandingPage = () => {
  return (
    <div>

        <div>
            <header className='flex justify-around h-[60px] items-center bg-green-600'>
                <div className='flex gap-8'>
                    <Link className={`font-semibold text-white text-lg`}  to="/home">Home</Link>
                    <Link className={`font-semibold text-white text-lg`} to="/about">About</Link>
                </div>
                <div className='flex gap-5'>
                    <Link  className={`w-[100px] flex justify-center rounded-3xl bg-gray-300 hover:bg-gray-400 p-2`}  to="login">Login</Link>
                    <Link  className={`w-[100px] flex justify-center rounded-3xl text-white bg-green-700 hover:bg-green-900 shadow-2xl p-2`}  to="register">Get Started</Link>
                </div>
            </header>

            <main className='flex justify-center items-center h-[90vh] gap-24'>
                <div className='flex flex-col gap-8'>
                    <h1 className='font-extrabold text-6xl w-[400px]'>  <span>Plan faster.</span> <span className='text-gray-400'>Work faster. </span> <span className='text-green-700'> Learn Better</span></h1>
                    <div className='flex flex-col gap-8'>
                        <p>
                            Work in harmony, plan ahead and track your progress.
                        </p>
                        <Link className={`w-[150px] flex justify-center bg-green-700 p-2 text-white rounded-3xl hover:bg-green-900`}  to="register">Get Started</Link>
                    </div>
                </div>
                
                <div>
                    <img src='/Images/download.jpg' className='w-[400px] h-[350px]'/>
                </div>
            </main>
        </div>

    </div>
  )
}

export default LandingPage