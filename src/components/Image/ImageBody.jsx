import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import ImageHeader from './ImageHeader';
import Swal from 'sweetalert2';

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
            formData.append("img[]", file);
        }

        try {
            setIsUploading(true);

            Swal.fire({
                title: 'Uploading images...',
                allowOutsideClick: false,
                backdrop: true,
                buttonsStyling: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-gray-700',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mt-4'
                }
            });

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

            Swal.fire({
                icon: 'success',
                title: 'Uploaded!',
                text: 'Images uploaded successfully.',
                timer: 1500,
                showConfirmButton: false,
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-green-600'
                }
            });
        } catch (error) {
            console.error("🔥 Error uploading images:", error);
            Swal.fire({
                icon: 'error',
                title: 'Upload Failed',
                text: 'An error occurred while uploading images.',
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-red-600'
                }
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async (imageId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'Do you want to delete this image?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            reverseButtons: true,
            buttonsStyling: false,
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded !ml-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded',
            }
        });

        if (!result.isConfirmed) return;

        try {
            const response = await axios.delete(`${API_ENDPOINTS.deleteImage}/${imageId}`);
            if (response.status === 200) {
                setImages(images.filter(image => image.image_id !== imageId));
                setFilteredImages(filteredImages.filter(image => image.image_id !== imageId));
                Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The image has been deleted.',
                    timer: 1500,
                    showConfirmButton: true,
                });
            } else {
                console.error("Failed to delete image:", response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to delete the image.'
                });
            }
        } catch (error) {
            console.error("Error deleting image:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while deleting the image.'
            });
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
                                    onClick={async () => {
                                        Swal.fire({
                                            title: 'Loading image...',
                                            allowOutsideClick: false,
                                            showConfirmButton: false,
                                            backdrop: true,
                                            didOpen: () => {
                                                Swal.showLoading();
                                            },
                                            customClass: {
                                                popup: 'bg-white rounded-lg shadow-lg',
                                                title: 'text-lg font-semibold text-gray-700',
                                            }
                                        });

                                        await new Promise(resolve => setTimeout(resolve, 300));

                                        setSelectedImageName(image.img);

                                        Swal.close();
                                    }}
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