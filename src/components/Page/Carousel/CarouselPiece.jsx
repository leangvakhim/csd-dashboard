import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import CarouselPieceSlider from "./CarouselPieceSlider";
import { API_ENDPOINTS, axiosInstance } from "../../../service/APIConfig";
import Swal from 'sweetalert2';

const CarouselPiece = forwardRef(({sectionId, pageId, handleSectionRef}, ref) => {
    const [isRotatedButton, setIsRotatedButton] = useState(false);
    const [displaySlideshow, setDisplaySlideshow] = useState(0);
    const carouselSliderRef = useRef();

    useImperativeHandle(ref, () => ({
        getSlideshows: async () => {
            const slidersData = await carouselSliderRef.current?.getSliders?.() || [];

            return {
                slideshows: Array.isArray(slidersData) ? slidersData : [],
                sectionId: sectionId || null,
                pageId: pageId || null
            };
        }
    }));

    const handleToggleDisplay = async () => {
        try {
            const newDisplay = displaySlideshow === 1 ? 0 : 1;
            await axiosInstance.post(`${API_ENDPOINTS.updateSection}/${sectionId}`, {
                sec_id: sectionId,
                display: newDisplay,
            });
            setDisplaySlideshow(newDisplay);
        } catch (error) {
            console.error("Failed to update display:", error);
        }
    };

    const handleDeleteSection = async () => {
        const result = await Swal.fire({
            title: 'Are you sure ?',
            text: 'This action will delete the section permanently.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: {
                confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 !mr-2',
                cancelButton: '!bg-red-600 hover:!bg-red-700 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:!ring-red-400'
            },
        });

        if (result.isConfirmed) {
            try {
                await axiosInstance.put(`${API_ENDPOINTS.deleteSection}/${sectionId}`);
                await Swal.fire({
                    icon: 'success',
                    title: 'Deleted!',
                    text: 'The section has been deleted.',
                    timer: 1000,
                    showConfirmButton: false,
                });
                window.location.reload();
            } catch (error) {
                console.error('Failed to delete section:', error);
                await Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Something went wrong while deleting.',
                timer: 1000,
                showConfirmButton: false,
                });
            }
        }
    };

    useEffect(() => {
        const fetchSlideShowDisplay = async () => {
            try {
                const sectionRes = await axiosInstance.get(`${API_ENDPOINTS.getSection}/${sectionId}`);
                const sectionData = sectionRes.data.data;
                setDisplaySlideshow(sectionData.display || 0);
            } catch (error) {
                console.error("Failed to fetch carousel:", error);
            }
        };

        if(sectionId && pageId){
            fetchSlideShowDisplay();
        }
    }, [sectionId]);

    return (
        <div className="grid grid-cols-1 gap-4 ">
            <details className="group [&_summary::-webkit-details-marker]:hidden rounded-lg">
                <summary
                    className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                >
                    <div className="cursor-pointer flex items-center justify-between w-full px-4"
                        onClick={() => setIsRotatedButton(!isRotatedButton)}
                        >
                        <div className="flex gap-1 items-center" ref={handleSectionRef}>
                            <svg class="cursor-grab size-5 my-auto" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                            </svg>
                            <span className=" text-xl font-medium">
                                SlideShow
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <svg
                                onClick={() => handleDeleteSection()}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 cursor-pointer"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <div className={`cursor-pointer shrink-0 transition-transform duration-300
                                    ${isRotatedButton ? 'rotate-180' : ''}`}
                                >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    class="size-6"
                                >
                                    <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </summary>

                <CarouselPieceSlider
                    ref={carouselSliderRef}
                    displaySlideshow={displaySlideshow}
                    sectionId={sectionId}
                    pageId={pageId}
                />

                <div className="flex flex-row items-center w-full gap-4 mx-6 my-1">
                    <label className="block text-xl font-medium leading-6 text-white-900">
                        Display
                    </label>
                    <div className="mt-2">
                        <label className="toggle-switch mb-1">
                            <input
                                type="checkbox"
                                checked={displaySlideshow === 1}
                                onChange={handleToggleDisplay}
                            />
                            <span className="slider"></span>
                        </label>
                    </div>
                </div>
            </details>
        </div>
    );
});

export default CarouselPiece;