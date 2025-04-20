import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../service/APIConfig";

const FeedbackPiece = forwardRef(({sectionId, pageId}, ref) => {
    const [isRotatedButton1, setIsRotatedButton1] = useState(false);
    const [newId, setNewId] = useState(0);
    const [title, setTitle] = useState(null);
    const [subtitle, setSubtitle] = useState(null);
    const [btnTitle, setBtnTitle] = useState(null);
    const [redirectPage, setRedirectPage] = useState(null);
    const [amount, setAmount] = useState(null);
    const [displayNews, setDisplayNews] = useState(0);

    useImperativeHandle(ref, () => ({
        getFeedbacks: async () => {
            const data = {
                hsec_id: newId,
                hsec_sec: sectionId,
                hsec_title: title,
                hsec_subtitle: subtitle,
                hsec_btntitle: btnTitle,
                hsec_amount: parseInt(amount),
                hsec_routepage: redirectPage,
            };
        return [data];
        }
    }));

    const handleToggleDisplay = async () => {
        try {
            const newDisplay = displayNews === 1 ? 0 : 1;
            await axios.post(`${API_ENDPOINTS.updateSection}/${sectionId}`, {
                sec_id: sectionId,
                display: newDisplay,
            });
            setDisplayNews(newDisplay);
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
        const fetchLabs = async () => {
            try {
                const response = await axios.get(`${API_ENDPOINTS.getHeaderSection}?hsec_sec=${sectionId}`);
                const hsecs = response.data.data || [];
                if (hsecs.length > 0) {
                const hsec = hsecs.find(item =>
                    item?.section?.sec_page === pageId &&
                    item?.hsec_sec === sectionId
                );

                if (hsec) {
                    setNewId(hsec.hsec_id || null);
                    }
                }

                const sectionRes = await axios.get(`${API_ENDPOINTS.getSection}/${sectionId}`);
                const sectionData = sectionRes.data.data;
                setDisplayNews(sectionData.display || 0);
            } catch (error) {
                console.error("Failed to fetch facilities:", error);
            }
        };

        fetchLabs();
    }, [sectionId]);

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
                                Feedback
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
                    <div className="flex-non flex gap-3">
                        <label className="block text-xl font-medium leading-6 text-white-900">
                            Display
                        </label>
                        <div className="my-auto">
                            <label class="toggle-switch">
                                <input
                                    checked={displayNews === 1}
                                    onChange={handleToggleDisplay}
                                    type="checkbox" />
                                <span class="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="w-full flex justify-center items-center bg-gray-50 !border-t-1 p-6">
                    <div className="px-4 mb-1">
                        <span>feedback's Element</span>
                    </div>
                </div>
            </details>
        </div>
    )
});

export default FeedbackPiece;
