import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS, axiosInstance } from '../service/APIConfig';

const MediaLibraryModal = ({ onSelect, onClose }) => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filteredImages, setFilteredImages] = useState([]);
    const [selectedImageName, setSelectedImageName] = useState(null);

    useEffect(() => {
        axiosInstance.get(`${API_ENDPOINTS.getImages}`)
            .then(response => response.json())
            .then(data => {
                if (data.status === 200 && data.data) {
                    setImages(data.data);
                    setFilteredImages(data.data);
                }
            })
            .catch(error => console.error("Error fetching images:", error))
            .finally(() => setLoading(false));
    }, []);

    const handleImageUpload = async (event) => {
        const files = event.target.files;
        const formData = new FormData();

        for (let file of files) {
            formData.append("img[]", file);
        }

        try {
            const response = await axiosInstance.post(API_ENDPOINTS.uploadImage, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.data) {
                const updatedImages = await axiosInstance.get(API_ENDPOINTS.getImages);
                if (updatedImages.data && updatedImages.data.data) {
                    setImages(updatedImages.data.data);
                    setFilteredImages(updatedImages.data.data);
                }
            } else {
                console.error("Upload failed:", response.data);
            }
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();

        if (!query) {
            setFilteredImages(images);
            return;
        }

        const filtered = images.filter(image =>
            image.img.toLowerCase().includes(query)
        );

        setFilteredImages(filtered);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-[9999]">
            <div className="m-auto bg-gray-50 p-6 rounded-lg shadow-lg w-[800px] max-h-[80vh] overflow-y-auto">
                <h2 className="text-lg font-semibold mb-0">Select an Image</h2>

                <div className="flex justify-start py-2 items-center gap-2">
                    <div className="relative max-w-sm">
                        <input
                            className="w-60 px-4 h-9 rounded-md !border-gray-200 shadow-sm" type="search" placeholder="Search images"
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="mb-1">
                <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700">
                    <i className="ti ti-photo-up text-xl text-white mr-2"></i>
                    Upload
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                </label>
            </div>
                </div>

                {loading ? (
                    <p className="text-center py-4">Loading images...</p>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {filteredImages.map((image) => (
                            <div key={image.image_id}
                                className="relative flex items-center justify-center border rounded-lg"
                                onMouseEnter={() => setSelectedImageName(image.image_id)}
                                onMouseLeave={() => setSelectedImageName(null)}
                                onClick={() => {
                                    if (onSelect) onSelect(image.image_url);
                                    if (onClose) onClose();
                                }}
                                >
                                <img src={`${image.image_url}`}
                                     alt={`Media ${image.img}`}
                                    className="mx-auto my-auto object-contain max-h-40 cursor-pointer"
                                     />

                                     {selectedImageName === image.image_id && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-black !bg-opacity-50 text-white text-center p-1 text-xs !rounded-b-lg">
                                        {image.img}
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                )}

                <div className="w-18 cursor-pointer mt-4 px-4 py-2 bg-red-700 text-white rounded-lg"
                    onClick={onClose}
                    >
                    Close
                </div>
            </div>
        </div>
    );
};

export default MediaLibraryModal;