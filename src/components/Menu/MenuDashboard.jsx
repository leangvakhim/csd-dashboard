import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import MenuModal from './MenuModal';

const MenuDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pageOptions, setPageOptions] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const handleEdit = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getMenu);
                const result = (response.data.data || []);
                const normalized = Array.isArray(result) ? result : result ? [result] : [];
                setMenuItems(normalized);
            } catch (error) {
                console.error("❌ Failed to fetch menu items:", error);
            }
        };

        const fetchPages = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getPage);
                if (res.data && Array.isArray(res.data.data)) {
                    setPageOptions(res.data.data);
                } else {
                    console.error("❌ pageOptions is not an array:", res.data.data);
                    setPageOptions([]); // fallback
                }
            } catch (err) {
                console.error('❌ Failed to fetch pages:', err);
            }
        };

        fetchPages();
        fetchMenuItems();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete of this menu?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteMenu}/${id}`);
            setMenuItems(prevItems =>
                prevItems.map(item =>
                    item.menu_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            window.location.reload();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const moveItem = async (index, direction) => {
        const newItems = [...menuItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update e_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            menu_order: newItems.length - i // or i + 1 for ascending order
        }));

        setMenuItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            menu_id: item.menu_id,
            menu_order: item.menu_order
        }));

        await axios.put(`${API_ENDPOINTS.updateMenuOrder}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axios.post(`${API_ENDPOINTS.duplicateMenu}/${id}`);
            if (response.status === 200) {
                alert("Menu duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating menu:", error);
        }
    };

    return (
        <div className="relative shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500 ">
                <thead className="text-xs text-gray-700  uppercase bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Page
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Language
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Display
                        </th>
                        <th scope="col" className=" px-6 py-3">
                            {/* Action */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map((item, index) => (
                        <tr key={item.menu_id} className="odd:bg-white even:bg-gray-50 border">
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                {item.title}
                            </th>
                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                {pageOptions.find(page => page.p_menu === item.menu_id)?.p_title || 'N/A'}
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
                            <td className="px-6 py-4 flex gap-2 items-center relative overflow-visible">
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
                                            setActiveDropdown(activeDropdown === item.menu_id ? null : item.menu_id);
                                        }}
                                        className="font-medium text-gray-900 hover:text-blue-500"
                                    >
                                        <i className="ti ti-dots-vertical text-xl"></i>
                                    </button>
                                    {activeDropdown === item.menu_id && (
                                        <div
                                            className="fixed w-36 bg-white border border-gray-300 rounded-md shadow-md z-50"
                                            style={{ top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                                        >
                                            <div className="py-1">
                                                <a onClick={() => handleEdit(item)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Edit</span>
                                                </a>
                                                <a onClick={() => handleDelete(item.menu_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                    <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                    <span className="text-sm text-gray-700">Delete</span>
                                                </a>
                                                <a onClick={() => duplicateItem(item.menu_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
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
            {isModalOpen && (
                <MenuModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    data={selectedItem}
                />
            )}
        </div>
    )
}

export default MenuDashboard