import React, { useState, lazy, Suspense } from "react";
import { API_ENDPOINTS } from "../../service/APIConfig";
import MediaLibraryModal from "../MediaLibraryModal";

const SettingFieldBodyInfo = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [isRotatedButton1, setIsRotatedButton1] = useState(false);
  const [isRotatedButton2, setIsRotatedButton2] = useState(false);
  const [isRotatedButton3, setIsRotatedButton3] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const openMediaLibrary = () => {
    setMediaLibraryOpen(true);
  };

  const handleImageSelect = (imageUrl, field) => {
    if (field === "image") {
      setSelectedImage(imageUrl ? `${imageUrl}` : "");
    }else if (field === "image1") {
      setSelectedImage(imageUrl ? `${imageUrl}` : "");
    } else if (field === "image2") {
      setSelectedImage(imageUrl ? `${imageUrl}` : "");
    } else if (field === "image3") {
      setSelectedImage(imageUrl ? `${imageUrl}` : "");
    }
    setMediaLibraryOpen(false);
  };

  return (
    <div className="px-8 py-2 mb-1">
      <div className="tabs">
        <div className="flex">
          <ul className="flex items-center h-12 bg-gray-100 rounded-lg transition-all duration-300 p-2 overflow-hidden">
            {[
              { id: 1, label: "English" },
              { id: 2, label: "Khmer" },
            ].map((langOption) => (
              <li key={langOption.id}>
                <a
                  href="javascript:void(0)"
                  className={`mx-2 inline-block py-1.5 px-6 text-gray-600 hover:text-gray-800 font-medium ${
                    activeTab === langOption.id
                      ? "bg-white rounded-lg text-gray-600"
                      : "tablink"
                  } whitespace-nowrap`}
                  onClick={() => {
                    setActiveTab(langOption.id);
                    setFormData((prev) => ({ ...prev, lang: langOption.id }));
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
          <div className="flex sm:!flex-row flex-col gap-4 items-center ">
            <div className="flex-1 w-full">
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
          </div>

          <div className="grid grid-cols-1 md:!grid-cols-2 gap-4 py-2 mb-1">
            <div className="flex-1">
              <label className="block text-xl font-medium leading-6 text-white-900">
                Subtitle
              </label>
              <div className="mt-2">
                <textarea
                  className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
              </div>
          </div>

          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Image
            </label>
            <div className="flex items-center justify-center w-full mt-2 border-1">
              <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
                      <span className="font-semibold">
                        Click to upload image
                      </span>
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
        </div>
          {/* Button 1 */}
          <div className="grid grid-cols-1 gap-4 py-2">
              {/* Location 1 */}
              <details className=" group [&_summary::-webkit-details-marker]:hidden border-2 rounded-lg grid-cols-1">
                  <summary
                      className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                  >
                      <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton1(!isRotatedButton1)}>
                          <span className=" text-xl font-medium">
                            Location
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
                  {/* first row */}
                  <div className="grid grid-cols-1 gap-4 px-4 py-2">
                    <div className="flex-1">
                        <label className=" block text-lg font-medium leading-6 text-white-900">
                        title
                        </label>
                        <div className="mt-2">
                        <input
                            type="text"
                            className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                        />
                        </div>
                    </div>
                  </div>
                    {/* second row */}
                  <div className="grid grid-cols-1 md:!grid-cols-2 gap-4 px-4 py-2 mb-1">
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Subtitle
                      </label>
                      <div className="mt-2">
                        <textarea
                          // value={afSubTitle}
                          // onChange={(e) => setAfSubTitle(e.target.value)}
                          className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Image
                      </label>
                      <div className="flex items-center justify-center w-full mt-2 border-1">
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {selectedImage ? (
                            <div>
                              <img
                                src={selectedImage}
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
                    {isMediaLibraryOpen && (
                      <MediaLibraryModal
                        onSelect={(imageUrl) => handleImageSelect(imageUrl, "image1")}
                        onClose={() => setMediaLibraryOpen(false)}
                      />
                    )}
                  </div>
              </details>
          </div>
          {/* Button 2 */}
          <div className="grid grid-cols-1 gap-4 py-2">
              {/* Location */}
              <details className=" group [&_summary::-webkit-details-marker]:hidden border-2 rounded-lg grid-cols-1">
                  <summary
                      className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                  >
                      <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton2(!isRotatedButton2)}>
                          <span className=" text-xl font-medium">
                            Address
                          </span>
                          <div className={`cursor-pointer shrink-0 transition-transform duration-300 ${isRotatedButton2 ? 'rotate-180' : ''}`}>
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
                  {/* first row */}
                  <div className="grid grid-cols-1 gap-4 px-4 py-2">
                    <div className="flex-1">
                        <label className=" block text-lg font-medium leading-6 text-white-900">
                        title
                        </label>
                        <div className="mt-2">
                        <input
                            type="text"
                            className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                        />
                        </div>
                    </div>
                  </div>
                    {/* second row */}
                  <div className="grid grid-cols-1 md:!grid-cols-2 gap-4 px-4 py-2 mb-1">
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Subtitle
                      </label>
                      <div className="mt-2">
                        <textarea
                          // value={afSubTitle}
                          // onChange={(e) => setAfSubTitle(e.target.value)}
                          className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Image
                      </label>
                      <div className="flex items-center justify-center w-full mt-2 border-1">
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {selectedImage ? (
                            <div>
                              <img
                                src={selectedImage}
                                alt="Selected"
                                className="h-40 w-40 object-contain"
                              />
                              <div className="flex gap-3 mt-2 justify-center">
                                <svg
                                  onClick={() => openMediaLibrary("image2")}
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
                                  onClick={() => handleImageSelect("", "image2")}
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
                              onClick={() => openMediaLibrary("image2")}
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
                    {isMediaLibraryOpen && (
                      <MediaLibraryModal
                        onSelect={(imageUrl) => handleImageSelect(imageUrl, "image2")}
                        onClose={() => setMediaLibraryOpen(false)}
                      />
                    )}
                  </div>
              </details>
          </div>
          {/* Button 3 */}
          <div className="grid grid-cols-1 gap-4 py-2">
              <details className=" group [&_summary::-webkit-details-marker]:hidden border-2 rounded-lg grid-cols-1">
                  <summary
                      className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                  >
                      <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton3(!isRotatedButton3)}>
                          <span className=" text-xl font-medium">
                            Email
                          </span>
                          <div className={`cursor-pointer shrink-0 transition-transform duration-300 ${isRotatedButton3 ? 'rotate-180' : ''}`}>
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
                  {/* first row */}
                  <div className="grid grid-cols-1 gap-4 px-4 py-2">
                    <div className="flex-1">
                        <label className=" block text-lg font-medium leading-6 text-white-900">
                        title
                        </label>
                        <div className="mt-2">
                        <input
                            type="text"
                            className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                        />
                        </div>
                    </div>
                  </div>
                    {/* second row */}
                  <div className="grid grid-cols-1 md:!grid-cols-2 gap-4 px-4 py-2 mb-1">
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Subtitle
                      </label>
                      <div className="mt-2">
                        <textarea
                          // value={afSubTitle}
                          // onChange={(e) => setAfSubTitle(e.target.value)}
                          className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Image
                      </label>
                      <div className="flex items-center justify-center w-full mt-2 border-1">
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {selectedImage ? (
                            <div>
                              <img
                                src={selectedImage}
                                alt="Selected"
                                className="h-40 w-40 object-contain"
                              />
                              <div className="flex gap-3 mt-2 justify-center">
                                <svg
                                  onClick={() => openMediaLibrary("image3")}
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
                                  onClick={() => handleImageSelect("", "image3")}
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
                              onClick={() => openMediaLibrary("image3")}
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
                    {isMediaLibraryOpen && (
                      <MediaLibraryModal
                        onSelect={(imageUrl) => handleImageSelect(imageUrl, "image3")}
                        onClose={() => setMediaLibraryOpen(false)}
                      />
                    )}
                  </div>
              </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingFieldBodyInfo;
