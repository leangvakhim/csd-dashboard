import React, { useState } from 'react'
import MediaLibraryModal from '../MediaLibraryModal';
import { API_ENDPOINTS, axiosInstance } from '../../service/APIConfig';
import { useEffect } from 'react';

const FeedbackFieldBody = ({ formData, setFormData, onImageSelect }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        if (formData.lang) {
            setActiveTab(formData.lang);
        }
    }, [formData.lang]);

    useEffect(() => {
        if (formData.fb_img) {
            axiosInstance.get(`${API_ENDPOINTS.getImages}`)
                .then((res) => {
                const result = res.data;
                    const matched = result.data.find(img => img.image_id === formData.fb_img);
                    if (matched) {
                        setSelectedImage(matched.image_url);
                    }
                })
                .catch(err => console.error("Error fetching image:", err));
        }
    }, [formData.fb_img]);


    const openMediaLibrary = () => {
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = async (imageUrl, field) => {
        if (field === "image") {
            setSelectedImage(imageUrl ? `${imageUrl}` : "");
            try {
                const response = await axiosInstance.get(`${API_ENDPOINTS.getImages}`);
                const result = await response.json();

                if (result.status_code === "success" && Array.isArray(result.data)) {
                    const matchedImage = result.data.find(image => image.image_url === imageUrl);
                    if (matchedImage) {
                        onImageSelect(matchedImage.image_id);
                        setFormData(prevData => ({
                            ...prevData,
                            fb_img: matchedImage.image_id,
                        }));
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
        <div className='px-8 py-2 mb-1'>
            <div className="tabs">
                <div className="flex">
                    <ul className="flex items-center h-12 bg-gray-100 rounded-lg transition-all duration-300 p-2 overflow-hidden">
                        {[
                            { id: 1, label: "English" },
                            { id: 2, label: "Khmer" },
                            // { id: 3, label: "Chinese" },
                            // { id: 4, label: "French" }
                        ].map(langOption => (
                            <li key={langOption.id}>
                                <a
                                    href="javascript:void(0)"
                                    className={`mx-2 inline-block py-1.5 px-6 text-gray-600 hover:text-gray-800 font-medium ${activeTab === langOption.id ? 'bg-white rounded-lg text-gray-600' : 'tablink'
                                        } whitespace-nowrap`}
                                    onClick={() => {
                                        setActiveTab(langOption.id);
                                        setFormData(prev => ({ ...prev, lang: langOption.id }));
                                    }}
                                    role="tab"
                                >
                                    {langOption.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="mt-3">
                    {/* First row */}
                    <div className="flex flex-col sm:!flex-row items-center gap-4 py-2 mb-1">
                        <div className="flex-1 w-full">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={formData.fb_writer || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, fb_writer: e.target.value }))}
                                    className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Full name
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    value={formData.fb_title || ""}
                                    onChange={e => setFormData(prev => ({ ...prev, fb_title: e.target.value }))}
                                    className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex-non">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Display
                            </label>
                            <div className="mt-2">
                                <label className="toggle-switch mt-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.display === 1}
                                        onChange={e =>
                                            setFormData(prev => ({
                                                ...prev,
                                                display: e.target.checked ? 1 : 0
                                            }))
                                        }
                                    />
                                    <span className="slider"></span>
                                </label>

                            </div>
                        </div>
                    </div>
                    {/* Second row */}
                    <div>
                        <div className="grid grid-cols-1 md:!grid-cols-2 gap-4 py-2">
                            <div className="flex-1">
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                    Image
                                </label>
                                <div className="flex items-center justify-center w-full mt-2 border-1">
                                    <label
                                        className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                    >
                                        {selectedImage ? (
                                            <div>
                                                <img
                                                    src={selectedImage}
                                                    alt="Selected"
                                                    className="h-40 w-40 object-contain"
                                                />
                                                <div className="flex gap-3 mt-2 justify-center">
                                                    <svg
                                                        onClick={() => openMediaLibrary("image")}
                                                        value={formData.fb_img}
                                                        onChange={(e) => setFormData({ ...formData, fb_img: e.target.value })}
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
                                                        onClick={() => handleImageSelect("", "image")}
                                                        value={formData.fb_img}
                                                        onChange={(e) => setFormData({ ...formData, fb_img: e.target.value })}
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
                                                onClick={() => openMediaLibrary("image")}
                                                value={formData.fb_img}
                                                onChange={(e) => setFormData({ ...formData, fb_img: e.target.value })}
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
                                                    <span className="font-semibold">Click to upload image</span>
                                                </p>
                                            </div>
                                        )}
                                    </label>
                                </div>
                            </div>
                            {isMediaLibraryOpen && (
                                <MediaLibraryModal
                                    onSelect={(imageUrl) => handleImageSelect(imageUrl, "image")}
                                    onClose={() => setMediaLibraryOpen(false)}
                                />
                            )}

                            <div className="flex-1">
                                <label className="block text-lg font-semibold text-gray-700">Details</label>
                                <div className="mt-2">
                                    <textarea
                                        value={formData.fb_subtitle}
                                        onChange={(e) => setFormData({ ...formData, fb_subtitle: e.target.value })}
                                        className="h-60 w-full bg-gray-200 border !border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        placeholder="Enter details here..."
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default FeedbackFieldBody