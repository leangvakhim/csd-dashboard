import React from 'react'
import logo from '../img/rupp.png';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { API_ENDPOINTS, axiosInstance } from '../service/APIConfig';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const [captchaAnswer, setCaptchaAnswer] = useState(null);
    const [userInput, setUserInput] = useState("");
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        generateCaptcha();

    }, []);

    const generateCaptcha = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = 200;
        canvas.height = 50;

        // Generate random alphanumeric code
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) {
            captcha += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setCaptchaAnswer(captcha);

        // Style the CAPTCHA
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#333";
        ctx.font = "20px Arial";
        ctx.fillText(captcha, 30, 30);

        // Add Noise
        for (let i = 0; i < 15; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = ["red", "blue", "green", "orange", "purple"][Math.floor(Math.random() * 5)];
            ctx.stroke();
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput !== captchaAnswer) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Incorrect verification code.',
            customClass: {
                confirmButton: '!bg-red-600 hover:!bg-red-700 text-white font-semibold py-2 px-4 rounded'
            },
            buttonsStyling: false
        });
        generateCaptcha();
        return;
    }

    try {
        const response = await axiosInstance.post(API_ENDPOINTS.login, {
            username,
            password,
        }, {
            withCredentials: true
        });

        if (response.status === 200) {
            Swal.fire({
                title: 'Logging in...',
                text: 'Please wait for a while.',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            setTimeout(() => {
                Swal.close();
                navigate('/dashboard/menu');
            }, 1000);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: 'Invalid credentials.',
                customClass: {
                    confirmButton: '!bg-red-600 hover:!bg-red-700 text-white font-semibold py-2 px-4 rounded'
                },
                buttonsStyling: false
            });
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Login Error',
            text: error.response?.data?.message || 'Something went wrong.',
            customClass: {
                confirmButton: '!bg-red-600 hover:!bg-red-700 text-white font-semibold py-2 px-4 rounded'
            },
            buttonsStyling: false
        });
    }
};

  return (
    <div class="flex flex-col w-full  overflow-hidden relative min-h-screen radial-gradient items-center justify-center g-0 px-4">
        <div class="justify-center items-center w-full card lg:flex max-w-md ">
            <div class=" w-full card-body">
                    <a class="py-4 block"><img src={logo} alt="" class="mx-auto h-32 w-32"/></a>
                    <p class="mb-4 text-gray-600 text-lg font-semibold text-center">CSD Management Information System</p>
                <form onSubmit={handleSubmit}>
                    <div class="mb-4">
                        <label for="forUsername"
                        class="block text-sm font-semibold mb-2 text-gray-600">Username</label>
                    <input type="text" id="forUsername"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-600 focus:ring-0 " aria-describedby="hs-input-helper-text"/>
                    </div>

                    <div class="mb-4">
                        <label htmlFor="forPassword"
                        className="block text-sm font-semibold mb-2 text-gray-600">Password</label>
                        <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="forPassword"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-600 focus:ring-0"
                              aria-describedby="hs-input-helper-text"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mr-4"
                            >
                              {!showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-closed"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M21 9c-2.4 2.667 -5.4 4 -9 4c-3.6 0 -6.6 -1.333 -9 -4" /><path d="M3 15l2.5 -3.8" /><path d="M21 14.976l-2.492 -3.776" /><path d="M9 17l.5 -4" /><path d="M15 17l-.5 -4" /></svg>
                              ) : (
                                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" /></svg>
                              )}
                            </button>
                        </div>
                    </div>

                    {/* CAPTCHA Section */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2 text-gray-600">
                            Verification Code
                        </label>
                        <div className='flex'>
                            <canvas ref={canvasRef} className="border border-gray-400 rounded-md"></canvas>
                            <button
                                onClick={generateCaptcha}
                                className="my-autow-full text-sm text-gray-600 hover:underline">
                                <svg className='size-7 ml-4' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                                    <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"></path>
                                    <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path>
                                </svg>
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Enter Code"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                e.preventDefault(); // Optional, prevents double trigger
                                handleSubmit(e);
                                }
                            }}
                            className="py-3 px-4 block w-full border-gray-200 rounded-md text-sm mt-2"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
	</div>
  )
}

export default Login