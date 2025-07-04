import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import PotentialPieceSlider from "./PotentialPieceSlider";
import MediaLibraryModal from "../../MediaLibraryModal";
import { API_ENDPOINTS, API, axiosInstance } from "../../../service/APIConfig";
import Swal from "sweetalert2";

const PotentialPiece = forwardRef(({sectionId, pageId, handleSectionRef}, ref) => {
  const [isRotatedButton1, setIsRotatedButton1] = useState(false);
  const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [potentialId, setPotentialId] = useState(0);
  const [potentialTitle, setPotentialTitle] = useState('');
  const [potentialSubTitle, setPotentialSubTitle] = useState('');
  const [displayPotential, setDisplayPotential] = useState(0);
  const subserviceRef = useRef();

  const openMediaLibrary = () => {
    setMediaLibraryOpen(true);
  };

  const handleImageSelect = (imageUrl, field) => {
    if (field === "image") {
      setSelectedImage(imageUrl ? `${imageUrl}` : "");
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
    getPotentials: async () => {
      let textId;

      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getSpecialization}`);
        const potential = response.data.data || [];
        const currentPotential = potential.find(f => f.section.sec_page === pageId && f.ras_sec === sectionId && f.text?.text_type === 8);
        if (currentPotential?.text?.text_id) {
          textId = currentPotential.text.text_id;
        }
      } catch (error) {
        console.error("Failed to check existing facility:", error);
      }

      if (textId) {
        const updatePayload = {
          text_id: textId,
          title: potentialTitle,
          desc: potentialSubTitle,
          text_type: 8,
          text_sec: sectionId,
        };
        const textRes = await axiosInstance.post(`${API_ENDPOINTS.updateText}/${textId}`, { texts: updatePayload });
        textId = textRes.data.data?.text_id;
      } else {
        const textPayload = {
          title: potentialTitle,
          desc: potentialSubTitle,
          text_type: 8,
          text_sec: sectionId,
        };
        const textRes = await axiosInstance.post(`${API_ENDPOINTS.createText}`, { texts: [textPayload] });
        textId = textRes.data.data?.text_id;
      }

      const imageId = await getImageIdByUrl(selectedImage);

      const data = {
        ras_id: potentialId,
        ras_sec: sectionId,
        ras_text: textId,
        ras_img1: imageId,
        ras_img2: null,
        page_id: pageId,
        subservices: await subserviceRef.current?.getSubserviceSlidersPotential(),
      };

      return [data];
    }
  }));

  const handleToggleDisplay = async () => {
    try {
        const newDisplay = displayPotential === 1 ? 0 : 1;
        await axiosInstance.post(`${API_ENDPOINTS.updateSection}/${sectionId}`, {
            sec_id: sectionId,
            display: newDisplay,
        });
        setDisplayPotential(newDisplay);
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
    const fetchPotentials = async () => {
      try {
        const response = await axiosInstance.get(`${API_ENDPOINTS.getSpecialization}?ras_sec=${sectionId}`);
        const potentials = response.data.data || [];
        if (potentials.length > 0) {
          const potential = potentials.find(item =>
            item.section.sec_page === pageId &&
            item.ras_sec === sectionId &&
            item.text?.text_type === 8
          );

          if (potential) {
            setPotentialId(potential.ras_id || null);
            setPotentialTitle(potential.text?.title || '');
            setPotentialSubTitle(potential.text?.desc || '');
            setSelectedImage(potential.ras_img1 ? `${API}/storage/uploads/${potential.image1.img}` : '');
          }
        }

        const sectionRes = await axiosInstance.get(`${API_ENDPOINTS.getSection}/${sectionId}`);
        const sectionData = sectionRes.data.data;
        setDisplayPotential(sectionData.display || 0);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    if(sectionId && pageId){
      fetchPotentials();
    }
  }, [sectionId]);

  return (
    <div className="grid grid-cols-1 gap-4 ">
      <details className="group [&_summary::-webkit-details-marker]:hidden rounded-lg">
        <summary className="cursor-pointer flex justify-between rounded-lg py-2 w-full ">
          <div
            className="cursor-pointer flex items-center justify-between w-full px-4"
            onClick={() => setIsRotatedButton1(!isRotatedButton1)}
          >
            <div className="flex gap-1 items-center" ref={handleSectionRef}>
              <svg
                class="cursor-grab size-5 my-auto"
                viewBox="0 0 320 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
              </svg>
              <span className=" text-xl font-medium">Potential</span>
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
                className={`cursor-pointer shrink-0 transition-transform duration-300 ${
                  isRotatedButton1 ? "rotate-180" : ""
                }`}
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
        {/* Row 1 */}
        <div className="flex flex-row gap-2 px-4 py-2">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Title
            </label>
            <div className="mt-2">
              <input
                value={potentialTitle}
                onChange={(e) => setPotentialTitle(e.target.value)}
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
                  checked={displayPotential === 1}
                  onChange={handleToggleDisplay}
                  type="checkbox" />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:!grid-cols-2  gap-4 px-4 py-2 ">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Subtitle
            </label>
            <div className="mt-2">
              <textarea
                value={potentialSubTitle}
                onChange={(e) => setPotentialSubTitle(e.target.value)}
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
        <div className="mb-4">
          <PotentialPieceSlider ref={subserviceRef} potentialId={potentialId}/>
        </div>
      </details>
    </div>
  );
});

export default PotentialPiece;
