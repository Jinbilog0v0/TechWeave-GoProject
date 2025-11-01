import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Login = () => {

    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({ ...loginData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Login attempt: ", loginData);
    };

  return (
    <div>

        <div className='flex justify-center items-center h-[100vh] gap-35'>
            <div>
                <img  src='/Images/download.jpg' className='w-[350px] '/>
            </div>

            <div>
                <section>
                <div className='flex flex-col gap-15'>
                    <h1 className='font-bold text-5xl text-gray-500 text-center'> <span className='text-green-700'>Go</span>Project</h1>
                    <h3 className='font-bold text-2xl text-green-700'>Log in</h3>                    
                </div>


                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div>
                        <input type='text' placeholder='Username' 
                        className='bg-green-500 p-2 w-[439px] h-[68px] mt-8 text-white font-semibold rounded-2xl'
                        name='username' value={loginData.username} onChange={handleChange} required/>
                    </div>

                    <div>
                        <input type='password' placeholder='Password'
                        className='bg-green-500 p-2 w-[439px] h-[68px] text-white font-semibold rounded-2xl'
                        value={loginData.password} onChange={handleChange} required/>
                    </div>
                    <div className='mb-4'>
                    <Link to="/forgot-password" className={`text-green-600`}>Forgot Password?</Link>

                    </div>

                    <div className='flex justify-center'>
                    <button type="submit" className='w-[247px] bg-green-700 p-2 rounded-3xl text-white font-semibold text-xl mb-4'>Login</button>
              
                    </div>
  </form>

                <div className='flex justify-center'>
                    <p>Don't have an account?  <Link to="/register" className={`text-green-600`}>Sign up</Link> </p>
                </div>
                </section>
            </div>
        </div>

    </div>
  )
}

export default Login