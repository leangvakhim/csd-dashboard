import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { API_ENDPOINTS, API, axiosInstance } from "../../service/APIConfig";
import MediaLibraryModal from "../MediaLibraryModal";

const SettingFieldBodyInfo = forwardRef(({}, ref) => {
  const [activeTab, setActiveTab] = useState(1);
  const [isRotatedButton1, setIsRotatedButton1] = useState(false);
  const [isRotatedButton2, setIsRotatedButton2] = useState(false);
  const [isRotatedButton3, setIsRotatedButton3] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedImage1, setSelectedImage1] = useState("");
  const [selectedImage2, setSelectedImage2] = useState("");
  const [selectedImage3, setSelectedImage3] = useState("");
  const [c1Id, setC1Id] = useState(0);
  const [c2Id, setC2Id] = useState(0);
  const [c3Id, setC3Id] = useState(0);
  const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [title, setTitle] = useState(null);
  const [firsttitle, setFirstTitle] = useState(null);
  const [secondtitle, setSecondTitle] = useState(null);
  const [thirdtitle, setThirdTitle] = useState(null);
  const [firstsubtitle, setFirstsubtitle] = useState(null);
  const [secondsubtitle, setSecondsubtitle] = useState(null);
  const [thirdsubtitle, setThirdsubtitle] = useState(null);
  const [subtitle, setSubtitle] = useState(null);
  const [lang, setLang] = useState(1);
  const openMediaLibrary = () => {
    setMediaLibraryOpen(true);
  };

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getContactByLang}/${activeTab}`);
        const data = response.data?.data;
        if (data) {
          setLang(data.lang || 1);
          setTitle(data.con_title || '');
          setSubtitle(data.con_subtitle || '');
          setSelectedImage(data.con_img ? `${API}/storage/uploads/${data.image.img}` : '');
          setC1Id(data.con_addon || 0);
          setFirstTitle(data.subcontact1.scon_title || '');
          setFirstsubtitle(data.subcontact1.scon_detail || '');
          setSelectedImage1(data.subcontact1.scon_img ? `${API}/storage/uploads/${data.subcontact1.image.img}` : '');
          setC2Id(data.con_addon2 || 0);
          setSecondTitle(data.subcontact2.scon_title || '');
          setSecondsubtitle(data.subcontact2.scon_detail || '');
          setSelectedImage2(data.subcontact2.scon_img ? `${API}/storage/uploads/${data.subcontact2.image.img}` : '');
          setC3Id(data.con_addon3 || 0);
          setThirdTitle(data.subcontact3.scon_title || '');
          setThirdsubtitle(data.subcontact3.scon_detail || '');
          setSelectedImage3(data.subcontact3.scon_img ? `${API}/storage/uploads/${data.subcontact3.image.img}` : '');
        }
      } catch (error) {
        console.error('❌ Failed to fetch contact university info:', error);
      }
    };

    fetchContactData();
  }, []);

  const handleImageSelect = (imageUrl, field) => {
    if (field === "image") {
      setSelectedImage(imageUrl ? `${imageUrl}` : "");
    }else if (field === "image1") {
      setSelectedImage1(imageUrl ? `${imageUrl}` : "");
    } else if (field === "image2") {
      setSelectedImage2(imageUrl ? `${imageUrl}` : "");
    } else if (field === "image3") {
      setSelectedImage3(imageUrl ? `${imageUrl}` : "");
    }
    setMediaLibraryOpen(false);
  };

  useImperativeHandle(ref, () => ({
    getUniversityContacts: async () => {
      let currentC1Id = c1Id;
      let currentC2Id = c2Id;
      let currentC3Id = c3Id;

      try {
        if (currentC1Id) {
          await axiosInstance.post(`${API_ENDPOINTS.updateSubContact}/${c1Id}`, {
            scon_title: firsttitle || null,
            scon_detail: firstsubtitle || null,
            scon_img: selectedImage1 ? await getImageIdByUrl(selectedImage1) : null,
          });
        } else {
          const res1 = await axiosInstance.post(API_ENDPOINTS.createSubContact, {
            scon_title: firsttitle || null,
            scon_detail: firstsubtitle || null,
            scon_img: selectedImage1 ? await getImageIdByUrl(selectedImage1) : null,
          });
          const newC1Id = res1.data?.data?.scon_id || 0;
          setC1Id(newC1Id);
          currentC1Id = newC1Id;
        }

        if (currentC2Id) {
          await axiosInstance.post(`${API_ENDPOINTS.updateSubContact}/${c2Id}`, {
            scon_title: secondtitle || null,
            scon_detail: secondsubtitle || null,
            scon_img: selectedImage2 ? await getImageIdByUrl(selectedImage2) : null,
          });
        } else {
          const res2 = await axiosInstance.post(API_ENDPOINTS.createSubContact, {
            scon_title: secondtitle || null,
            scon_detail: secondsubtitle || null,
            scon_img: selectedImage2 ? await getImageIdByUrl(selectedImage2) : null,
          });
          const newC2Id = res2.data?.data?.scon_id || 0;
          setC2Id(newC2Id);
          currentC2Id = newC2Id;
        }

        if (currentC3Id) {
          await axiosInstance.post(`${API_ENDPOINTS.updateSubContact}/${c3Id}`, {
            scon_title: thirdtitle || null,
            scon_detail: thirdsubtitle || null,
            scon_img: selectedImage3 ? await getImageIdByUrl(selectedImage3) : null,
          });
        } else {
          const res3 = await axiosInstance.post(API_ENDPOINTS.createSubContact, {
            scon_title: thirdtitle || null,
            scon_detail: thirdsubtitle || null,
            scon_img: selectedImage3 ? await getImageIdByUrl(selectedImage3) : null,
          });
          const newC3Id = res3.data?.data?.scon_id || 0;
          setC3Id(newC3Id);
          currentC3Id = newC3Id;
        }
      } catch (error) {
        console.error('❌ Error saving subcontacts:', error);
      }

      const data = {
        con_title: title || null,
        con_subtitle: subtitle || null,
        con_img: selectedImage ? await getImageIdByUrl(selectedImage) : null,
        con_addon: currentC1Id || null,
        con_addon2: currentC2Id || null,
        con_addon3: currentC3Id || null,
        lang: lang,
      }

      return data;
    }
  }));

  const getImageIdByUrl = async (url) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.getImages);
      const images = Array.isArray(response.data) ? response.data : response.data.data;

      const matchedImage = images.find((img) => img.image_url === url);
      return matchedImage?.image_id || null;
    } catch (error) {
      console.error('❌ Failed to fetch image ID:', error);
      return null;
    }
  };

  const resetContactForm = () => {
    setC1Id(0);
    setC2Id(0);
    setC3Id(0);
    setTitle('');
    setSubtitle('');
    setSelectedImage('');
    setFirstTitle('');
    setFirstsubtitle('');
    setSelectedImage1('');
    setSecondTitle('');
    setSecondsubtitle('');
    setSelectedImage2('');
    setThirdTitle('');
    setThirdsubtitle('');
    setSelectedImage3('');
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
                  className={`cursor-pointer mx-2 inline-block py-1.5 px-6 text-gray-600 hover:text-gray-800 font-medium ${
                    activeTab === langOption.id
                      ? "bg-white rounded-lg text-gray-600"
                      : "tablink"
                  } whitespace-nowrap`}
                  onClick={async () => {
                    setActiveTab(langOption.id);
                    setLang(Number(langOption.id));
                    try {
                      const response = await axiosInstance.get(`${API_ENDPOINTS.getContactByLang}/${langOption.id}`);
                      const data = response.data?.data;
                      if (data) {
                        setC1Id(data.con_addon || 0);
                        setC2Id(data.con_addon2 || 0);
                        setC3Id(data.con_addon3 || 0);
                        setTitle(data.con_title || '');
                        setSubtitle(data.con_subtitle || '');
                        setSelectedImage(data.con_img ? `${API}/storage/uploads/${data.image.img}` : '');
                        setFirstTitle(data.subcontact1?.scon_title || '');
                        setFirstsubtitle(data.subcontact1?.scon_detail || '');
                        setSelectedImage1(data.subcontact1?.scon_img ? `${API}/storage/uploads/${data.subcontact1.image.img}` : '');
                        setSecondTitle(data.subcontact2?.scon_title || '');
                        setSecondsubtitle(data.subcontact2?.scon_detail || '');
                        setSelectedImage2(data.subcontact2?.scon_img ? `${API}/storage/uploads/${data.subcontact2.image.img}` : '');
                        setThirdTitle(data.subcontact3?.scon_title || '');
                        setThirdsubtitle(data.subcontact3?.scon_detail || '');
                        setSelectedImage3(data.subcontact3?.scon_img ? `${API}/storage/uploads/${data.subcontact3.image.img}` : '');
                      } else {
                        resetContactForm();
                      }
                    } catch (error) {
                      console.error('❌ Failed to fetch contact university info:', error);
                      resetContactForm();
                    }
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
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
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
                            value={firsttitle}
                            onChange={(e) => setFirstTitle(e.target.value)}
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
                          value={firstsubtitle}
                          onChange={(e) => setFirstsubtitle(e.target.value)}
                          className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Image
                      </label>
                      <div className="flex items-center justify-center w-full mt-2 border-1">
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
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
              {/* Phone number */}
              <details className=" group [&_summary::-webkit-details-marker]:hidden border-2 rounded-lg grid-cols-1">
                  <summary
                      className="cursor-pointer flex justify-between rounded-lg py-2 w-full "
                  >
                      <div className="cursor-pointer flex items-center justify-between w-full px-4" onClick={() => setIsRotatedButton2(!isRotatedButton2)}>
                          <span className=" text-xl font-medium">
                            Phone number
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
                            value={secondtitle}
                            onChange={(e) => setSecondTitle(e.target.value)}
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
                          value={secondsubtitle}
                          onChange={(e) => setSecondsubtitle(e.target.value)}
                          className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Image
                      </label>
                      <div className="flex items-center justify-center w-full mt-2 border-1">
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {selectedImage2 ? (
                            <div>
                              <img
                                src={selectedImage2}
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
                            value={thirdtitle}
                            onChange={(e) => setThirdTitle(e.target.value)}
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
                          value={thirdsubtitle}
                          onChange={(e) => setThirdsubtitle(e.target.value)}
                          className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                      </div>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xl font-medium leading-6 text-white-900">
                        Image
                      </label>
                      <div className="flex items-center justify-center w-full mt-2 border-1">
                        <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          {selectedImage3 ? (
                            <div>
                              <img
                                src={selectedImage3}
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
});

export default SettingFieldBodyInfo;
