import React, { useState } from "react";
import MediaLibraryModal from "../../MediaLibraryModal";


const UnlockPiece = () => {
    const [isRotatedButton1, setIsRotatedButton1] = useState(false);
    const [redirectpage, setRedirectpage] = useState("")
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");


    const openMediaLibrary = () => {
        // setCurrentField(field);
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = (imageUrl, field) => {
        if (field === "image") {
            setSelectedImage(imageUrl ? `${imageUrl}` : "");
        }
        setMediaLibraryOpen(false);
    };


    return (
        <div className="grid grid-cols-1 gap-4 ">
            <details className="group [&_summary::-webkit-details-marker]:hidden rounded-lg">
                <summary
                    className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                >
                    <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton1(!isRotatedButton1)}>
                        <div className="flex gap-1 items-center">
                            <svg class="cursor-grab size-5 my-auto" viewBox="0 0 320 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
                            </svg>
                            <span className=" text-xl font-medium">
                                Unlock
                            </span>
                        </div>
                        <div className="flex gap-1">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6 cursor-pointer"


                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                            <div className={`cursor-pointer shrink-0 transition-transform duration-300 ${isRotatedButton1 ? 'rotate-180' : ''}`}>
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
                {/* Row 1 */}
                <div className="flex flex-row gap-4 px-4 py-2">
                    <div className="flex-1">
                        <label className="block text-xl font-medium leading-6 text-white-900">
                            Title
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="flex-non">
                        <label className="block text-xl font-medium leading-6 text-white-900">
                            Display
                        </label>
                        <div className="mt-2">
                            <label class="toggle-switch mt-2">
                                <input type="checkbox" />
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                {/* Row 2 */}
                <div className="flex-1 w-full px-4 py-2">
                    <label className="block text-xl font-medium leading-6 text-white-900">
                        Details
                    </label>
                    <div className="mt-2">
                        <textarea className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                    </div>
                </div>
                {/* Row 3 */}
                <div className="w-full px-4 py-2">
                    <div className="grid grid-cols-1 md:!grid-cols-2 py-2 gap-4">
                        <div className="">
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


                        <div className=" w-full flex flex-col sm:flex-row items-center">
                            <div className="w-full">
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                Button Title
                                </label>
                                <div className="mt-2">
                                    <input
                                        type="text"
                                        className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                    />
                                </div>
                            </div>
                            <div className="mt-4 w-full">
                                <label className="block text-xl font-medium text-gray-700">Redirect page</label>
                                <select
                                    value={redirectpage}
                                    onChange={(e) => setRedirectpage(e.target.value)}
                                    className="mt-2 block w-full border !border-gray-300 rounded-md py-2 pl-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Choose Option</option>
                                    <option value="yes">Home Page</option>
                                    <option value="no">About Page</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </details >
        </div >
    )
}

export default UnlockPiece