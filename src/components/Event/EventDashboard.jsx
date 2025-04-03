import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../../service/APIConfig';

const EventDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [eventItems, setEventItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getEvent);
                // console.log('API Response:', response.data);
                setEventItems(response.data.data || []);
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
    };

    const moveItem = (index, direction) => {
        const newItems = [...eventItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];
        setEventItems(newItems);
    };

    const duplicateItem = (index) => {
        const itemToDuplicate = eventItems[index];

        const baseTitle = itemToDuplicate.title.replace(/\s\(copy(?:\s\d+)?\)$/i, '');

        const copyCount = eventItems.filter(item =>
            item.title.startsWith(baseTitle + ' (copy')
        ).length;

        const newTitle =
            copyCount === 0
                ? `${baseTitle} (copy)`
                : `${baseTitle} (copy ${copyCount})`;

        const newItem = {
            ...itemToDuplicate,
            id: Date.now(),
            title: newTitle
        };

        const newItems = [...eventItems];
        newItems.splice(index + 1, 0, newItem);
        setEventItems(newItems);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete of this event?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteEvent}/${id}`);
            setEventItems(prevItems =>
                prevItems.map(item =>
                    item.e_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
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
                                <td className="px-6 py-4">{item.lang ? 'English' : 'Khmer'}</td>
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
                                            onClick={() => setActiveDropdown(activeDropdown === item.e_id ? null : item.e_id)}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.e_id && (
                                            <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
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
                                                    <a onClick={() => duplicateItem(index)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
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