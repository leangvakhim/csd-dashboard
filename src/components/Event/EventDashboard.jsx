import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../service/APIConfig';
import Swal from 'sweetalert2';

const EventDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [eventItems, setEventItems] = useState([]);
    const navigate = useNavigate();
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getEvent);
                const result = (response.data.data || []);
                const normalized = Array.isArray(result) ? result : result ? [result] : [];
                setEventItems(normalized);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleEdit = async (id) => {
        const response = await axios.get(`${API_ENDPOINTS.getEvent}/${id}`);
        const eventData = response.data;
        navigate('/event/event-detail', { state: { eventData } });
        // console.log("Passing data: ",response.data);
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
            e_order: newItems.length - i // or i + 1 for ascending order
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
            e_id: item.e_id,
            e_order: item.e_order
        }));

        await axios.put(`${API_ENDPOINTS.updateEventOrder}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axios.post(`${API_ENDPOINTS.duplicateEvent}/${id}`);
            if (response.status === 200) {
                alert("Event duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating event:", error);
        }
    };

    const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to delete this event?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'bg-white rounded-lg shadow-lg',
            title: 'text-lg font-semibold text-gray-800',
            htmlContainer: 'text-sm text-gray-600',
            confirmButton: '!bg-red-600 text-white px-4 py-2 rounded hover:!bg-red-700',
            cancelButton: 'bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-400',
        }
    });
        if (!result.isConfirmed) return;
        try {
            await axios.put(`${API_ENDPOINTS.deleteEvent}/${id}`);
            setEventItems(prevItems =>
                prevItems.map(item =>
                    item.e_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'The event has been deleted.',
                showConfirmButton: false,
                timer: 1500,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-gray-800',
                    htmlContainer: 'text-sm text-gray-600',
                }
            });
            setTimeout(() => {
                window.location.reload();
            }, 1600);
        } catch (error) {
            console.error("Error delete events:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong.',
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold !text-red-700',
                    htmlContainer: 'text-sm text-gray-600',
                }
            });
        }
    };


    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500 ">
                <thead className="text-xs text-gray-700  uppercase bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Post On
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
                                No event data available.
                            </td>
                        </tr>
                    ) : (
                        eventItems.map((item, index) => (
                            <tr key={item.e_id || index} className="odd:bg-white even:bg-gray-50 border">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.e_title || 'No Title'}
                                </th>
                                <td className="px-6 py-4">
                                    {item.e_date
                                    ? new Date(item.e_date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })
                                    : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {{
                                        1: 'English',
                                        2: 'Khmer',
                                        // 3: 'Chinese',
                                        // 4: 'French'
                                    }[item.lang] || 'Unknown'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`${item.display ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}>
                                        {item.display ? 'Enable' : 'Disable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2 items-center relative">
                                    <a onClick={() => moveItem(index, 'up')} className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
                                        <i className="ti ti-chevron-up text-xl"></i>
                                    </a> |
                                    <a onClick={() => moveItem(index, 'down')} className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
                                        <i className="ti ti-chevron-down text-xl"></i>
                                    </a> |
                                    <div className="relative">
                                        <button
                                            onClick={(e) => {
                                            const button = e.currentTarget;
                                            const parent = button.offsetParent;
                                            const rect = button.getBoundingClientRect();
                                            const parentRect = parent.getBoundingClientRect();
                                            setDropdownPosition({ top: rect.bottom - parentRect.top, left: rect.left - parentRect.left });
                                            setActiveDropdown(activeDropdown === item.e_id ? null : item.e_id);
                                        }}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.e_id && (
                                            <div
                                                style={{ position: 'absolute', top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                                                className="absolute w-36 bg-white border border-gray-300 rounded-md shadow-md max-h-48 z-50 overflow-y-auto"
                                                >
                                                <div className="py-1">
                                                    <a
                                                        onClick={() => handleEdit(item.e_id)}
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a
                                                        onClick={() => handleDelete(item.e_id)}
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100"
                                                    >
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    <a onClick={() => duplicateItem(item.e_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
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

export default EventDashboard