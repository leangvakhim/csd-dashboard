import React, { useState, forwardRef, useImperativeHandle, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { API_ENDPOINTS, axiosInstance } from "../../../service/APIConfig";
import Swal from "sweetalert2";

const FuturePieceOne = forwardRef(({futureId}, ref) => {
    const [rotatedStates, setRotatedStates] = useState({});
    const [slider, setSlider] = useState([
        {
            id: "1",
            title: "future 1",
            subtitle: "",
            display: 0,
        },
    ]);

    const handleAddSlider = () => {
        const newSlider = {
            id: `temp-${slider.length + 1}`,
            title: `future ${slider.length + 1}`,
            subtitle: "",
            display: 0,
        };

        setSlider([...slider, newSlider]);
    };

    const toggleRotation = (id) => {
        setRotatedStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newSlider = Array.from(slider);
        const [reorderedSlider] = newSlider.splice(result.source.index, 1);
        newSlider.splice(result.destination.index, 0, reorderedSlider);

        setSlider(newSlider);
    };

    useImperativeHandle(ref, () => ({
        getSubFutureSliders: async () => {
            const updatedSliders = await Promise.all(
                slider.map(async (slide) => {
                    return {
                        ufa_title: slide.title,
                        ufa_subtitle: slide.subtitle,
                        display: slide.display ? 1 : 0,
                        ...(slide.id && !isNaN(Number(slide.id)) ? { ufa_id: Number(slide.id) } : {}),
                        ufa_uf: futureId,
                    };
                })
            );

            return updatedSliders;
        },
    }));

    useEffect(() => {
        const fetchSliders = async () => {
        try {
            const response = await axiosInstance.get(API_ENDPOINTS.getSubFuture);
            const data = response.data?.data;

            const subfutures = Array.isArray(data) ? data : [data];

            if (subfutures.length > 0 && futureId) {
            const validSubservices = subfutures.filter(item => item.ufa_uf === futureId);


            const formattedData = validSubservices.map(item => ({
                id: item.ufa_id.toString(),
                title: item.ufa_title || '',
                subtitle: item.ufa_subtitle || '',
                display: item.display === 1 || item.display === true,
            }));

            if (formattedData.length > 0) {
                setSlider(formattedData);
            } else {
                setSlider([{
                id: "1",
                title: "future 1",
                subtitle: "",
                display: 0
                }]);
            }
            }
        } catch (error) {
            console.error('Error fetching sliders:', error);
        }
        };

        fetchSliders();
    }, [futureId]);

    const handleDeleteSlider = async (sliderId) => {
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
            await axiosInstance.put(`${API_ENDPOINTS.deleteSubFuture}/${sliderId}`);
            setSlider((prevSlider) => prevSlider.filter((item) => item.id !== sliderId));
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

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="mx-4 my-1"
                    >
                        <ul class="h-auto overflow-y-auto border rounded-t-lg mt-1">
                            {slider.map((sliders, index) => (
                                <Draggable
                                    key={sliders.id}
                                    draggableId={sliders.id}
                                    index={index}
                                >
                                    {(provided) => (
                                        <li
                                            className={`below-border ${index === sliders.length - 1 ? "border-none" : ""
                                                }`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            {/* Slider  */}
                                            <details className="group [&_summary::-webkit-details-marker]:hidden !border-b-1 ">
                                                <summary
                                                    className="cursor-pointer flex justify-between rounded-lg px-2 py-2 pl-5 w-full "
                                                    onClick={() => toggleRotation(sliders.id)}
                                                >
                                                    <div className="flex ">
                                                        <div
                                                            className="cursor-grab my-auto"
                                                            {...provided.dragHandleProps}
                                                        >
                                                            <svg
                                                                class="cursor-grab size-5 my-auto"
                                                                viewBox="0 0 320 512"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="ml-2 text-lg">
                                                            {sliders.title}
                                                        </span>
                                                    </div>
                                                    <span className=" shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2">
                                                        <div className="block">
                                                            <svg
                                                                onClick={() => handleDeleteSlider(sliders.id)}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="size-6 cursor-pointer"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                                />
                                                            </svg>
                                                        </div>
                                                        <span
                                                            className={`cursor-pointer shrink-0 transition-transform duration-300 ${rotatedStates[sliders.id] ? "rotate-180" : ""
                                                                }`}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke-width="1.5"
                                                                stroke="currentColor"
                                                                className="size-6"
                                                            >
                                                                <path
                                                                    stroke-linecap="round"
                                                                    stroke-linejoin="round"
                                                                    d="m4.5 15.75 7.5-7.5 7.5 7.5"
                                                                />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                </summary>

                                                {/* title */}
                                                <div className="flex flex-row gap-4 px-4 py-2">
                                                    <div className="flex-1">
                                                        <label className=" block text-xl font-medium leading-6 text-white-900">
                                                            Title
                                                        </label>
                                                        <div className="mt-2">
                                                            <input
                                                                value={sliders.title}
                                                                onChange={(e) => {
                                                                    const updatedSlider = [...slider];
                                                                    updatedSlider[index].title = e.target.value;
                                                                    setSlider(updatedSlider);
                                                                }}
                                                                type="text"
                                                                className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex-non">
                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                            Display
                                                        </label>
                                                        <div className="mt-2">
                                                            <label class="toggle-switch mt-2">
                                                                <input
                                                                    checked={sliders.display}
                                                                    onChange={(e) => {
                                                                        const updatedSlider = [...slider];
                                                                        updatedSlider[index].display = e.target.checked;
                                                                        setSlider(updatedSlider);
                                                                    }}
                                                                    type="checkbox" />
                                                                <span class="slider"></span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Subtitle */}
                                                <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                    <div className="flex-1">
                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                            subtitle
                                                        </label>
                                                        <div className="mt-2">
                                                            <textarea
                                                                value={sliders.subtitle}
                                                                onChange={(e) => {
                                                                    const updatedSlider = [...slider];
                                                                    updatedSlider[index].subtitle = e.target.value;
                                                                    setSlider(updatedSlider);
                                                                }}
                                                                className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
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
                            className="flex items-center p-3 text-sm font-medium text-blue-600 !border-b !border-x rounded-b-lg bg-gray-50  hover:bg-gray-100  hover:underline"
                            onClick={handleAddSlider}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="size-6 mr-2"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                            Add new future
                        </a>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
});

export default FuturePieceOne;
