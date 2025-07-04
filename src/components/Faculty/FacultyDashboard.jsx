import React, { useEffect, useState } from 'react'
import { API_BASEURL, API_ENDPOINTS, API, axiosInstance } from '../../service/APIConfig'
import { useNavigate } from 'react-router-dom';
import { useLoading } from '../Context/LoadingContext';
import Swal from 'sweetalert2';

const FacultyDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [facultyItems, setFacultyItems] = useState([]);
    const navigate = useNavigate();
    const {setLoading} = useLoading();
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axiosInstance.get(API_ENDPOINTS.getFaculty);
                const result = response.data.data;
                const normalized = Array.isArray(result) ? result : result ? [result] : [];
                setFacultyItems(normalized);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            }
        };

        fetchEvents();
    }, []);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this faculty member?",
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
            await axiosInstance.put(`${API_ENDPOINTS.deleteFaculty}/${id}`);
            setFacultyItems(prevItems =>
                prevItems.map(item =>
                    item.f_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Faculty member has been deleted.',
                showConfirmButton: false,
                timer: 1000,
                timerProgressBar: true,
                customClass: {
                    popup: 'rounded-lg shadow-lg',
                    title: 'text-green-700',
                    htmlContainer: 'text-gray-600',
                }
            }).then(() => {
                window.location.reload();
            });
        } catch (error) {
            console.error("Error toggling visibility:", error);
            Swal.fire('Error', 'Failed to delete faculty member.', 'error');
        }
    };

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getFaculty}/${id}`);
        const facultyData = response.data;
        navigate(`/faculty/faculty-detail`, { state: { facultyData } });
        // console.log("Passing data: ",facultyData);
    };

    const moveItem = async (index, direction) => {
        const newItems = [...facultyItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update f_order values in ascending order
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            f_order: i + 1
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
            f_id: item.f_id,
            f_order: item.f_order
        }));

        await axiosInstance.put(`${API_ENDPOINTS.updateFacultyOrder}`, payload);
    };

    const duplicateItem = async (id) => {
        try {
            const response = await axiosInstance.post(`${API_ENDPOINTS.duplicateFaculty}/${id}`);
            if (response.status === 200) {
                alert("Faculty duplicated successfully");
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
                            Photo
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Full name
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Position
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
                    {facultyItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No faculty member available.
                            </td>
                        </tr>
                        ) : (
                        facultyItems.map((item, index) => (
                            <tr key={item.f_id} className="odd:bg-white even:bg-gray-50 border ">
                                <td
                                    scope="row"
                                    className="px-6 py-4"
                                    >
                                    <img src={`${API}/storage/uploads/${item.img?.img}`} alt="" className='w-12 h-12 object-cover rounded' />
                                </td>
                                <td className="px-6 py-4">{item.f_name}</td>
                                <td className="px-6 py-4">{item.f_position}</td>
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
                                <td className="px-2 py-10 flex gap-2 items-center relative">
                                    <a onClick={() => moveItem(index, 'up')} className=" cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
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
                                            setActiveDropdown(activeDropdown === item.f_id ? null : item.f_id);
                                        }}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.f_id && (
                                            <div
                                                style={{ position: 'absolute', top: `${dropdownPosition.top}px`, left: `-80px` }}
                                                className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a onClick={() => handleEdit(item.f_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a onClick={() => handleDelete(item.f_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    {/* <a onClick={() => duplicateItem(item.f_id)} className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
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

export default FacultyDashboard