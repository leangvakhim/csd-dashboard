import React, { useState } from 'react'
import { useEffect } from 'react';
import { API_ENDPOINTS, API } from '../../service/APIConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FeedbackDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [eventItems, setEventItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getFeedback);
                let newsArray = response.data.data;

                if (newsArray && !Array.isArray(newsArray)) {
                    newsArray = [newsArray];
                } else if (!newsArray) {
                    newsArray = [];
                }

                const sortedCareer = newsArray.sort((a, b) => b.fb_order - a.fb_order);
                setEventItems(sortedCareer);
            } catch (error) {
                console.error('Failed to fetch career:', error);
            }
        };

        fetchNews();
    }, []);

    const handleEdit = async (id) => {
        const response = await axios.get(`${API_ENDPOINTS.getFeedback}/${id}`);
        const eventData = response.data;
        navigate('/feedback/feedback-details', { state: { eventData } });
    };


    const moveItem = async (index, direction) => {
        const newItems = [...eventItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update e_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            fb_order: newItems.length - i
        }));

        setEventItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            fb_id: item.fb_id,
            fb_order: item.fb_order
        }));

        await axios.put(`${API_ENDPOINTS.updateFeedback}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axios.post(`${API_ENDPOINTS.duplicateFeedback}/${id}`);
            if (response.status === 200) {
                alert("feedback duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating feedback:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete of this feedback?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteFeedback}/${id}`);
            setEventItems(prevItems =>
                prevItems.map(item =>
                    item.fb_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            window.location.reload();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

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
                            Title
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
                    {eventItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No news data available.
                            </td>
                        </tr>
                    ) : (
                        eventItems.map((item, index) => (
                            <tr key={item.fb_id} className="odd:bg-white even:bg-gray-50 border">
                                <td
                                    scope="row"
                                    className="px-6 py-4"
                                >
                                    <img src={`${API}/storage/uploads/${item.image?.img}`} alt="" className='size-12' />
                                </td>
                                <td className="px-6 py-4">{item.fb_title}</td>
                                <td className="px-6 py-4">{item.fb_writer}</td>
                                <td className="px-6 py-4"> {{
                                        1: 'English',
                                        2: 'Khmer',
                                        // 3: 'Chinese',
                                        // 4: 'French'
                                    }[item.lang] || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <span className={`${item.display ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}>
                                        {item.display ? 'Enable' : 'Disable'}
                                    </span>
                                </td>
                                <td className="px-2 py-6 flex gap-2 items-center relative">
                                    <button onClick={() => moveItem(index, 'up')} className="font-medium text-gray-900 hover:text-blue-500">
                                        <i className="ti ti-chevron-up text-xl"></i>
                                    </button> |
                                    <button onClick={() => moveItem(index, 'down')} className="font-medium text-gray-900 hover:text-blue-500">
                                        <i className="ti ti-chevron-down text-xl"></i>
                                    </button> |
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === item.fb_id ? null : item.fb_id)}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.fb_id && (
                                            <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a
                                                     onClick={() => handleEdit(item.fb_id)}
                                                    href="#" className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a href="#"
                                                    onClick={() => handleDelete(item.fb_id)}
                                                    className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    <button onClick={() => duplicateItem(item.fb_id)} className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-copy text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Duplicate</span>
                                                    </button>
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

export default FeedbackDashboard