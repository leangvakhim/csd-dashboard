import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import axios from "axios";
import { API_ENDPOINTS } from "../../../service/APIConfig";

const AddOn = forwardRef(({csdId}, ref) => {
    const [rotatedStates, setRotatedStates] = useState({});
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [subtitle, setSubtitel] = useState("");
    const [addOnId, setAddOnId] = useState(0);

    useImperativeHandle(ref, () => ({
        getAddOnCSD: async () => {

        return [
            {
            rason_id: addOnId,
            rason_title: title,
            rason_subtitle: subtitle,
            rason_amount: amount,
            rason_ras: csdId,
            }
        ];
        }
    }));

    useEffect(() => {
        const fetchAddOnCSD = async () => {
            try {
                const response = await axios.get(API_ENDPOINTS.getAddOnCSD);
                const data = response.data?.data;

                if (Array.isArray(data) && csdId) {
                    const validSubservices = data.filter(item => item.rason_ras === csdId);

                    if (validSubservices.length > 0) {
                        const { rason_id, rason_title, rason_subtitle, rason_amount } = validSubservices[0];

                        setAddOnId(rason_id || 0);
                        setTitle(rason_title || '');
                        setSubtitel(rason_subtitle || '');
                        setAmount(rason_amount || '');
                    }
                }
            } catch (error) {
                console.error('Error fetching add-on CSD:', error);
            }
        };

        fetchAddOnCSD();
    }, [csdId]);

    const toggleRotation = (id) => {
        setRotatedStates((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <details className="group [&_summary::-webkit-details-marker]:hidden border rounded-lg">
            <summary
                className="cursor-pointer flex justify-between px-2 py-2 pl-5 w-full "
                onClick={() => toggleRotation("addOn")}
            >
                <div className="flex ">
                    <div
                        className="cursor-grab my-auto"
                    >
                    </div>
                    <span className="text-lg ">
                        Add On
                    </span>
                </div>
                <span className=" shrink-0 transition-transform duration-500 group-open:-rotate-0 flex gap-2">
                    <div className="block">
                    </div>
                    <span
                        className={`cursor-pointer shrink-0 transition-transform duration-300 ${rotatedStates["addOn"] ? "rotate-180" : ""
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
            <div className="flex flex-col items-center gap-4 px-4 py-2">
                <div className="flex-1 w-full">
                    <label className=" block text-xl font-medium leading-6 text-white-900">
                        Title
                    </label>
                    <div className="mt-2">
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            type="text"
                            className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className=" block text-xl font-medium leading-6 text-white-900">
                        Amount
                    </label>
                    <div className="mt-2">
                        <input
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            type="text"
                            className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                        />
                    </div>
                </div>
                <div className="flex-1 w-full">
                    <label className=" block text-xl font-medium leading-6 text-white-900">
                        Subtitle
                    </label>
                    <div className="mt-2">
                        <textarea
                            value={subtitle}
                            onChange={(e) => setSubtitel(e.target.value)}
                            className="!border-gray-300 h-60 block w-full rounded-md border-0 py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-2xl sm:leading-6"></textarea>
                    </div>
                </div>

            </div>

        </details>
    );
});

export default AddOn;
