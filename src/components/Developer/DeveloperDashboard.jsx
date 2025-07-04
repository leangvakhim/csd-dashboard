import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, axiosInstance } from '../../service/APIConfig';
import { useLoading } from '../Context/LoadingContext';

const DeveloperDashboard = () => {
    const navigate = useNavigate();
    const {setLoading} = useLoading();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [developerItems, setFDeveloperItems] = useState([]);
    const [images, setImages] = useState([]);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    const moveItem = async (index, direction) => {
        const newItems = [...developerItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        // Update d_order values
        const updatedItems = newItems.map((item, i) => ({
            ...item,
            d_order: newItems.length - i
        }));

        setFDeveloperItems(updatedItems);

        try {
            await updateOrderOnServer(updatedItems);
        } catch (error) {
            console.error("Failed to update order on server:", error);
        }
    };

    const updateOrderOnServer = async (items) => {
        const payload = items.map(item => ({
            d_id: item.d_id,
            d_order: item.d_order
        }));

        await axiosInstance.post(`${API_ENDPOINTS.updateOrderDeveloper}`, payload);
    };

    const fetchDeveloper = async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.getDevelopers);
            const result = (response.data.data || []);
            const normalized = Array.isArray(result) ? result : result ? [result] : [];
            const sortedDeveloper = normalized.sort((a, b) => b.d_order - a.d_order);
            setFDeveloperItems(sortedDeveloper);
        } catch (error) {
            console.error('Failed to fetch delvelopers:', error);
        }
    };

    const fetchImages = async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.getImages);
            const data = response.data.data || [];
            setImages(data);
        } catch (err) {
            console.error("Error fetching images:", err);
        }
    };

    const getImageUrl = (imageId) => {
        const found = images.find(img => img.image_id === imageId);
        return found ? found.image_url : '';
    };

    const handleEdit = async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getDevelopers}/${id}`);
        const developData = response.data;
        navigate('/developer/developer-details', { state: { developData } });
    };

    useEffect(() => {
        try{
            setLoading(true);
            fetchDeveloper();
            fetchImages();
        }catch(error){
            console.error(error);
        }finally{
            setLoading(false);
        }
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
            await axiosInstance.put(`${API_ENDPOINTS.deleteDeveloper}/${id}`);
            setFDeveloperItems(prevItems =>
                prevItems.map(item =>
                    item.d_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            Swal.fire({
                title: 'Deleted!',
                text: 'The developer member has been deleted.',
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
                text: 'Failed to delete the developer member.',
                icon: 'error'
            });
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
                    {developerItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No Developer member available.
                            </td>
                        </tr>
                    ) : (
                        developerItems.map((item, index) => (
                            <tr key={item.d_id} className="odd:bg-white even:bg-gray-50 border">
                                <td
                                    scope="row"
                                    className="px-6 py-4"
                                >
                                    <img src={getImageUrl(item.d_img)} alt="" className='size-12' />
                                </td>
                                <td className="px-6 py-4">{item.d_name}</td>
                                <td className="px-6 py-4">{item.d_position}</td>
                                <td className="px-6 py-4">{{
                                    1: 'English',
                                    2: 'Khmer',
                                }[item.lang] || 'Unknown'}</td>
                                <td className="px-6 py-4">
                                    <span className={`${item.display ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}>
                                        {item.display ? 'Enable' : 'Disable'}
                                    </span>
                                </td>
                                <td className="px-2 py-6 flex gap-2 items-center relative">
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
                                                setActiveDropdown(activeDropdown === item.d_id ? null : item.d_id);
                                            }}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>

                                        {activeDropdown === item.d_id && (
                                            <div key={index}
                                                style={{ position: 'absolute', top: `${dropdownPosition.top}px`, left: `-65px` }}
                                                className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a
                                                        onClick={() => handleEdit(item.d_id)}
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a
                                                        onClick={() => handleDelete(item.d_id)}
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    {/* <a className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
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

export default DeveloperDashboard