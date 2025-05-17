import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import MediaLibraryModal from "../../MediaLibraryModal";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../../service/APIConfig";
import Swal from "sweetalert2";

const GalleyPiece = forwardRef(({sectionId, pageId}, ref) => {
  const [isRotatedButton1, setIsRotatedButton1] = useState(false);
  const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
  const [currentField, setCurrentField] = useState("");
  const [galId, setGalId] = useState(0);
  const [galTitle, setGalTitle] = useState('');
  const [galSubTitle, setGalSubTitle] = useState('');
  const [displayGallery, setDisplayGallery] = useState(0);
  const [selectedImages, setSelectedImages] = useState({
    image1: "",
    image2: "",
    image3: "",
    image4: "",
    image5: ""
  });


  const openMediaLibrary = (field) => {
    setCurrentField(field);
    setMediaLibraryOpen(true);
  };

  const handleImageSelect = (imageUrl, field) => {
    setSelectedImages(prev => ({ ...prev, [field]: imageUrl }));
    setMediaLibraryOpen(false);
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

  useImperativeHandle(ref, () => ({
    getGallery: async () => {
      let textId;

      try {
        const response = await axios.get(`${API_ENDPOINTS.getGallery}?gal_sec=${sectionId}`);
        const galleries = response.data.data || [];
        const currentGallery = galleries.find(item =>
          item.section &&
          item.section.sec_page === pageId &&
          item.gal_sec === sectionId &&
          item.text?.text_type === 4
        );
        if (currentGallery?.text?.text_id) {
          textId = currentGallery.text.text_id;
        }
      } catch (error) {
        console.error("Failed to check existing gallery:", error);
      }

      // If both galTitle and galSubTitle are empty or only whitespace, skip create/update and return gal_text: 0
      if (!galTitle?.trim() && !galSubTitle?.trim()) {
        return [{
          gal_id: galId,
          gal_sec: sectionId,
          gal_text: 0,
          gal_img1: null,
          gal_img2: null,
          gal_img3: null,
          gal_img4: null,
          gal_img5: null,
          page_id: pageId
        }];
      }

      if (textId) {
        const updatePayload = {
          text_id: textId,
          title: galTitle,
          desc: galSubTitle,
          text_type: 4,
          text_sec: sectionId,
        };
        const textRes = await axios.post(`${API_ENDPOINTS.updateText}/${textId}`, { texts: updatePayload });
        textId = textRes.data.data?.text_id;
      } else {
        const textPayload = {
          title: galTitle,
          desc: galSubTitle,
          text_type: 4,
          text_sec: sectionId,
        };
        const textRes = await axios.post(`${API_ENDPOINTS.createText}`, { texts: [textPayload] });
        textId = textRes.data.data?.text_id;
      }

      const imageId1 = await getImageIdByUrl(selectedImages.image1);
      const imageId2 = await getImageIdByUrl(selectedImages.image2);
      const imageId3 = await getImageIdByUrl(selectedImages.image3);
      const imageId4 = await getImageIdByUrl(selectedImages.image4);
      const imageId5 = await getImageIdByUrl(selectedImages.image5);

      const data = {
        gal_id: galId,
        gal_sec: sectionId,
        gal_text: textId,
        gal_img1: imageId1,
        gal_img2: imageId2,
        gal_img3: imageId3,
        gal_img4: imageId4,
        gal_img5: imageId5,
        page_id: pageId
      };

      return [data];
    }
  }));

  const handleToggleDisplay = async () => {
    try {
        const newDisplay = displayGallery === 1 ? 0 : 1;
        await axios.post(`${API_ENDPOINTS.updateSection}/${sectionId}`, {
            sec_id: sectionId,
            display: newDisplay,
        });
        setDisplayGallery(newDisplay);
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
          await axios.put(`${API_ENDPOINTS.deleteSection}/${sectionId}`);
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
    const fetchFacitlies = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.getGallery}?gal_sec=${sectionId}`);
        const galleries = response.data.data || [];
        if (galleries.length > 0) {
          const gallery = galleries.find(item =>
            item?.section?.sec_page === pageId &&
            item.gal_sec === sectionId &&
            item.text?.text_type === 4
          );

          if (gallery) {
            setGalId(gallery.gal_id || null);
            setGalTitle(gallery.text?.title || '');
            setGalSubTitle(gallery.text?.desc || '');
            setSelectedImages({
              image1: gallery.image1?.img ? `${API}/storage/uploads/${gallery.image1.img}` : '',
              image2: gallery.image2?.img ? `${API}/storage/uploads/${gallery.image2.img}` : '',
              image3: gallery.image3?.img ? `${API}/storage/uploads/${gallery.image3.img}` : '',
              image4: gallery.image4?.img ? `${API}/storage/uploads/${gallery.image4.img}` : '',
              image5: gallery.image5?.img ? `${API}/storage/uploads/${gallery.image5.img}` : '',
            });
          }
        }

        const sectionRes = await axios.get(`${API_ENDPOINTS.getSection}/${sectionId}`);
        const sectionData = sectionRes.data.data;
        setDisplayGallery(sectionData.display || 0);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      }
    };

    if(sectionId && pageId){
      fetchFacitlies();
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
            <div className="flex gap-1 items-center">
              <svg
                class="cursor-grab size-5 my-auto"
                viewBox="0 0 320 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M40 352l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zm192 0l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 320c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 192l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40zM40 160c-22.1 0-40-17.9-40-40L0 72C0 49.9 17.9 32 40 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0zM232 32l48 0c22.1 0 40 17.9 40 40l0 48c0 22.1-17.9 40-40 40l-48 0c-22.1 0-40-17.9-40-40l0-48c0-22.1 17.9-40 40-40z"></path>
              </svg>
              <span className=" text-xl font-medium">Galley</span>
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
        <div className="flex flex-row gap-4 px-4 py-2">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Title
            </label>
            <div className="mt-2">
              <input
                value={galTitle}
                onChange={(e) => setGalTitle(e.target.value)}
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
                <input type="checkbox"
                  checked={displayGallery === 1}
                  onChange={handleToggleDisplay}
                />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 md:!grid-cols-3 gap-4 px-4 py-2 mb-1">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Subtitle
            </label>
            <div className="mt-2">
              <textarea
                value={galSubTitle}
                onChange={(e) => setGalSubTitle(e.target.value)}
                className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
            </div>
          </div>
          {["image1", "image2", "image3", "image4", "image5"].map((field, index) => (
          <div key={field} className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              {`Image ${index + 1}`}
            </label>
            <div className="flex items-center justify-center w-full mt-2 border-1">
              <label className="flex flex-col items-center justify-center w-full h-60 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {selectedImages[field] ? (
                  <div>
                    <img src={selectedImages[field]} alt="Selected" className="h-40 w-40 object-contain" />
                    <div className="flex gap-3 mt-2 justify-center">
                      <svg
                        onClick={() => openMediaLibrary(field)}
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
                        onClick={() => handleImageSelect("", field)}
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
                  <div onClick={() => openMediaLibrary(field)} className="flex flex-col items-center justify-center pt-5 pb-6">
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
            {isMediaLibraryOpen && currentField === field && (
              <MediaLibraryModal
                onSelect={(url) => handleImageSelect(url, field)}
                onClose={() => setMediaLibraryOpen(false)}
              />
            )}
          </div>
        ))}
        </div>
      </details>
    </div>
  );
});

export default GalleyPiece;
