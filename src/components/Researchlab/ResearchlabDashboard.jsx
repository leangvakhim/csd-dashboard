import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS, API, axiosInstance } from '../../service/APIConfig'
import { useNavigate } from 'react-router-dom';


const ResearchlabDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [researchlabItems, setResearchlabItems] = useState([]);
    const navigate = useNavigate();
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getResearchlab);
                const result = (response.data.data || []);
                const normalized = Array.isArray(result) ? result : result ? [result] : [];
                const sortedResearchlabs = normalized.sort((a, b) => b.rsdl_order - a.rsdl_order);
                setResearchlabItems(sortedResearchlabs);

            } catch (error) {
                console.error('Failed to fetch researchlab:', error);
            }
        };

        fetchEvents();
    }, []);

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
        await axiosInstance.put(`${API_ENDPOINTS.deleteResearchlab}/${id}`);
        setResearchlabItems(prevItems =>
            prevItems.map(item =>
                item.rsdl_id === id ? { ...item, active: item.active ? 0 : 1 } : item
            )
        );
        Swal.fire({
            title: 'Deleted!',
            text: 'The faculty member has been deleted.',
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
            text: 'Failed to delete the faculty member.',
            icon: 'error'
        });
    }
};

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getResearchlab}/${id}`);
        const researchlabData = response.data;
        navigate(`/lab/researchlab-details`, { state: { researchlabData } });
    };

    const moveItem = async (index, direction) => {
        const newItems = [...researchlabItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update e_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            rsdl_order: newItems.length - i
        }));

        setResearchlabItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            rsdl_id: item.rsdl_id,
            rsdl_order: item.rsdl_order
        }));

        await axiosInstance.put(`${API_ENDPOINTS.updateResearchlabOrder}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axiosInstance.post(`${API_ENDPOINTS.duplicateResearchlab}/${id}`);
            if (response.status === 200) {
                alert("researchlab duplicated successfully");
                window.location.reload();
            }
        } catch (error) {
            console.error("Error duplicating event:", error);
        }
    };

    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500 mb-32">
                <thead className="text-xs text-gray-700  uppercase bg-gray-50 ">
                    <tr>
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
                    {researchlabItems.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center py-6 text-gray-500">
                                No research lab items found.
                            </td>
                        </tr>
                    ) : (
                        researchlabItems.map((item, index) => (
                            <tr key={item.rsdl_id} className="odd:bg-white even:bg-gray-50 border">
                                <td className="px-6 py-4">{item.rsdl_title}</td>
                                <td className="px-6 py-4">{{
                                    1: 'English',
                                    2: 'Khmer',
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
                                                const button = e.currentTarget;
                                                const parent = button.offsetParent;
                                                const rect = button.getBoundingClientRect();
                                                const parentRect = parent.getBoundingClientRect();
                                                setDropdownPosition({ top: rect.bottom - parentRect.top, left: rect.left - parentRect.left });
                                                setActiveDropdown(activeDropdown === item.rsdl_id ? null : item.rsdl_id);
                                            }}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.rsdl_id && (
                                            <div
                                                style={{ position: 'absolute', top: `${dropdownPosition.top}px`, left: `${dropdownPosition.left}px` }}
                                                className="absolute w-36 bg-white border border-gray-300 rounded-md shadow-md max-h-48 z-50 overflow-y-auto">
                                                <div className="py-1">
                                                    <a
                                                        onClick={() => handleEdit(item.rsdl_id)}
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a
                                                        onClick={() => handleDelete(item.rsdl_id)}
                                                       className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    {/* <a href="#" onClick={() => duplicateItem(item.rsdl_id)} className="flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-copy text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Duplicate</span>
                                                    </a> */}
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

export default ResearchlabDashboard