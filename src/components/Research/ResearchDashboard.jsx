import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS, API } from '../../service/APIConfig'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ResearchDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [researchItems, setResearchItems] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getResearch);
                const result = response.data.data;
                const normalized = Array.isArray(result) ? result : result ? [result] : [];
                setResearchItems(normalized);
            } catch (error) {
                console.error('Failed to fetch researchlab:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this research?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteResearch}/${id}`);
            setResearchItems(prevItems =>
                prevItems.map(item =>
                    item.rsd_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            window.location.reload();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleEdit = async (id) => {
        try {
            const response = await axios.get(`${API_ENDPOINTS.getResearch}/${id}`);
            const researchlabData = response.data;
            navigate(`/research/research-detail`, { state: { researchlabData } });
        } catch (error) {
            console.error("Error fetching research data:", error);
        }
    };

    const moveItem = async (index, direction) => {
        const newItems = [...researchItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        const updatedItems = newItems.map((item, i) => ({
            ...item,
            rsd_order: i + 1
        }));

        setResearchItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            rsd_id: item.rsd_id,
            rsd_order: item.rsd_order
        }));

        await axios.put(`${API_ENDPOINTS.updateResearch}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axios.post(`${API_ENDPOINTS.duplicateResearch}/${id}`);
            if (response.status === 200) {
                alert("Research duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating event:", error);
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3">Lead</th>
                        <th scope="col" className="px-6 py-3">Title</th>
                        <th scope="col" className="px-6 py-3">Language</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3"></th>
                    </tr>
                </thead>
                <tbody>
                    {researchItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="text-center py-8 text-gray-500 text-sm">
                                No research items found.
                            </td>
                        </tr>
                    ) : (
                        researchItems.map((item, index) => (
                            <tr key={item.rsd_id} className="odd:bg-white even:bg-gray-50 border">
                                <td className="pl-6 py-4">{item.rsd_lead}</td>
                                <td className="px-6 py-4">{item.rsd_title}</td>
                                <td className="px-6 py-4">{{
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
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setDropdownPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
                                                setActiveDropdown(activeDropdown === item.rsd_id ? null : item.rsd_id);
                                            }}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.rsd_id && (
                                            <div
                                                style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                                                className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a onClick={() => handleEdit(item.rsd_id)} className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100 cursor-pointer">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a onClick={() => handleDelete(item.rsd_id)} className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100 cursor-pointer">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    <a onClick={() => duplicateItem(item.rsd_id)} className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100 cursor-pointer">
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

}

export default ResearchDashboard;
