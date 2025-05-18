import React from 'react'
import Swal from 'sweetalert2';
import axios from 'axios';
import logo from '../img/rupp.png';
import profile from '../img/profile.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { API_ENDPOINTS, axiosInstance } from '../service/APIConfig';

const Aside = ({ username }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    try {
      await axiosInstance.post(API_ENDPOINTS.logout, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <aside id="application-sidebar-brand"
                class="hs-overlay hs-overlay-open:translate-x-0 -translate-x-full transform xl:translate-x-0 fixed top-0 left-0 h-screen z-[999] flex flex-col w-[270px] !border-r border-gray-400 bg-white transition-all duration-300"
            >
        <div class="p-5" >

        <a href="../" class="text-nowrap flex items-center gap-1">
            <img className='size-12'
            src={logo}
            alt="Logo-Dark"
            />
            <span className='uppercase text-xl font-extralight'>CSD Dashboard</span>
        </a>

        </div>
            <div
                class="flex-1 overflow-y-auto px-6 mt-1"
            >
                <div class="px-6 mt-1" >
                    <nav class=" w-full flex flex-col sidebar-nav">
                        <ul id="sidebarnav" class="text-gray-600 text-sm">
                            {[
                              { to: '/menu', icon: 'ti-category-2', label: 'Menu' },
                              { to: '/page', icon: 'ti-file-description', label: 'Page' },
                              { to: '/faculty', icon: 'ti-user', label: 'Faculty' },
                              { to: '/event', icon: 'ti-calendar-event', label: 'Event' },
                              { to: '/news', icon: 'ti-news', label: 'News' },
                              { to: '/announcement', icon: 'ti-speakerphone', label: 'Announcement' },
                              { to: '/career', icon: 'ti-target-arrow', label: 'Career' },
                              { to: '/scholarship', icon: 'ti-school', label: 'Scholarship' },
                              { to: '/research', icon: 'ti-microscope', label: 'Research' },
                              { to: '/lab', icon: 'ti-cell', label: 'Research Lab' },
                              { to: '/feedback', icon: 'ti-brand-hipchat', label: 'Feedback' },
                              { to: '/partnership', icon: 'ti-heart-handshake', label: 'Partnership' },
                              { to: '/image', icon: 'ti-photo', label: 'Image' },
                              { to: '/email', icon: 'ti-mail', label: 'Email' },
                              // { to: '#', icon: 'ti-user-circle', label: 'User', external: true },
                              { to: '/developer', icon: 'ti-user-code', label: 'Developer' },
                              { to: '/setting', icon: 'ti-settings', label: 'Setting'},
                            ].map(({ to, icon, label, external }) => (
                              <li key={label} className="sidebar-item mb-2">
                                {external ? (
                                  <a className="sidebar-link gap-3 py-2 px-3 rounded-md w-full flex items-center hover:text-blue-600 hover:bg-blue-500" href={to}>
                                    <i className={`ti ${icon} text-xl`}></i>
                                    <span>{label}</span>
                                  </a>
                                ) : (
                                  <Link
                                    to={to}
                                    onClick={() => {
                                      Swal.fire({
                                        title: 'Loading...',
                                        allowOutsideClick: false,
                                        didOpen: () => {
                                          Swal.showLoading();
                                        },
                                        showConfirmButton: false,
                                        timer: 1000,
                                        backdrop: true,
                                        customClass: {
                                          popup: 'bg-white rounded-lg shadow-lg',
                                          title: 'text-lg font-semibold text-gray-700'
                                        }
                                      });
                                      setLoading(true);
                                    }}
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                      location.pathname.startsWith(to)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                  >
                                    <i className={`ti ${icon} text-xl`}></i>
                                    <span>{label}</span>
                                  </Link>
                                )}
                              </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>

        <div class="m-6 border-t">
            <div class="bg-blue-500 p-5 rounded-md ">
                <div className='flex items-center gap-2'>
                    <img src={profile} class="size-10" alt="profile" />
                    <h5 className="text-sm font-light text-gray-700 ">{username}</h5>
                </div>
                <button
                  onClick={handleLogout}
                  class="text-sm mt-2 w-full hover:bg-blue-700 text-white bg-blue-600 rounded-md  px-4 py-2"
                >
                  logout
                </button>
            </div>
        </div>
	</aside>
  )
}

export default Aside