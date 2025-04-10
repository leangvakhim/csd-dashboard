import React, { useState } from 'react'
import { useEffect } from 'react';
import { API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PartnershipDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [facultyItems, setFacultyItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getPartnership);
                let newsArray = response.data.data;

                if (newsArray && !Array.isArray(newsArray)) {
                    newsArray = [newsArray];
                } else if (!newsArray) {
                    newsArray = [];
                }

                const sortedCareer = newsArray.sort((a, b) => b.ps_order - a.ps_order);
                setFacultyItems(sortedCareer);
            } catch (error) {
                console.error('Failed to fetch partnership:', error);
            }
        };

        fetchNews();
    }, []);

    const handleEdit = async (id) => {
        const response = await axios.get(`${API_ENDPOINTS.getPartnership}/${id}`);
        const eventData = response.data;
        navigate('/partnership/partnership-details', { state: { eventData } });
    };


    const moveItem = async (index, direction) => {
        const newItems = [...facultyItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update e_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            ps_order: newItems.length - i
        }));

        setFacultyItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            ps_id: item.ps_id,
            ps_order: item.ps_order
        }));

        await axios.put(`${API_ENDPOINTS.updatePartnershipOrder}`, payload);
    };

    // const duplicateItem = async (id) => {
    //     try {
    //         const response = await axios.post(`${API_ENDPOINTS.duplicatePartnership}/${id}`);
    //         if (response.status === 200) {
    //             alert("partner duplicated successfully");
    //             window.location.reload();
    //         }
    //     } catch (error) {
    //         console.error("Error duplicating partner:", error);
    //     }
    // };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete of this partnership?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deletePartnership}/${id}`);
            setFacultyItems(prevItems =>
                prevItems.map(item =>
                    item.ps_id === id ? { ...item, active: item.active ? 0 : 1 } : item
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
                            Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Name
                        </th>

                        <th scope="col" className=" px-6 py-3">
                            {/* Action */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {facultyItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No news data available.
                            </td>
                        </tr>
                    ) : (facultyItems.map((item, index) => (
                        <tr key={item.ps_id} className="odd:bg-white even:bg-gray-50 border">
                            <td
                                scope="row"
                                className="px-6 py-4"
                            >
                                <img src={item.ps_img} alt="" className='size-12 p-1' />
                            </td>
                            <td className="px-6 py-4">
                                {item.ps_type === 1 ? "Scholarship" : item.ps_type === 2 ? "University" : "Unknown"}
                            </td>

                            <td className="px-6 py-4">{item.ps_title}</td>

                            <td className="px-2 py-6 flex gap-2 items-center relative">
                                <button onClick={() => moveItem(index, 'up')} className="font-medium text-gray-900 hover:text-blue-500">
                                    <i className="ti ti-chevron-up text-xl"></i>
                                </button> |
                                <button onClick={() => moveItem(index, 'down')} className="font-medium text-gray-900 hover:text-blue-500">
                                    <i className="ti ti-chevron-down text-xl"></i>
                                </button> |
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === item.ps_id ? null : item.ps_id)}
                                        className="font-medium text-gray-900 hover:text-blue-500"
                                    >
                                        <i className="ti ti-dots-vertical text-xl"></i>
                                    </button>
                                    {activeDropdown === item.ps_id && (
                                        <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                            <div className="py-1">
                                                <a
                                                    onClick={() => handleEdit(item.ps_id)}
                                                    href="#" className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Edit</span>
                                                </a>
                                                <a
                                                    onClick={() => handleDelete(item.ps_id)}
                                                    href="#" className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Delete</span>
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

export default PartnershipDashboard