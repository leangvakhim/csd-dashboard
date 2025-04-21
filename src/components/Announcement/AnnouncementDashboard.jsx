import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AnnouncementDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [announcementItems, setAnnouncementItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getAnnouncement);
                setAnnouncementItems(Array.isArray(response.data.data) ? response.data.data : []);
            } catch (error) {
                console.error('Failed to fetch announcements:', error);
            }
        };

        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to toggle this announcement’s visibility?')) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteAnnouncement}/${id}`);
            setAnnouncementItems((prevItems) =>
                prevItems.map((item) =>
                    item.am_id === id ? { ...item, display: item.display ? 0 : 1 } : item
                )
            );
            window.location.reload();
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.getAnnouncement}/${id}`);
            const announcementData = response.data;
            navigate('/announcement/announcement-details', { state: { announcementData } });
        } catch (error) {
            console.error('Error fetching announcement for edit:', error);
        }
    };

    const moveItem = async (index, direction) => {
        const newItems = [...announcementItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        const updatedItems = newItems.map((item, i) => ({
            ...item,
            am_orders: i + 1,
        }));

        setAnnouncementItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error('Failed to update order on server:', error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map((item) => ({
            am_id: item.am_id,
            am_orders: item.am_orders,
        }));

        await axios.put(API_ENDPOINTS.updateAnnouncementOrder, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axios.post(`${API_ENDPOINTS.duplicateAnnouncement}/${id}`);
            if (response.status === 200) {
                alert('Announcement duplicated successfully');
                window.location.reload();
            }
        } catch (error) {
            console.error('Error duplicating announcement:', error);
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Post On</th>
                        <th scope="col" className="px-6 py-3">Language</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {announcementItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No announcement data available.
                            </td>
                        </tr>
                    ) : (
                        announcementItems.map((item, index) => (
                            <tr key={item.am_id} className="odd:bg-white even:bg-gray-50 border">
                                <th
                                    scope="row"
                                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                                >
                                    {item.am_title || 'No Title'}
                                </th>
                                <td className="px-6 py-4">
                                    {item.am_postdate
                                        ? new Date(item.am_postdate).toLocaleDateString('en-US', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                          })
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {{ 1: 'English', 2: 'Khmer' }[item.lang] || 'Unknown'}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`${
                                            item.display
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-red-100 text-red-800'
                                        } text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}
                                    >
                                        {item.display ? 'Enable' : 'Disable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2 items-center relative">
                                    <a
                                        onClick={() => moveItem(index, 'up')}
                                        className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline"
                                    >
                                        <i className="ti ti-chevron-up text-xl"></i>
                                    </a>{' '}
                                    |
                                    <a
                                        onClick={() => moveItem(index, 'down')}
                                        className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline"
                                    >
                                        <i className="ti ti-chevron-down text-xl"></i>
                                    </a>{' '}
                                    |
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setActiveDropdown(
                                                    activeDropdown === item.am_id ? null : item.am_id
                                                )
                                            }
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.am_id && (
                                            <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a
                                                        onClick={() => handleEdit(item.am_id)}
                                                        href="#"
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100"
                                                    >
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a
                                                        onClick={() => handleDelete(item.am_id)}
                                                        href="#"
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100"
                                                    >
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    <a
                                                        onClick={() => duplicateItem(item.am_id)}
                                                        href="#"
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100"
                                                    >
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
    );
};

export default AnnouncementDashboard;