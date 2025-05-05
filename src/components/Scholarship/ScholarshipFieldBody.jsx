import React, { useState, useEffect, useCallback } from 'react';
import MediaLibraryModal from '../MediaLibraryModal';
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';

const EDITOR_CONFIG = {
    readonly: false,
    height: 400,
    placeholder: 'Start typing...',
    uploader: {
        insertImageAsBase64URI: true,
    },
};

const ScholarshipFieldBody = ({ formData, setFormData, onImageSelect }) => {
    const [activeTab, setActiveTab] = useState(1);
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");
    const [selectedLetterImage, setSelectedLetterImage] = useState("");
    const [currentField, setCurrentField] = useState("");
    const [refOptions, setRefOptions] = useState([]);

    useEffect(() => {
        const fetchRefOptions = async () => {
        const currentLang = formData.lang;
        const oppositeLang = currentLang === 1 ? 2 : 1;

        try {
            const response = await axios.get(`${API_ENDPOINTS.getScholarship}`);
            const result = response.data;
            if (result.status_code === "success" && Array.isArray(result.data)) {
            const filtered = result.data.filter(item => item.lang === oppositeLang);

            setRefOptions(filtered.map(item => ({
              value: item.ref_id,
              label: item.sc_title
            })));
            }
        } catch (error) {
            console.error("Failed to fetch opposite language faculty options:", error);
        }
      };

      if (formData.lang) {
        fetchRefOptions();
      }
    }, [formData.lang]);

    // Set active tab based on form data
    useEffect(() => {
        if (formData.lang) {
            setActiveTab(formData.lang);
        }
    }, [formData.lang]);

    // Fetch and set images when they change in form data
    useEffect(() => {
        const fetchAndSetImage = async (imageId, setImage) => {
            if (!imageId) return;

            try {
                const response = await fetch(API_ENDPOINTS.getImages);
                const result = await response.json();

                if (result.status_code === "success" && Array.isArray(result.data)) {
                    const matched = result.data.find(img => img.image_id === imageId);
                    if (matched) {
                        setImage(matched.image_url);
                    }
                }
            } catch (err) {
                console.error("Error fetching image:", err);
            }
        };

        fetchAndSetImage(formData.sc_img, setSelectedImage);
        fetchAndSetImage(formData.scletter_img, setSelectedLetterImage);
    }, [formData.sc_img, formData.scletter_img]);

    const openMediaLibrary = useCallback((field) => {
        setCurrentField(field);
        setMediaLibraryOpen(true);
    }, []);

    const handleImageSelect = useCallback(async (imageUrl, field) => {
        if (!imageUrl) {
            // Clear the image if empty URL is provided
            if (field === "image") {
                setSelectedImage("");
                setFormData(prev => ({ ...prev, sc_img: "" }));
            } else {
                setSelectedLetterImage("");
                setFormData(prev => ({ ...prev, scletter_img: "" }));
            }
            setMediaLibraryOpen(false);
            return;
        }

        try {
            const response = await fetch(API_ENDPOINTS.getImages);
            const result = await response.json();

            if (result.status_code === "success" && Array.isArray(result.data)) {
                const matchedImage = result.data.find(image => image.image_url === imageUrl);
                if (matchedImage) {
                    const fieldName = field === "image" ? "sc_img" : "scletter_img";
                    const setImage = field === "image" ? setSelectedImage : setSelectedLetterImage;

                    setImage(imageUrl);
                    onImageSelect(matchedImage.image_id, fieldName);
                    setFormData(prev => ({
                        ...prev,
                        [fieldName]: matchedImage.image_id,
                    }));
                }
            }
        } catch (error) {
            console.error("Failed to fetch images:", error);
        }

        setMediaLibraryOpen(false);
    }, [setFormData, onImageSelect]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    }, [setFormData]);

    const handleEditorChange = useCallback((newContent) => {
        setFormData(prev => ({
            ...prev,
            sc_detail: newContent
        }));
    }, [setFormData]);

    const renderImageUpload = (field, selectedImage, setImage) => {
        const isImageSelected = !!selectedImage;
        const fieldName = field === "image" ? "sc_img" : "scletter_img";
        const label = field === "image" ? "Image" : "Letter Image";

        return (
            <div className="">
                <label className="block text-xl font-medium leading-6 text-white-900">
                    {label}
                </label>
                <div className="flex items-center justify-center w-full mt-2 border-1">
                    <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        {isImageSelected ? (
                            <div>
                                <img
                                    src={selectedImage}
                                    alt="Selected"
                                    className="h-40 w-40 object-contain"
                                />
                                <div className="flex gap-3 mt-2 justify-center">
                                    <svg
                                        onClick={() => openMediaLibrary(field)}
                                        value={formData[fieldName]}
                                        className="size-8 hover:text-red-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                                        />
                                    </svg>
                                    <svg
                                        onClick={() => handleImageSelect("", field)}
                                        value={formData[fieldName]}
                                        className="size-8 hover:text-red-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
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
                                onClick={() => openMediaLibrary(field)}
                                value={formData[fieldName]}
                                className="flex flex-col items-center justify-center pt-5 pb-6"
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
        );
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

                <div className="mt-4">
                    {/* First row */}
                    <div className="flex sm:!flex-row flex-col gap-4 items-center py-2">
                        <div className="flex-1 w-full">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    type="text"
                                    name="sc_title"
                                    value={formData.sc_title}
                                    onChange={handleInputChange}
                                    className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex-non mb-2">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Display
                            </label>
                            <div className="mt-1">
                                <label className="toggle-switch mt-2">
                                    <input
                                        type="checkbox"
                                        name="display"
                                        checked={formData.display === 1}
                                        onChange={handleInputChange}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Second row */}
                    <div className='my-6 sm:my-0'>
                        <div className="space-y-5">
                            <div className="flex flex-col sm:!flex-row gap-6 bg-white shadow-md rounded-lg">
                                {/* Deadline */}
                                <div className="flex flex-col w-full">
                                    <label className="text-lg font-semibold text-gray-700">Deadline</label>
                                    <div className="relative mt-2">
                                        <input
                                            type="date"
                                            name="sc_deadline"
                                            value={formData.sc_deadline}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-3 py-2 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Post date */}
                                <div className="flex flex-col w-full">
                                    <label className="text-lg font-semibold text-gray-700">Post date</label>
                                    <div className="relative mt-2">
                                        <input
                                            type="date"
                                            name="sc_postdate"
                                            value={formData.sc_postdate}
                                            onChange={handleInputChange}
                                            className="w-full pl-10 pr-3 py-2 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                {/* Sponsor */}
                                <div className="flex flex-col w-full">
                                    <label className="text-lg font-semibold text-gray-700">Sponsor</label>
                                    <input
                                        type="text"
                                        name="sc_sponsor"
                                        value={formData.sc_sponsor}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full bg-gray-200 py-2 px-3 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:!flex-row gap-6 bg-white shadow-md rounded-lg">
                                {/* References */}
                                <div className="flex flex-col w-full">
                                    <label className="block text-xl font-medium text-gray-700">Reference</label>
                                        <select
                                            value={formData.ref_id || ""}
                                            onChange={(e) => setFormData({ ...formData, ref_id: parseInt(e.target.value) })}
                                            className="mt-2 block w-full border !border-gray-300 rounded-md py-2 pl-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                                        >
                                        <option value="">-- Select Reference --</option>
                                        {refOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Sponsor */}
                                <div className="flex flex-col w-full">
                                    <label className="text-lg font-semibold text-gray-700">Sponsor</label>
                                    <input
                                        type="text"
                                        name="sc_sponsor"
                                        value={formData.sc_sponsor}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full bg-gray-200 py-2 px-3 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:!flex-row gap-6 bg-white shadow-md rounded-lg">
                                {/* Short Title */}
                                <div className="flex flex-col w-full">
                                    <label className="text-lg font-semibold text-gray-700">Short Title</label>
                                    <input
                                        type="text"
                                        name="sc_shortdesc"
                                        value={formData.sc_shortdesc}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full bg-gray-200 py-2 px-3 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                {/* Favourite */}
                                <div className="flex flex-col w-full">
                                    <label className="text-lg font-semibold text-gray-700">Favourite</label>
                                    <select
                                        name="sc_fav"
                                        value={formData.sc_fav}
                                        onChange={handleInputChange}
                                        className="mt-2 w-full bg-gray-200 border !border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="">Drop down</option>
                                        <option value="1">Yes</option>
                                        <option value="0">No</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fourth row - Images */}
                    <div className="w-full my-0 sm:my-6">
                        <div className="grid grid-cols-1 md:!grid-cols-2 items-center gap-4">
                            {renderImageUpload("image", selectedImage, setSelectedImage)}
                            {renderImageUpload("letter_image", selectedLetterImage, setSelectedLetterImage)}
                        </div>
                    </div>

                    {/* Description Editor */}
                    <div className='h-full'>
                        <div className="flex-1">
                            <div className="grid grid-cols-1 gap-4 py-2">
                                <div className="w-full">
                                    <label className="block text-xl font-medium leading-6 text-white-900">
                                        Description
                                    </label>
                                    <div className="mt-2 cursor-text">
                                        <JoditEditor
                                            value={formData.sc_detail}
                                            config={EDITOR_CONFIG}
                                            tabIndex={1}
                                            onBlur={handleEditorChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {isMediaLibraryOpen && (
                <MediaLibraryModal
                    onSelect={(url) => handleImageSelect(url, currentField)}
                    onClose={() => setMediaLibraryOpen(false)}
                />
            )}
        </div>
    );
};

export default ScholarshipFieldBody;