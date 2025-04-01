import { useState } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";

const ScholarshipDateTime = () => {
    const [deadline, setDeadline] = useState("");
    const [postDate, setPostDate] = useState("");
    const [sponsor, setSponsor] = useState("");
    const [shortTitle, setShortTitle] = useState("");
    const [favourite, setFavourite] = useState("");

    return (
        <div className="space-y-5">
        <div className="flex flex-col sm:!flex-row gap-6 bg-white shadow-md rounded-lg">
            {/* Deadline */}
            <div className="flex flex-col w-full">
                <label className="text-lg font-semibold text-gray-700">Deadline</label>
                <div className="relative mt-2">
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Post date */}
            <div className="flex flex-col w-full">
                <label className="text-lg font-semibold text-gray-700">Post date</label>
                <div className="relative mt-2">
                    <input
                        type="date"
                        value={postDate}
                        onChange={(e) => setPostDate(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
            </div>

            {/* Sponsor */}
            <div className="flex flex-col w-full">
                <label className="text-lg font-semibold text-gray-700">Sponsor</label>
                <select
                    value={sponsor}
                    onChange={(e) => setSponsor(e.target.value)}
                    className="mt-2 w-full border !border-gray-300 rounded-md py-2 pl-2 pr-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Choose Option</option>
                    <option value="woori">Woori</option>
                    <option value="aba">ABA</option>
                </select>
            </div>
        </div>
        <div className="flex flex-col sm:!flex-row gap-6 bg-white shadow-md rounded-lg">
        {/* Short Title */}
        <div className="flex flex-col w-full">
            <label className="text-lg font-semibold text-gray-700">Short Title</label>
            <input
                type="text"
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
                className="mt-2 w-full bg-gray-200 py-2 px-3 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
        </div>

        {/* Favourite */}
        <div className="flex flex-col w-full">
            <label className="text-lg font-semibold text-gray-700">Favourite</label>
            <select
                value={favourite}
                onChange={(e) => setFavourite(e.target.value)}
                className="mt-2 w-full bg-gray-200 border !border-gray-300 rounded-md py-2 px-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="">Drop down</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
            </select>
        </div>
    </div>
    </div>

    );
}

export default ScholarshipDateTime;
