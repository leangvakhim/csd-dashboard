import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import MediaLibraryModal from "../../MediaLibraryModal";
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';
import { API_ENDPOINTS, API, axiosInstance } from "../../../service/APIConfig";
import Swal from "sweetalert2";

const config = {
  readonly: false,  // Set to true for read-only mode
  height: 400,
  uploader: {
    insertImageAsBase64URI: true,  // Enable base64 image upload
  },
};

const CriteriaPiece = forwardRef(({sectionId, pageId, handleSectionRef}, ref) => {
  const [isRotatedButton, setIsRotatedButton] = useState(false);
  const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [selectedImage1, setSelectedImage1] = useState("");
  const [selectedImage2, setSelectedImage2] = useState("");
  const [displayCriteria, setDisplayCriteria] = useState(0);
  const [detail, setDetail] = useState("");
  const [currentField, setCurrentField] = useState("");
  const [criteriaTitle, setCriteriaTitle] = useState("");
  const [criteriaTag, setCriteriaTag] = useState("");
  const [criteriaType, setCriteriaType] = useState(1);
  const [criteriaId, setCriteriaId] = useState(null);

  const openMediaLibrary = (field) => {
    setCurrentField(field);
    setMediaLibraryOpen(true);
  };

  const handleImageSelect = (imageUrl, field) => {
    if (field === "image1") {
        setSelectedImage1(imageUrl);
    } else if (field === "image2") {
        setSelectedImage2(imageUrl);
    }
    setMediaLibraryOpen(false);
  };

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

  useImperativeHandle(ref, () => ({
     getCriterias: async () => {
      const img1Id = await getImageIdByUrl(selectedImage1);
      const img2Id = await getImageIdByUrl(selectedImage2);

      return [
        {
          gc_id: criteriaId,
          gc_title: criteriaTitle,
          gc_tag: criteriaTag,
          gc_type: criteriaType || 1,
          gc_img1: img1Id,
          gc_img2: img2Id,
          gc_detail: detail,
          gc_sec: sectionId,
          page_id: pageId,
        }
      ];
    }
  }));

  const handleToggleDisplay = async () => {
    try {
        const newDisplay = displayCriteria === 1 ? 0 : 1;
        await axiosInstance.post(`${API_ENDPOINTS.updateSection}/${sectionId}`, {
            sec_id: sectionId,
            display: newDisplay,
        });
        setDisplayCriteria(newDisplay);
    } catch (error) {
        console.error("Failed to update display:", error);
    }
  };

  useEffect(() => {
    const fetchCriterias = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getCriteria}`);
        const criterias = response.data.data || [];
        if (criterias.length > 0) {
          const criteria = criterias.find(item => item?.section?.sec_page === pageId && item?.gc_sec === sectionId);
          if (criteria) {
            setCriteriaId(criteria.gc_id || null);
            setCriteriaTitle(criteria.gc_title || '');
            setCriteriaTag(criteria.gc_tag || '');
            setCriteriaType(criteria.gc_type || '');
            setDetail(criteria.gc_detail || '');
            setSelectedImage1(criteria.gc_img1 ? `${API}/storage/uploads/${criteria.image1.img}` : '');
            setSelectedImage2(criteria.gc_img2 ? `${API}/storage/uploads/${criteria.image2.img}` : '');
          }
        }

        const sectionRes = await axiosInstance.get(`${API_ENDPOINTS.getSection}/${sectionId}`);
        const sectionData = sectionRes.data.data;
        setDisplayCriteria(sectionData.display || 0);

      } catch (error) {
          console.error("Failed to fetch criterias:", error);
      }
    };

    if(sectionId && pageId){
      fetchCriterias();
    }
  },[sectionId]);

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

  return (
    <div className="grid grid-cols-1 gap-4 ">
      <details className="group [&_summary::-webkit-details-marker]:hidden rounded-lg">
        <summary className="cursor-pointer flex justify-between rounded-lg py-2 w-full ">
          <div
            className="cursor-pointer flex items-center justify-between w-full px-4"
            onClick={() => setIsRotatedButton(!isRotatedButton)}
          >
            <div className="flex gap-1 items-center" ref={handleSectionRef}>
              <svg
                class="cursor-grab size-5 my-auto"
                viewBox="0 0 320 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
              </svg>
              <span className=" text-xl font-medium">Criteria</span>
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              <div
                className={`cursor-pointer shrink-0 transition-transform duration-300
                ${isRotatedButton ? "rotate-180" : ""}`}
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
        {/* row 1 */}
        <div className="flex flex-row gap-4 px-4 py-2">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Title
            </label>
            <div className="mt-2">
              <input
                value={criteriaTitle}
                onChange={(e) => setCriteriaTitle(e.target.value)}
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
                <input
                  checked={displayCriteria === 1}
                  onChange={handleToggleDisplay}
                  type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        {/* row 2 */}
        <div className="flex flex-row gap-4 px-4 py-2">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Tags
            </label>
            <div className="mt-2">
              <input
                value={criteriaTag}
                onChange={(e) => setCriteriaTag(e.target.value)}
                type="text"
                className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
              />
            </div>
          </div>

          {/* <div className="flex-1">
            <label
              for="countries"
              class="block text-xl font-medium leading-6 text-white-900"
            >
              Type
            </label>
            <select
              value={criteriaType}
              onChange={(e) => setCriteriaType(e.target.value)}
              class="mt-2 !border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6">
              <option value="">Choose side display</option>
              <option value="1">left images</option>
              <option value="2">right images</option>
            </select>
          </div> */}
        </div>
        {/* row 3 */}
        <div className="grid grid-cols-2 gap-4 px-4 py-2 mb-1">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Image 1
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
          {isMediaLibraryOpen && currentField === "image1" && (
              <MediaLibraryModal
                  onSelect={(url) => handleImageSelect(url, "image1")}
                  onClose={() => setMediaLibraryOpen(false)}
              />
          )}
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Image 2
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
          {isMediaLibraryOpen && currentField === "image2" && (
              <MediaLibraryModal
                  onSelect={(url) => handleImageSelect(url, "image2")}
                  onClose={() => setMediaLibraryOpen(false)}
              />
          )}
        </div>
        {/* row 4 */}
        <div className="grid grid-cols-1 gap-4 px-4 py-2 mb-1">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Subtitle
            </label>
            <div className="mt-2">
              <JoditEditor
                value={detail}
                config={config}
                onChange={(newContent) => setDetail(newContent)}
              />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
});

export default CriteriaPiece;
