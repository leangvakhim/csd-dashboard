import { forwardRef, useImperativeHandle, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import MediaLibraryModal from '../../MediaLibraryModal';
import axios from "axios";
import { API, API_ENDPOINTS } from "../../../service/APIConfig";

const CarouselPieceSlider = forwardRef(({displaySlideshow}, ref) => {
    const [isRotatedButton1, setIsRotatedButton1] = useState(false);
    const [isRotatedButton2, setIsRotatedButton2] = useState(false);
    const [currentSliderId, setCurrentSliderId] = useState(null);
    const [currentField, setCurrentField] = useState(null);
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [rotatedStates, setRotatedStates] = useState({});
    const [slider, setSlider] = useState([
        {
            id: "1",
            title: "Slider 1",
            subtitle: "",
            logo: "",
            image: "",
            firstbtntitle: "Button 1",
            firstbtnselect: "",
            secondbtntitle: "Button 2",
            secondbtnselect: ""
        },
    ]);

    useEffect(() => {
        const fetchSliders = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getSlideshow);
                const rawData = response.data?.data || [];
                const formattedData = rawData.map(item => ({
                    id: item.slider_id.toString(),
                    title: item.slider_title || '',
                    subtitle: item.slider_text || '',
                    logo: item.logo?.img ? `${API}/storage/uploads/${item.logo.img}` : '',
                    image: item.img?.img ? `${API}/storage/uploads/${item.img.img}` : '',
                    firstbtntitle: item.btn1?.bss_title || '',
                    firstbtnselect: item.btn1?.bss_routepage || '',
                    secondbtntitle: item.btn2?.bss_title || '',
                    secondbtnselect: item.btn2?.bss_routepage || '',
                    bss_id_btn1: item.btn1?.bss_id || 0,
                    bss_id_btn2: item.btn2?.bss_id || 0,
                    display: item.display === 1,
                    firstbtndisplay: item.btn1?.display === 1,
                    secondbtndisplay: item.btn2?.display === 1
                }));
                setSlider(formattedData);
            } catch (error) {
                console.error('Error fetching sliders:', error);
            }
        };

        fetchSliders();
    }, []);

    // useEffect(() => {
    //    console.log("📦 Current Slider Data:", slider);
    // }, [slider]);

    useImperativeHandle(ref, () => ({
        getSliders: async () => {
            return await Promise.all(slider.map(async item => {
                let btn1Id = item.bss_id_btn1 || 0;
                let btn2Id = item.bss_id_btn2 || 0;

                // btn1
                try {
                    if (btn1Id) {
                        await axios.post(`${API_ENDPOINTS.updateBtnss}/${btn1Id}`, {
                            bss_title: item.firstbtntitle || '',
                            bss_routepage: item.firstbtnselect || '',
                            display: item.firstbtndisplay ? 1 : 0,
                        });
                    } else {
                        const res1 = await axios.post(API_ENDPOINTS.createBtnss, {
                            bss_title: item.firstbtntitle || '',
                            bss_routepage: item.firstbtnselect || '',
                            display: item.firstbtndisplay ? 1 : 0,
                        });
                        btn1Id = res1.data?.data?.bss_id || null;
                    }
                } catch (error) {
                    console.error('btn1 error:', error);
                }

                // btn2
                try {
                    if (btn2Id) {
                        await axios.post(`${API_ENDPOINTS.updateBtnss}/${btn2Id}`, {
                            bss_title: item.secondbtntitle || '',
                            bss_routepage: item.secondbtnselect || '',
                            display: item.secondbtndisplay ? 1 : 0,
                        });
                    } else {
                        const res2 = await axios.post(API_ENDPOINTS.createBtnss, {
                            bss_title: item.secondbtntitle || '',
                            bss_routepage: item.secondbtnselect || '',
                            display: item.secondbtndisplay ? 1 : 0,
                        });
                        btn2Id = res2.data?.data?.bss_id || null;
                    }
                } catch (error) {
                    console.error('btn2 error:', error);
                }

                return {
                    slider_id: item.id,
                    slider_title: item.title || '',
                    slider_text: item.subtitle || '',
                    logo: item.logo ? await getImageIdByUrl(item.logo) : 0,
                    img: item.image ? await getImageIdByUrl(item.image) : 0,
                    btn1: btn1Id,
                    btn2: btn2Id,
                    display: item.display ? 1 : 0,
                    active: 1,
                    slider_sec: displaySlideshow || 0,
                }
            }))
        }
    }))

    const handleAddSlider = () => {
        const newSlider = {
            id: `${Date.now()}`,
            title: `Slider ${slider.length + 1}`,
            subtitle: "",
            logo: "",
            image: "",
            firstbtntitle: `Button 1`,
            firstbtnselect: "",
            secondbtntitle: `Button 2`,
            secondbtnselect: ""
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

    const openMediaLibrary = (sliderId, field) => {
        setCurrentSliderId(sliderId);
        setCurrentField(field);
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = (imageUrl, field) => {
        setSlider((prevSlider) =>
            prevSlider.map((item) => {
                if (item.id === currentSliderId) {
                    return {
                        ...item,
                        [currentField]: imageUrl || null,
                    };
                }
                return item;
            })
        );
        setMediaLibraryOpen(false);
    };

    const handleInputChange = (id, field, value) => {
        setSlider((prevSlider) =>
            prevSlider.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };

    const getImageIdByUrl = async (url) => {
        try {
            const response = await axios.get(API_ENDPOINTS.getImages);
            const images = Array.isArray(response.data) ? response.data : response.data.data;

            const matchedImage = images.find((img) => img.image_url === url);
            return matchedImage?.image_id || null;
            } catch (error) {
            console.error('❌ Failed to fetch image ID:', error);
            return null;
        }
    };

    const handleDeleteSlider = async (sliderId) => {
        if (!window.confirm("Are you sure you want to delete this slider?")) return;

        try {
            await axios.put(`${API_ENDPOINTS.deleteSlideshow}/${sliderId}`);
            setSlider((prevSlider) => prevSlider.filter((item) => item.id !== sliderId));
        } catch (error) {
            console.error('Failed to delete slider:', error);
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className='mx-4 my-1'>
                        <ul class="h-auto overflow-y-auto border rounded-t-lg mt-1">
                            {slider.map((sliders, index) => (
                                <Draggable
                                    key={sliders.id}
                                    draggableId={sliders.id}
                                    index={index}
                                    >
                                    {(provided) => (
                                        <li
                                            className={`below-border ${index === sliders.length - 1 ? 'border-none' : ''}`}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            >
                                            {/* Slider  */}
                                            <details className='group [&_summary::-webkit-details-marker]:hidden !border-b-1 '>
                                                <summary className='cursor-pointer flex justify-between rounded-lg px-2 py-2 pl-5 w-full '
                                                    onClick={() => toggleRotation(sliders.id)}
                                                    >
                                                    <div className="flex ">
                                                        <div className="cursor-grab my-auto"
                                                        {...provided.dragHandleProps}>
                                                            <svg class="cursor-grab size-5 my-auto" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                                                            </svg>
                                                        </div>
                                                        <span className="ml-2 text-lg">{sliders.title}</span>
                                                    </div>
                                                    <span className=' shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2'>
                                                        <div className='block'>
                                                            <svg
                                                                onClick={() => handleDeleteSlider(sliders.id)}
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth={1.5}
                                                                stroke="currentColor"
                                                                className="size-6 cursor-pointer"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                            </svg>
                                                        </div>
                                                        <span
                                                            className={`cursor-pointer shrink-0 transition-transform duration-300 ${
                                                                    rotatedStates[sliders.id] ? "" : "rotate-180"
                                                                    }`}
                                                            >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                                                            </svg>
                                                        </span>
                                                    </span>
                                                </summary>

                                                {/* title */}
                                                <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                    <div className="flex-1">
                                                        <label className=" block text-xl font-medium leading-6 text-white-900">
                                                        Title
                                                        </label>
                                                        <div className="mt-2">
                                                        <input
                                                            type="text"
                                                            value={sliders.title}
                                                            onChange={(e) => handleInputChange(sliders.id, 'title', e.target.value)}
                                                            className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                        />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Subtitle */}
                                                <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                    <div className="flex-1">
                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                            Subtitle
                                                        </label>
                                                        <div className="mt-2">
                                                            <textarea
                                                                value={sliders.subtitle}
                                                                onChange={(e) => handleInputChange(sliders.id, 'subtitle', e.target.value)}
                                                                className="!border-gray-300 h-32 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Image */}
                                                <div className="grid grid-cols-1 md:!grid-cols-2  gap-4 px-4 py-2">
                                                    <div className="flex-1">
                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                            Logo
                                                        </label>
                                                        <div className="flex items-center justify-center w-full mt-2 border-1">
                                                            <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                                {sliders.logo ? (
                                                                    <div>
                                                                        <img
                                                                            src={sliders.logo}
                                                                            alt="Selected"
                                                                            className="h-40 w-40 object-contain"
                                                                        />
                                                                        <div className="flex gap-3 mt-2 justify-center">
                                                                            <svg
                                                                                onClick={() => openMediaLibrary(sliders.id, "logo")}
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
                                                                                onClick={() => { setCurrentField("logo"); handleImageSelect("", "logo"); }}
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
                                                                        onClick={() => openMediaLibrary(sliders.id, "logo")}
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
                                                                            <span className="font-semibold">Click to upload logo</span>
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </label>
                                                        </div>
                                                    </div>
                                                    {isMediaLibraryOpen && (
                                                        <MediaLibraryModal
                                                            onSelect={handleImageSelect}
                                                            onClose={() => setMediaLibraryOpen(false)}
                                                        />
                                                    )}

                                                    <div className="flex-1">
                                                        <label className="block text-xl font-medium leading-6 text-white-900">
                                                            Photo
                                                        </label>
                                                        <div className="flex items-center justify-center w-full mt-2 border-1">
                                                            <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                                {sliders.image ? (
                                                                    <div>
                                                                        <img
                                                                            src={sliders.image}
                                                                            alt="Selected"
                                                                            className="h-40 w-40 object-contain"
                                                                        />
                                                                        <div className="flex gap-3 mt-2 justify-center">
                                                                            <svg
                                                                                onClick={() => openMediaLibrary(sliders.id, "image")}
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
                                                                                onClick={() => { setCurrentField("image"); handleImageSelect("", "image"); }}
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
                                                                        onClick={() => openMediaLibrary(sliders.id, "image")}
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
                                                            onSelect={handleImageSelect}
                                                            onClose={() => setMediaLibraryOpen(false)}
                                                        />
                                                    )}
                                                </div>
                                                {/* Button  */}
                                                <div className="grid grid-cols-1 sm:!grid-cols-2 gap-4 px-4 py-2">
                                                    {/* left side */}
                                                    <div className=" flex flex-col gap-2">
                                                        {/* Button 1 */}
                                                        <details className=" group [&_summary::-webkit-details-marker]:hidden border-2 rounded-lg grid-cols-1">
                                                            <summary
                                                                className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                                                            >
                                                                <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton1(!isRotatedButton1)}>
                                                                    <span className=" text-xl font-medium">
                                                                        {sliders.firstbtntitle}
                                                                    </span>
                                                                    <div className={`cursor-pointer shrink-0 transition-transform duration-300 ${isRotatedButton1 ? 'rotate-180' : ''}`}>
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
                                                                    </div>
                                                                </div>
                                                            </summary>
                                                            {/* button 1 */}
                                                            <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                                <div className="flex-1">
                                                                    <label className=" block text-lg font-medium leading-6 text-white-900">
                                                                    button1 name
                                                                    </label>
                                                                    <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        value={sliders.firstbtntitle}
                                                                        onChange={(e) => handleInputChange(sliders.id, 'firstbtntitle', e.target.value)}
                                                                        className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                                    />
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <label for="countries" className="block text-lg font-medium leading-6 text-white-900">
                                                                        Select page option
                                                                    </label>
                                                                    <select
                                                                        className="mt-2 !border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                                        value={sliders.firstbtnselect}
                                                                        onChange={(e) => handleInputChange(sliders.id, 'firstbtnselect', e.target.value)}
                                                                    >
                                                                        <option value="">Choose a page</option>
                                                                        <option value="Home">Home</option>
                                                                        <option value="About">About</option>
                                                                        <option value="Contact">Contact</option>
                                                                        <option value="Program">Program</option>
                                                                    </select>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="block text-xl font-medium leading-6 text-white-900">
                                                                    Display
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <label className="toggle-switch mt-2">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={sliders.firstbtndisplay || false}
                                                                            onChange={(e) => handleInputChange(sliders.id, 'firstbtndisplay', e.target.checked)}
                                                                        />
                                                                            <span className="slider"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </details>
                                                        {/* button 2 */}
                                                        <details className=" group [&_summary::-webkit-details-marker]:hidden border-2 rounded-lg grid-cols-1">
                                                            <summary
                                                                className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                                                            >
                                                                <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton2(!isRotatedButton2)}>
                                                                    <span className=" text-xl font-medium">
                                                                        {sliders.secondbtntitle}
                                                                    </span>
                                                                    <div className={`cursor-pointer shrink-0 transition-transform duration-300 ${isRotatedButton2 ? 'rotate-180' : ''}`}>
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
                                                            </summary>
                                                            {/* button 2 */}
                                                            <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                                <div className="flex-1">
                                                                    <label className=" block text-lg font-medium leading-6 text-white-900">
                                                                    button2 name
                                                                    </label>
                                                                    <div className="mt-2">
                                                                    <input
                                                                        type="text"
                                                                        value={sliders.secondbtntitle}
                                                                        onChange={(e) => handleInputChange(sliders.id, 'secondbtntitle', e.target.value)}
                                                                        className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                                    />
                                                                    </div>
                                                                </div>

                                                                <div className="flex-1">
                                                                    <label for="countries" class="block text-lg font-medium leading-6 text-white-900">
                                                                        Select page option
                                                                    </label>
                                                                    <select
                                                                        className="mt-2 !border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                                                        value={sliders.secondbtnselect}
                                                                        onChange={(e) => handleInputChange(sliders.id, 'secondbtnselect', e.target.value)}
                                                                    >
                                                                        <option value="">Choose a page</option>
                                                                        <option value="Home">Home</option>
                                                                        <option value="About">About</option>
                                                                        <option value="Contact">Contact</option>
                                                                        <option value="Program">Program</option>
                                                                    </select>
                                                                </div>
                                                                <div className="flex-1">
                                                                    <label className="block text-xl font-medium leading-6 text-white-900">
                                                                    Display
                                                                    </label>
                                                                    <div className="mt-2">
                                                                        <label class="toggle-switch mt-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={sliders.secondbtndisplay || false}
                                                                                onChange={(e) => handleInputChange(sliders.id, 'secondbtndisplay', e.target.checked)}
                                                                            />
                                                                            <span class="slider"></span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </details>
                                                    </div>
                                                    {/* right side */}
                                                    <div>
                                                        <div className="grid grid-cols-1 gap-4 px-4 py-2">
                                                            <div className="flex flex-row items-center w-full gap-4">
                                                                <label className="block text-xl font-medium leading-6 text-white-900">
                                                                    Display
                                                                </label>
                                                                <div className="mt-2">
                                                                    <label className="toggle-switch mb-1">
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={sliders.display || false}
                                                                            onChange={(e) => handleInputChange(sliders.id, 'display', e.target.checked)}
                                                                        />
                                                                        <span className="slider"></span>
                                                                    </label>
                                                                </div>
                                                            </div>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 mr-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            Add new slider
                        </a>
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    )
});

export default CarouselPieceSlider