import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MediaLibraryModal from '../MediaLibraryModal';
import { API, API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';

const FacultyFieldSocial = forwardRef(({ formData = {}, setFormData = {}, f_id }, ref) => {
    const [rotatedStates, setRotatedStates] = useState({});
    const [currentSocialId, setCurrentSocialId] = useState(null);
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [social, setSocial] = useState([
        {
            id: 1,
            f_id: f_id,
            title: "Social 1",
            social_link: null,
            social_img: null,
            display: 0,
            active: 1,
        },
    ]);

    useImperativeHandle(ref, () => ({
        getData: () => {
            const sorted = [...social].sort((a, b) => a.social_order - b.social_order);
            return sorted.map((item, index) => {
                const data = {
                    f_id: item.f_id,
                    social_link: item.social_link,
                    social_img: item.social_img_id || null,
                    social_order: index + 1,
                    display: item.display !== undefined ? item.display : 0,
                    active: 1,
                };
                if (typeof item.social_id === 'number') {
                    data.social_id = item.social_id;
                }
                return data;
            });
        },
    }));

    const handleDeleteSocial = async (id) => {
        if (!window.confirm("Are you sure you want to delete of this social?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteSocial}/${id}`);
            setSocial(prevItems =>
                prevItems.map(item =>
                    item.id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            console.log("Social deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    };

    const handleAddSocial = () => {
        const newSocial = {
            id: Date.now().toString(),
            title: `Social ${social.length + 1}`,
            social_link: '',
            social_img: null,
            social_img_id: null,
            display: 0,
            active: 1,
            f_id: f_id,
            social_order: social.length + 1,
        };
        setSocial((prev) => [...prev, newSocial]);
    };

    const toggleRotation = (id) => {
        setRotatedStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(social);
        const [movedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, movedItem);

        // Reassign social_order based on new order
        const reorderedItems = items.map((item, index) => ({
            ...item,
            social_order: index + 1
        }));

        // Ensure ordering by social_order before updating state
        reorderedItems.sort((a, b) => a.social_order - b.social_order);

        setSocial(reorderedItems);
    };

    useEffect(() => {
        if (f_id) {
            // Fetch social records first
            fetch(`${API_ENDPOINTS.getSocialByFaculty}/${f_id}`)
                .then(res => res.json())
                .then(async result => {
                    if (Array.isArray(result.data)) {
                        const imgRes = await fetch(`${API_ENDPOINTS.getImages}`);
                        const imgData = await imgRes.json();

                        const formatted = result.data.map((item, index) => {
                            const matched = imgData.data?.find(img => img.image_id === item.social_img);
                            return {
                                id: item.social_id?.toString(),
                                title: `Social ${index + 1}`,
                                social_link: item.social_link || '',
                                social_img: matched ? `${API}/storage/uploads/${matched.img}` : null,
                                social_img_id: item.social_img || null,
                                display: item.display ?? 0,
                                active: item.active ?? 1,
                                social_order: item.social_order || 0,
                                social_faculty: item.social_faculty,
                                social_id: item.social_id
                            };
                        });

                        setSocial(formatted);
                    }
                })
                .catch(err => console.error("❌ Error fetching social data:", err));
        }
    }, [f_id]);

    const openMediaLibrary = (socialId, field) => {
        setCurrentSocialId(socialId);
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = async (imageUrl, field) => {
        if (field === "social_img") {
            try {
                const response = await fetch(`${API_ENDPOINTS.getImages}`);
                const result = await response.json();

                if (result.status_code === "success" && Array.isArray(result.data)) {
                    const matchedImage = result.data.find(image => image.image_url === imageUrl);
                    if (matchedImage) {
                        setSocial(prevSocial =>
                            prevSocial.map(item =>
                                item.id === currentSocialId
                                    ? {
                                        ...item,
                                        social_img: matchedImage.image_url,  // for display
                                        social_img_id: matchedImage.image_id // for backend saving
                                    }
                                    : item
                            )
                        );
                    } else {
                        console.warn("Image not found in API response for URL:", imageUrl);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch images:", error);
            }
        }

        setMediaLibraryOpen(false);
    };

    return (
        <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
                Social
            </label>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className='mt-2'>
                            <ul class="h-auto overflow-y-auto border rounded-t-lg mt-1">
                                {social.map((socials, index) => (
                                    <Draggable
                                        key={socials.id}
                                        draggableId={socials.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <li
                                                className={`below-border ${index === socials.length - 1 ? 'border-none' : ''}`}
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                            >
                                                {/* Social  */}
                                                <details className='group [&_summary::-webkit-details-marker]:hidden !border-b-1 '>
                                                    <summary className='cursor-pointer flex justify-between rounded-lg px-2 py-2 pl-5 w-full '
                                                        onClick={() => toggleRotation(socials.id)}
                                                    >
                                                        <div className="flex ">
                                                            <div className="cursor-grab my-auto"
                                                                {...provided.dragHandleProps}>
                                                                <svg class="cursor-grab size-5 my-auto" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                                                    <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                                                                </svg>
                                                            </div>
                                                            <span className="ml-2 text-lg">{socials.title}</span>
                                                        </div>
                                                        <span className=' shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2'>
                                                            <span>
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    strokeWidth={1.5}
                                                                    stroke="currentColor"
                                                                    className="size-6 cursor-pointer"
                                                                    onClick={() => handleDeleteSocial(socials.id)}
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>
                                                            </span>
                                                            <span
                                                                className={`cursor-pointer shrink-0 transition-transform duration-300 ${rotatedStates[socials.id] ? "rotate-180" : ""
                                                                    }`}
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                                </svg>
                                                            </span>
                                                        </span>
                                                    </summary>

                                                    {/* Url link */}
                                                    <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                        <div className="flex-1">
                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                Url link
                                                            </label>
                                                            <div className="mt-2">
                                                                <textarea
                                                                    value={socials.social_link || ''}
                                                                    onChange={(e) => {
                                                                        const newSocials = [...social];
                                                                        newSocials[index].social_link = e.target.value;
                                                                        setSocial(newSocials);
                                                                    }}
                                                                    className="!border-gray-300 h-32 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* Image */}
                                                    <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                        <div className="flex-1">
                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                Icon
                                                            </label>
                                                            <div className="flex items-center justify-center w-full mt-2 border-1">
                                                                <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                                    {socials.social_img ? (
                                                                        <div>
                                                                            <img
                                                                                src={socials.social_img}
                                                                                alt="Selected"
                                                                                className="h-40 w-40 object-contain"
                                                                            />
                                                                            <div className="flex gap-3 mt-2 justify-center">
                                                                                <svg
                                                                                    onClick={() => openMediaLibrary(socials.id, "social_img")}
                                                                                    value={formData.social_img}
                                                                                    onChange={(e) => setFormData({ ...formData, social_img: e.target.value })}
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="1.5"
                                                                                    stroke="currentColor"
                                                                                    className="size-8 hover:text-red-700"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                                                                    />
                                                                                </svg>
                                                                                <svg
                                                                                    onClick={() => {
                                                                                        const updated = [...social];
                                                                                        updated[index].social_img = null;
                                                                                        updated[index].social_img_id = null;
                                                                                        setSocial(updated);
                                                                                    }}
                                                                                    value={formData.social_img}
                                                                                    onChange={(e) => setFormData({ ...formData, social_img: e.target.value })}
                                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                                    fill="none"
                                                                                    viewBox="0 0 24 24"
                                                                                    strokeWidth="1.5"
                                                                                    stroke="currentColor"
                                                                                    className="size-8 hover:text-red-700"
                                                                                >
                                                                                    <path
                                                                                        strokeLinecap="round"
                                                                                        strokeLinejoin="round"
                                                                                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                                    />
                                                                                </svg>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            onClick={() => openMediaLibrary(socials.id, "social_img")}
                                                                            value={formData.social_img}
                                                                            onChange={(e) => setFormData({ ...formData, social_img: e.target.value })}
                                                                            className="flex flex-col items-center justify-center pt-5 pb-6 "
                                                                        >
                                                                            <svg
                                                                                className="w-8 h-8 mb-4 text-gray-500"
                                                                                aria-hidden="true"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 20 16"
                                                                            >
                                                                                <path
                                                                                    stroke="currentColor"
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                                                                />
                                                                            </svg>
                                                                            <p className="mb-2 text-sm text-gray-500">
                                                                                <span className="font-semibold">Click to upload icon</span>
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        </div>
                                                        {isMediaLibraryOpen && (
                                                            <MediaLibraryModal
                                                                onSelect={(imageUrl) => handleImageSelect(imageUrl, "social_img")}
                                                                onClose={() => setMediaLibraryOpen(false)}
                                                            />
                                                        )}
                                                    </div>
                                                    {/* Display button */}
                                                    <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                        <div className="flex flex-row items-center w-full gap-4">
                                                            <label className="block text-xl font-medium leading-6 text-white-900">
                                                                Display
                                                            </label>
                                                            <div className="mt-2">
                                                                <label className="toggle-switch mb-1">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={socials.display}
                                                                        onChange={(e) => {
                                                                            const updatedSocials = [...social];
                                                                            updatedSocials[index].display = e.target.checked ? 1 : 0;
                                                                            setSocial(updatedSocials);
                                                                        }}
                                                                    />
                                                                    <span className="slider"></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </details>
                                            </li>
                                        )}
                                    </Draggable>
                                ))}
                            </ul>
                            <a
                                className="flex items-center cursor-pointer p-3 text-sm font-medium text-blue-600 !border-b !border-x rounded-b-lg bg-gray-50  hover:bg-gray-100  hover:underline"
                                onClick={handleAddSocial}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                Add new social
                            </a>
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    )
});

export default FacultyFieldSocial