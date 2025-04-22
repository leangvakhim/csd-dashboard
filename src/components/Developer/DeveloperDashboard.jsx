import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../service/APIConfig';
import img1 from "../../img/1.jpg";
import img2 from "../../img/2.jpg";

const DeveloperDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [developerItems, setFDeveloperItems] = useState([]);
    const navigate = useNavigate();
    const fakeData = [
        {
            f_id: 1,
            f_name: 'John Doe',
            f_position: 'Frontend Developer',
            lang: 1,
            display: true,
            img: { img: img1 }
        },
        {
            f_id: 2,
            f_name: 'Jane Smith',
            f_position: 'Backend Developer',
            lang: 2,
            display: false,
            img: { img: img2 }
        }
    ];

    const fetchDeveloper = async () => {
        try {
            const response = await axios.get(API_ENDPOINTS.getDevelopers);
            const data = response.data.data
            const sortedDevelopers = data.sort((a, b) => b.e_order - a.e_order);
            setFDeveloperItems(sortedDevelopers);
            // console.log('developer', sortedDevelopers);
        } catch (error) {
            console.error('Failed to fetch delvelopers:', error);
        }
    }; 

    useEffect(() => {
        fetchDeveloper();
    }, []);

    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500 ">
                <thead className="text-xs text-gray-700  uppercase bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Photo
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Full name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Position
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Language
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className=" px-6 py-3">
                            {/* Action */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {developerItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No Developer member available.
                            </td>
                        </tr>
                        ) : (
                        developerItems.map((item, index) => (
                            <tr key={item.f_id} className="odd:bg-white even:bg-gray-50 border">
                                <td
                                    scope="row"
                                    className="px-6 py-4"
                                    >
                                    <img src={item.img?.img} alt="" className='size-12 rounded-full' />
                                </td>
                                <td className="px-6 py-4">{item.f_name}</td>
                                <td className="px-6 py-4">{item.f_position}</td>
                                <td className="px-6 py-4">{{
                                        1: 'English',
                                        2: 'Khmer',
                                    }[item.lang] || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <span className={`${item.display ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}>
                                        {item.display ? 'Enable' : 'Disable'}
                                    </span>
                                </td>
                                <td className="px-2 py-6 flex gap-2 items-center relative">
                                    <a onClick={() => moveItem(index, 'up')} className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
                                        <i className="ti ti-chevron-up text-xl"></i>
                                    </a> |
                                    <a onClick={() => moveItem(index, 'down')} className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
                                        <i className="ti ti-chevron-down text-xl"></i>
                                    </a> |
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === item.f_id ? null : item.f_id)}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.f_id && (
                                            <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    <a className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-copy text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Duplicate</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default DeveloperDashboard