import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import TypePieceSlider from "../Type/TypePieceSlider";
import axios from "axios";
import { API_ENDPOINTS, API } from "../../../service/APIConfig";

const TypePiece = forwardRef(({sectionId, pageId}, ref) => {
  const [isRotatedButton1, setIsRotatedButton1] = useState(false);
  const [typeId, setTypeId] = useState(0);
  const [typeTitle, setTypeTitle] = useState('');
  const [typeType, setTypeType] = useState('');
  const [typeSubTitle, setTypeSubTitle] = useState('');
  const [displayTypes, setDisplayTypes] = useState(0);
  const subtypeRef = useRef();

  useImperativeHandle(ref, () => ({
    getTypes: async () => {
      let textId;

      try {
        const response = await axios.get(`${API_ENDPOINTS.getType}`);
        const types = response.data.data || [];
        const currentType = types.find(f => f.section.sec_page === pageId && f.tse_sec === sectionId && f.text?.text_type === 6);
        if (currentType?.text?.text_id) {
          textId = currentType.text.text_id;
        }
      } catch (error) {
        console.error("Failed to check existing type:", error);
      }

      if (textId) {
        const updatePayload = {
          text_id: textId,
          title: typeTitle,
          desc: typeSubTitle,
          text_type: 6,
          text_sec: sectionId,
        };
        const textRes = await axios.post(`${API_ENDPOINTS.updateText}/${textId}`, { texts: updatePayload });
        textId = textRes.data.data?.text_id;
      } else {
        const textPayload = {
          title: typeTitle,
          desc: typeSubTitle,
          text_type: 6,
          text_sec: sectionId,
        };
        const textRes = await axios.post(`${API_ENDPOINTS.createText}`, { texts: [textPayload] });
        textId = textRes.data.data?.text_id;
      }


      const data = {
        tse_id: typeId,
        tse_sec: sectionId,
        tse_type: parseInt(typeType),
        tse_text: textId,
        page_id: pageId,
        subtypes: await subtypeRef.current?.getSubTypeSliders(),
      };

      return [data];
    }
  }));

  const handleToggleDisplay = async () => {
    try {
        const newDisplay = displayTypes === 1 ? 0 : 1;
        await axios.post(`${API_ENDPOINTS.updateSection}/${sectionId}`, {
            sec_id: sectionId,
            display: newDisplay,
        });
        setDisplayTypes(newDisplay);
    } catch (error) {
        console.error("Failed to update display:", error);
    }
  };

  const handleDeleteSection = async () => {
    if (!window.confirm("Are you sure you want to delete this section?")) return;

    try {
        await axios.put(`${API_ENDPOINTS.deleteSection}/${sectionId}`);
        window.location.reload();
    } catch (error) {
        console.error('Failed to delete section:', error);
    }
  };

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.getType}?tse_sec=${sectionId}`);
        const types = response.data.data || [];
        if (types.length > 0) {
          const type = types.find(item =>
            item.section.sec_page === pageId &&
            item.tse_sec === sectionId &&
            item.text?.text_type === 6
          );

          if (type) {
            setTypeId(type.tse_id || null);
            setTypeType(type.tse_type || null);
            setTypeTitle(type.text?.title || '');
            setTypeSubTitle(type.text?.desc || '');
          }
        }

        const sectionRes = await axios.get(`${API_ENDPOINTS.getSection}/${sectionId}`);
        const sectionData = sectionRes.data.data;
        setDisplayTypes(sectionData.display || 0);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
      }
    };

    if(sectionId && pageId){
      fetchTypes();
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
              <span className=" text-xl font-medium">Type S&E</span>
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
                type="text"
                value={typeTitle}
                onChange={(e) => setTypeTitle(e.target.value)}
                className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
              />
            </div>
          </div>
          <div className="flex-1">
            <label
              for="countries"
              class="block text-xl font-medium leading-6 text-white-900"
            >
              Type
            </label>
            <select
              value={typeType}
              onChange={(e) => setTypeType(e.target.value)}
              class="mt-2 !border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6">
              <option value="0">Select Display Type</option>
              <option value="1">With Check</option>
              <option value="2">No Check</option>
            </select>
          </div>
          <div className="flex-non">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Display
            </label>
            <div className="mt-2">
              <label class="toggle-switch mt-2">
                <input
                  type="checkbox"
                  checked={displayTypes === 1}
                  onChange={handleToggleDisplay}
                  />
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
        {/* Row 2 */}
        <div className="grid grid-cols-1 gap-4 px-4 py-2 mb-1">
          <div className="flex-1">
            <label className="block text-xl font-medium leading-6 text-white-900">
              Subtitle
            </label>
            <div className="mt-2">
              <textarea
                value={typeSubTitle}
                onChange={(e) => setTypeSubTitle(e.target.value)}
                className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
            </div>
          </div>
        </div>
        <div className="mb-4">
          <TypePieceSlider ref={subtypeRef} typeId={typeId}/>
        </div>
      </details>
    </div>
  );
});

export default TypePiece;
