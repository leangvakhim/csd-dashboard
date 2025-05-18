import React, { useState } from 'react'
import { useEffect } from 'react';
import { API_ENDPOINTS, API, axiosInstance } from '../../service/APIConfig';
import { useNavigate } from 'react-router-dom';

const FeedbackDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [eventItems, setEventItems] = useState([]);
    const navigate = useNavigate();
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getFeedback);
                const result = (response.data.data || []);
                const normalized = Array.isArray(result) ? result : result ? [result] : [];
                const sortedFeedback = normalized.sort((a, b) => b.fb_order - a.fb_order);
                setEventItems(sortedFeedback);
            } catch (error) {
                console.error('Failed to fetch career:', error);
            }
        };

        fetchNews();
    }, []);

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getFeedback}/${id}`);
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

        await axiosInstance.put(`${API_ENDPOINTS.updateFeedbackOrder}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axiosInstance.post(`${API_ENDPOINTS.duplicateFeedback}/${id}`);
            if (response.status === 200) {
                alert("feedback duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating feedback:", error);
        }
    };

    const handleDelete = async (id) => {
        const Swal = (await import('sweetalert2')).default;

        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 !mr-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:!ring-red-400'
            },
            buttonsStyling: false,
            confirmButtonText: 'Yes, delete it!'
        });

        if (!result.isConfirmed) return;

        try {
            await axiosInstance.put(`${API_ENDPOINTS.deleteFeedback}/${id}`);
            setEventItems(prevItems =>
                prevItems.map(item =>
                    item.fb_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            Swal.fire({
                title: 'Deleted!',
                text: 'The feedback has been deleted.',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
            });
            setTimeout(() => {
                window.location.reload();
            }, 1600);
        } catch (error) {
            console.error("Error toggling visibility:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete the feedback.',
                icon: 'error'
            });
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500 mb-24">
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
                                <td className="px-2 py-10 flex gap-2 items-center relative">
                                    <button onClick={() => moveItem(index, 'up')} className="font-medium text-gray-900 hover:text-blue-500">
                                        <i className="ti ti-chevron-up text-xl"></i>
                                    </button> |
                                    <button onClick={() => moveItem(index, 'down')} className="font-medium text-gray-900 hover:text-blue-500">
                                        <i className="ti ti-chevron-down text-xl"></i>
                                    </button> |
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                                const button = e.currentTarget;
                                                const parent = button.offsetParent;
                                                const rect = button.getBoundingClientRect();
                                                const parentRect = parent.getBoundingClientRect();
                                                setDropdownPosition({ top: rect.bottom - parentRect.top, left: rect.left - parentRect.left });
                                                setActiveDropdown(activeDropdown === item.fb_id ? null : item.fb_id);
                                            }}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.fb_id && (
                                            <div
                                                style={{ position: 'absolute', top: `${dropdownPosition.top}px`, left: `-50px` }}
                                                className="absolute w-36 bg-white border border-gray-300 rounded-md shadow-md max-h-48 z-50 overflow-y-auto">
                                                <div className="py-1">
                                                    <a
                                                     onClick={() => handleEdit(item.fb_id)}
                                                     className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a
                                                    onClick={() => handleDelete(item.fb_id)}
                                                    className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    {/* <button onClick={() => duplicateItem(item.fb_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-copy text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Duplicate</span>
                                                    </button> */}
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