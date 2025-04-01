import React from 'react'
// import logo from '../img/rupp.png';
import logo from '../img/samplelogo.svg';
import profile from '../img/profile.svg';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Aside = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    navigate('/login');
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
                            {/* <li class="text-xs font-bold pb-4">
                                <i class="ti ti-dots nav-small-cap-icon text-lg hidden text-center"></i>
                                <span>HOME</span>
                            </li> */}

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/menu"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/menu')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-category-2 text-xl"></i>
                                    <span>Menu</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/page"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/page')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-file-description text-xl"></i>
                                    <span>Page</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/faculty"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/faculty')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-user text-xl"></i>
                                    <span>Faculty</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/event"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/event')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-speakerphone text-xl"></i>
                                    <span>Event</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/news"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/new')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-news text-xl"></i>
                                    <span>New</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/career"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/career')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-target-arrow text-xl"></i>
                                    <span>Career</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/scholarship"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/scholarship')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-school text-xl"></i>
                                    <span>Scholarship</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/research"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/research')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-microscope text-xl"></i>
                                    <span>Research</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/lab"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/lab')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-cell text-xl"></i>
                                    <span>Research Lab</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/feedback"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/feedback')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-brand-hipchat text-xl"></i>
                                    <span>Feedback</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/partnership"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/partnership')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-heart-handshake text-xl"></i>
                                    <span>Partnership</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <Link
                                    to="/image"
                                    className={`sidebar-link gap-3 px-3 py-2 rounded-md w-full flex items-center ${
                                        location.pathname.startsWith('/image')
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-500'
                                    }`}
                                    >
                                    <i class="ti ti-photo  text-xl"></i>
                                    <span>Image</span>
                                </Link>
                            </li>

                            <li class="sidebar-item mb-2">
                                <a class="sidebar-link gap-3 py-2 px-3  rounded-md  w-full flex items-center hover:text-blue-600 hover:bg-blue-500" href="#">
                                    <i class="ti ti-user-circle  text-xl"></i>
                                    <span>User</span>
                                </a>
                            </li>

                            <li class="sidebar-item mb-2">
                                <a class="sidebar-link gap-3 py-2 px-3  rounded-md  w-full flex items-center hover:text-blue-600 hover:bg-blue-500" href="#">
                                    <i class="ti ti-settings  text-xl"></i>
                                    <span>Setting</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

        <div class="m-6 border-t">
            <div class="bg-blue-500 p-5 rounded-md ">
                <div className='flex items-center gap-2'>
                    <img src={profile} class="size-10" alt="profile" />
                    <h5 class="text-sm font-light text-gray-700 ">leang vakhim</h5>
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