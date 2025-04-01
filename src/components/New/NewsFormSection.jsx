import React, { useState } from "react";

const NewsFormSection = () => {
    const [tags, setTags] = useState("");
    const [date, setDate] = useState("");
    const [favorite, setFavorite] = useState("");

    return (
        <div className="flex justify-center items-center">
            <div className="w-full  bg-white space-y-5">
                {/* Tags Input */}
                <div>
                    <label className="block text-xl font-medium text-gray-700">Tags</label>
                    <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="mt-2 w-full py-2 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter tags"
                    />
                </div>

                {/* Date Input */}
                <div className="mt-4">
                    <label htmlFor="event-date" className="block text-xl font-medium text-gray-700">
                        News Date
                    </label>
                    <input
                        type="date"
                        id="event-date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="mt-2 w-full py-2 border !border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Favorite Dropdown */}
                <div className="mt-4">
                    <label className="block text-xl font-medium text-gray-700">Favorite</label>
                    <select
                        value={favorite}
                        onChange={(e) => setFavorite(e.target.value)}
                        className="mt-2 block w-full border !border-gray-300 rounded-md py-2 pl-2 text-gray-900 shadow-sm focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">Choose Option</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default NewsFormSection;
