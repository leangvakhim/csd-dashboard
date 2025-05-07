import React, { useState, useEffect, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';
import ResearchlabTagSection from './ResearchlabTagSection';
import MediaLibraryModal from '../MediaLibraryModal';
import { API, API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';

const config = {
    readonly: false,  // Set to true for read-only mode
    height: 400,
    placeholder: 'Start typing...',
    uploader: {
        insertImageAsBase64URI: true,  // Enable base64 image upload
    },
};

const ResearchlabFieldBody = ({
    formData,
    setFormData,
    researchlabTagRef,
    onImageSelect
}) => {
    const [activeTab, setActiveTab] = useState(formData.lang || 1);
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [selectedImage1, setSelectedImage1] = useState("");
    const [currentField, setCurrentField] = useState("");
    const [allImages, setAllImages] = useState([]);
    const [refOptions, setRefOptions] = useState([]);

    useEffect(() => {
        const fetchRefOptions = async () => {
        const currentLang = formData.lang;
        const oppositeLang = currentLang === 1 ? 2 : 1;

        try {
            const response = await axios.get(`${API_ENDPOINTS.getResearchlab}`);
            const result = response.data;
            if (Array.isArray(result.data)) {
            const filtered = result.data.filter(item => item.lang === oppositeLang);

            setRefOptions(filtered.map(item => ({
              value: item.ref_id,
              label: item.rsdl_title
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

    useEffect(() => {
        if (formData.lang) {
            setActiveTab(formData.lang);
        }
    }, [formData.lang]);


    const handleEditorChange = useCallback((newContent) => {
        setFormData(prev => ({
            ...prev,
            rsdl_detail: newContent
        }));
    }, [setFormData]);

    const openMediaLibrary = (field) => {
        setCurrentField(field);
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = (imageUrl, field) => {
        if (field === "image1") {
            setSelectedImage1(imageUrl);
            if (onImageSelect) {
                onImageSelect(imageUrl);
            }
        }
        setMediaLibraryOpen(false);
    };

    useEffect(() => {
        if (typeof formData.display !== 'boolean') {
            setFormData(prev => ({
                ...prev,
                display: !!parseInt(prev.display)
            }));
        }

    }, [formData]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await axios.get(API_ENDPOINTS.getImages);
                setAllImages(res.data?.data || []);
            } catch (err) {
                console.error("Failed to fetch images", err);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        if (formData.rsdl_img && allImages.length > 0) {
            const foundImage = allImages.find(img => img.image_id === formData.rsdl_img);
            if (foundImage) {
                setSelectedImage1(`${API}/storage/uploads/${foundImage.img}`);
            }
        }
    }, [formData.rsdl_img, allImages]);


    return (
        <div className='sm:px-8 px-2 py-2 mb-1'>
            <div className="tabs">
                <div className="flex">
                    <ul className="flex items-center h-12 bg-gray-100 rounded-lg transition-all duration-300 p-2 overflow-hidden">
                        {[
                            { id: 1, label: "English" },
                            { id: 2, label: "Khmer" }
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
                    <div className="flex flex-col sm:!flex-row gap-4 items-center py-2">
                        <div className="flex-1 w-full">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Title
                            </label>
                            <div className="mt-2">
                                <input
                                    name="rsdl_title"
                                    value={formData.rsdl_title}
                                    onChange={(e) => setFormData({ ...formData, rsdl_title: e.target.value })}
                                    type="text"
                                    className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full">
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

                        <div className="flex-non mb-2">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Display
                            </label>
                            <div className="mt-1">
                                <label className="toggle-switch mt-2">
                                    <input
                                        type="checkbox"
                                        name="display"
                                        checked={formData.display}
                                        onChange={(e) => setFormData({ ...formData, display: e.target.checked })}
                                    />

                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                    {/* Second row */}
                    <ResearchlabTagSection
                        ref={researchlabTagRef}
                        rsdl_id={formData.rsdl_id}
                    />
                    {/* Third row */}
                    <div className="flex-1 mt-2">
                        <label className="block text-xl font-medium leading-6 text-white-900">
                            Image
                        </label>
                        <div className="flex items-center justify-center w-full mt-2 border-1">
                            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                {selectedImage1 ? (
                                    <div>
                                        <img
                                            src={selectedImage1}
                                            alt="Selected"
                                            className="h-40 w-40 object-contain"
                                        />
                                        <div className="flex gap-3 mt-2 justify-center">
                                            <svg
                                                onClick={() => openMediaLibrary("image1")}
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
                                                onClick={() => handleImageSelect("", "image1")}
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
                                        onClick={() => openMediaLibrary("image1")}
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
                    </div>
                    {isMediaLibraryOpen && currentField === "image1" && (
                        <MediaLibraryModal
                            onSelect={(url) => handleImageSelect(url, "image1")}
                            onClose={() => setMediaLibraryOpen(false)}
                        />
                    )}

                    {/* Fourth row */}
                    <div>
                        <div className="grid grid-cols-1 gap-4 py-2">
                            <div className="w-full">
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                    Description
                                </label>
                                <div className="mt-2 cursor-text">
                                    <JoditEditor
                                        value={formData.rsdl_detail || ''}
                                        config={config}
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
    );
};

export default ResearchlabFieldBody;
