import React, { useEffect, useState } from 'react'
import { API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PageDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [pageItems, setPageItems] = useState([]);
    const [menuOptions, setMenuOptions] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPages = async () => {
            try {
            const response = await axios.get(API_ENDPOINTS.getPage);
            const pages = Array.isArray(response.data)
                ? response.data
                : response.data?.data || [];
            setPageItems(pages);
            } catch (error) {
            console.error('Failed to fetch page:', error);
            setPageItems([]);
            }
        };
        const fetchMenu = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getMenu);
                if (res.data && res.data.data) {
                    setMenuOptions(res.data.data);
                }
            } catch (err) {
                console.error('❌ Failed to fetch pages:', err);
            }
        };

        fetchMenu();
        fetchPages();
    }, []);

    const handleEdit = async (id) => {
        const response = await axios.get(`${API_ENDPOINTS.getPage}/${id}`);
        const pageData = response.data;
        navigate('/page/page-detail', { state: { pageData } });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete of this page?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deletePage}/${id}`);
            setPageItems(prevItems =>
                prevItems.map(item =>
                    item.p_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            window.location.reload();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axios.post(`${API_ENDPOINTS.duplicatePage}/${id}`);
            if (response.status === 200) {
                alert("Page duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating page:", error);
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
                            Menu
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
                    {pageItems.map((item, index) => (
                        <tr key={item.id} className="odd:bg-white even:bg-gray-50 border">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {item.p_title}
                            </th>
                            <td className="px-6 py-4">
                                {menuOptions.find(menu => menu.menu_id === item.p_menu)?.title || 'N/A'}
                            </td>
                            <td className="px-6 py-4">
                                <span className={`${item.display ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}>
                                    {item.display ? 'Enable' : 'Disable'}
                                </span>
                            </td>
                            <td className="px-6 py-4 flex gap-2 items-center relative">
                                <div className="relative">
                                    <button
                                        onClick={() => setActiveDropdown(activeDropdown === item.p_id ? null : item.p_id)}
                                        className="font-medium text-gray-900 hover:text-blue-500"
                                    >
                                        <i className="ti ti-dots-vertical text-xl"></i>
                                    </button>
                                    {activeDropdown === item.p_id && (
                                        <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                            <div className="py-1">
                                                <a onClick={() => handleEdit(item.p_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Edit</span>
                                                </a>
                                                <a onClick={() => handleDelete(item.p_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Delete</span>
                                                </a>
                                                <a onClick={() => duplicateItem(item.p_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-copy text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Duplicate</span>
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PageDashboard