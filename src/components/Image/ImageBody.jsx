import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import ImageHeader from './ImageHeader';

const ImageBody = () => {
    const [images, setImages] = useState([]);
    const [filteredImages, setFilteredImages] = useState([]); // State for filtered images
    const [selectedImageName, setSelectedImageName] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Fetch Images from API
    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getImages);
                if (response.data && response.data.data) {
                    setImages(response.data.data); // images
                    setFilteredImages(response.data.data);
                } else {
                    setImages([]);
                    setFilteredImages([]); // Reset filtered images
                }
            } catch (error) {
                console.error("Error fetching images:", error);
                setImages([]);
                setFilteredImages([]); // Reset filtered images
            }
        };

        fetchImages();
    }, []);

    // Search functionality
    const handleSearch = (query) => {
        if (!query) {
            setFilteredImages(images);
        } else {
            const filtered = images.filter(image =>
                image.img.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredImages(filtered);
        }
    };

    // Upload Images
    const handleImageUpload = async (event) => {
        const files = event.target.files;
        if (!files.length) return;

        const formData = new FormData();
        for (let file of files) {
            console.log("📁 Appending file:", file.name);
            formData.append("img[]", file);
        }

        try {
            setIsUploading(true);
            const response = await axios.post(API_ENDPOINTS.uploadImage, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data && response.data.data) {
                const updatedImages = await axios.get(API_ENDPOINTS.getImages);
                if (updatedImages.data && updatedImages.data.data) {
                    setImages(updatedImages.data.data);
                    setFilteredImages(updatedImages.data.data); // Update filtered images
                }
            } else {
                console.error("❌ Upload failed or response malformed:", response.data);
            }
        } catch (error) {
            console.error("🔥 Error uploading images:", error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this image?");
        if (!confirmDelete) return;

        try {
            const response = await axios.delete(`${API_ENDPOINTS.deleteImage}/${imageId}`);
            if (response.status === 200) {
                setImages(images.filter(image => image.image_id !== imageId));
                setFilteredImages(filteredImages.filter(image => image.image_id !== imageId)); // Update filtered images
            } else {
                console.error("Failed to delete image:", response.data);
            }
        } catch (error) {
            console.error("Error deleting image:", error);
        }
    };

    return (
        <section className="px-8">
            <ImageHeader onSearch={handleSearch} />

            {/* Upload Button */}
            <div className="mb-5">
                <label
                    className={`cursor-pointer px-4 py-3 rounded-lg ${
                        isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    <i className="ti ti-photo-up text-xl text-white mr-2"></i>
                    {isUploading ? "Uploading..." : "Upload Images"}
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                    />
                </label>
                <span className='ml-2 text-gray-600'>{selectedImageName}</span>
            </div>

            {/* Image Library Grid */}
            <div className="border-2 rounded-lg overflow-y-auto h-screen p-4 mb-6">
                {filteredImages.length === 0 ? (
                    <p className="text-gray-500 text-center">No images uploaded.</p>
                ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredImages.map((image) => (
                            <div
                                key={image.image_id}
                                className="relative flex items-center justify-center border rounded-lg"
                            >
                                <img
                                    src={image.image_url}
                                    alt={image.img}
                                    className="mx-auto my-auto object-contain max-h-40 cursor-pointer"
                                    onClick={() => setSelectedImageName(image.img)}
                                />
                                <button
                                    className="h-8 w-8 absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-100 hover:opacity-100 transition"
                                    onClick={() => handleDeleteImage(image.image_id)}
                                >
                                    <i className="ti ti-x text-xl text-white"></i>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

export default ImageBody