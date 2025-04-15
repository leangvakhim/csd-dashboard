import React, { forwardRef, useImperativeHandle, useState, useEffect, useCallback, useMemo } from 'react';
import { API_ENDPOINTS, API } from '../../service/APIConfig';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MediaLibraryModal from "../MediaLibraryModal";



const DeleteIcon = ({ onClick }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 cursor-pointer hover:text-red-700"
        onClick={onClick}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

const ChevronIcon = ({ rotated }) => (
    <div className={`cursor-pointer shrink-0 transition-transform duration-300 ${rotated ? 'rotate-180' : ''}`}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6"
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
        </svg>
    </div>
);

const AddIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-6 mr-2 ml-2"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
);

const EditIcon = ({ onClick }) => (
    <svg
        onClick={onClick}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="size-8 hover:text-red-700"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25..." />
    </svg>
);

const ResearchlabTagSection = forwardRef(({ rsdl_id }, ref) => {
    console.log("Received rsdl_id prop:", rsdl_id);
    const [rotatedStates, setRotatedStates] = useState({});
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [currentImageFieldId, setCurrentImageFieldId] = useState(null);

    const [tags, setTags] = useState([{
        id: "1",
        title: "tag 1",
        rsdlt_title: null,
        rsdlt_img: null,
        active: 1,
    }]);

    // Memoized sorted tags
    const sortedTags = useMemo(() => {
        return [...tags].sort((a, b) => a.rsdlt_title - b.rsdlt_title || 0);
    }, [tags]);

    // Expose getData method to parent via ref
    useImperativeHandle(ref, () => ({
        getData: () => {
            return sortedTags.map((item, index) => ({
                rsdlt_id: item.rsdlt_id,
                rsdlt_title: item.rsdlt_title,
                rsdlt_img: item.rsdlt_img,
                active: item.active,
            }));
        }
    }));

    // Media library handlers
    const openMediaLibrary = useCallback((tagId) => {
        setCurrentImageFieldId(tagId);
        setMediaLibraryOpen(true);
    }, []);

    const handleImageSelect = useCallback(async (imageUrl) => {
        if (!currentImageFieldId) return;

        try {
            const response = await fetch(`${API_ENDPOINTS.getImages}`);
            const result = await response.json();

            if (result.status_code === "success" && Array.isArray(result.data)) {
                const matchedImage = result.data.find(image => image.image_url === imageUrl);

                if (matchedImage) {
                    setTags(prev =>
                        prev.map(item =>
                            item.id === currentImageFieldId
                                ? { ...item, rsdlt_img: matchedImage.image_url }
                                : item
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Failed to fetch image data:", error);
        }

        setMediaLibraryOpen(false);
        setCurrentImageFieldId(null);
    }, [currentImageFieldId]);

    // Tag management handlers
    const addTag = useCallback(() => {
        setTags(prev => [...prev, {
            id: `${Date.now()}`,
            title: `Tag ${prev.length + 1}`,
            rsdlt_title: null,
            rsdlt_img: null,
            active: 1,
        }]);
    }, []);

    const deleteTag = useCallback(async (id) => {
        if (!window.confirm("Are you sure you want to delete this tag?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteResearchlabTag}/${id}`);
            setTags(prevItems =>
                prevItems.map(item =>
                    item.rsdlt_id === id ? { ...item, active: item.active ? 0 : 1 } : item
                )
            );
            window.location.reload();
        } catch (error) {
            console.error("Error toggling visibility:", error);
        }
    }, []);

    const handleDragEnd = useCallback((result) => {
        if (!result.destination) return;

        setTags(prev => {
            const newTags = [...prev];
            const [reorderedTag] = newTags.splice(result.source.index, 1);
            newTags.splice(result.destination.index, 0, reorderedTag);
            return newTags;
        });
    }, []);

    const toggleRotation = useCallback((id) => {
        setRotatedStates(prev => ({
            ...prev,
            [id]: !prev[id],
        }));
    }, []);

    const updateTagField = useCallback((id, field, value) => {
        setTags(prev =>
            prev.map(tag =>
                tag.id === id ? { ...tag, [field]: value } : tag
            )
        );
    }, []);

    const removeTagImage = useCallback((id) => {
        setTags(prev =>
            prev.map(tag =>
                tag.id === id ? { ...tag, rsdlt_img: null } : tag
            )
        );
    }, []);

    // Fetch tags on mount or when rsdl_id changes
    useEffect(() => {
        if (rsdl_id) {
            // Fetch research lab tags first
            fetch(`${API_ENDPOINTS.getResearchlab}/${rsdl_id}`)
                .then(res => res.json())
                .then(async result => {
                    if (Array.isArray(result.data)) {
                        // Fetch images
                        const imgRes = await fetch(`${API_ENDPOINTS.getImages}`);
                        const imgData = await imgRes.json();
    
                        const formattedTags = result.data.map((item, index) => {
                            const matchedImg = imgData.data?.find(img => img.image_id === item.rsdlt_img);
    
                            return {
                                rsdlt_id: item.rsdlt_id,
                                rsdl_id: item.rsdl_id,
                                id: item.rsdlt_id?.toString() || `${index}_${Date.now()}`,
                                title: `Tag ${index + 1}`,
                                rsdlt_title: item.rsdlt_title || '',
                                rsdlt_img: matchedImg ? `${API}/storage/uploads/${matchedImg.img}` : null,
                                rsdlt_img_id: item.rsdlt_img || null,
                                active: item.active ?? 1
                            };
                        });
    
                        setTags(formattedTags);
                    }
                })
                .catch(err => console.error("❌ Error fetching Tag data:", err));
        }
    }, [rsdl_id]);
    
    // Render functions
    const renderImageUploadArea = useCallback((tag) => (
        <div className="flex items-center justify-center w-full mt-2 border-1">
            <label className="flex flex-col items-center justify-center w-full h-96 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {tag.rsdlt_img ? (
                    <div>
                        <img
                            src={tag.rsdlt_img}
                            alt="Selected"
                            className="h-40 w-40 object-contain"
                        />
                        <div className="flex gap-3 mt-2 justify-center">
                            <svg
                                onClick={() => openMediaLibrary(tag.id)}
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
                                onClick={() => openMediaLibrary(tag.id)}

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
                        onClick={() => openMediaLibrary(tag.rsdlt_id)}
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
                            <span className="font-semibold">
                                Click to upload image
                            </span>
                        </p>
                    </div>
                )}
            </label>
        </div>
    ), [openMediaLibrary, removeTagImage]);

    const renderTagItem = useCallback((tag, index) => (
        <Draggable key={tag.id} draggableId={tag.id} index={index}>
            {(provided) => (
                <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="py-2 bg-white border"
                >
                    <div className="cursor-pointer flex justify-between rounded-lg w-full">
                        <div
                            className="cursor-pointer flex items-center justify-between w-full px-4"
                            onClick={() => toggleRotation(tag.id)}
                        >
                            <div className="flex gap-1 items-center" {...provided.dragHandleProps}>
                                <span className="text-lg font-medium">
                                    {tag.title}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <DeleteIcon onClick={() => deleteTag(tag.rsdlt_id)} />
                                <ChevronIcon rotated={rotatedStates[tag.id]} />
                            </div>
                        </div>
                    </div>
                    {rotatedStates[tag.id] && (
                        <div className="flex flex-col gap-4 px-4 py-2 my-4">
                            <div className="flex flex-row gap-4">
                                <div className="flex-1">
                                    <label className="block text-xl font-medium leading-6 text-white-900">
                                        Title
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={tag.rsdlt_title || ''}
                                            onChange={(e) => {
                                                const newSocials = [...tags];
                                                newSocials[index].rsdlt_title = e.target.value;
                                                setTags(newSocials);
                                            }}
                                            className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                    Image
                                </label>
                                {renderImageUploadArea(tag)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    ), [rotatedStates, deleteTag, toggleRotation, updateTagField, renderImageUploadArea]);

    return (
        <div className="space-y-0 border rounded-sm">
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="tags">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {sortedTags.map((tag, index) => renderTagItem(tag, index))}
                            {provided.placeholder}

                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {isMediaLibraryOpen && (
                <MediaLibraryModal
                    onSelect={handleImageSelect}
                    onClose={() => setMediaLibraryOpen(false)}
                />
            )}

            <button
                type="button"
                className="flex items-center py-2 text-sm font-medium text-blue-600 bg-gray-100 hover:bg-gray-50 hover:underline w-full"
                onClick={addTag}
            >
                <AddIcon />
                Add new tags
            </button>
        </div>
    );
});

export default ResearchlabTagSection;