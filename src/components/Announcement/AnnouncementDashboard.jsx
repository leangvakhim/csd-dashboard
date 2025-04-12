import React, {useState} from 'react'

const AnnouncementDashboard = () => {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [announcementItems, setAnnouncementItems] = useState ([
        {
            a_id: 1,
            a_title: 'Welcome to CSD Dashboard',
            a_date: '2025-04-10',
            lang: 1, // English
            display: 1, // Enable
        },
        {
            a_id: 2,
            a_title: 'សេចក្តីជូនដំណឹងថ្មី',
            a_date: '2025-04-09',
            lang: 2, // Khmer
            display: 0, // Disable
        },
        {
            a_id: 3,
            a_title: 'System Maintenanae Notification',
            a_date: '2025-04-05',
            lang: 1, // English
            display: 1, // Enable
        },
        {
            a_id: 4,
            a_title: 'New Features Released',
            a_date: '2025-04-02',
            lang: 1, // English
            display: 1, // Enable
        }
    ]);

    const moveItem = (index, direction) => {
        const newItems = [...announcementItems];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= newItems.length) return;

        // Swap items locally
        [newItems[index], newItems[targetIndex]] = [newItems[targetIndex], newItems[index]];

        setAnnouncementItems(newItems);
    };

    return (
        <div className="relative overflow-x-auto shadow-md px-8">
            <table className="w-full text-sm text-left border border-gray-200 text-gray-500 ">
                <thead className="text-xs text-gray-700  uppercase bg-gray-50 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Title
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Post On
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Language
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Status
                        </th>
                        <th scope="col" className=" px-6 py-3">
                            {/* Action */}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {announcementItems.length === 0 ? (
                        <tr>
                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                No news data available.
                            </td>
                        </tr>
                    ) : (
                        announcementItems.map((item, index) => (
                            <tr key={item.a_id || index} className="odd:bg-white even:bg-gray-50 border">
                                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                    {item.a_title || 'No Title'}
                                </th>
                                <td className="px-6 py-4">
                                    {item.a_date
                                        ? new Date(item.a_date).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })
                                        : 'N/A'}
                                </td>
                                <td className="px-6 py-4">
                                    {{
                                        1: 'English',
                                        2: 'Khmer',
                                        // 3: 'Chinese',
                                        // 4: 'French'
                                    }[item.lang] || 'Unknown'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`${item.display ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'} text-xs font-medium me-2 px-2.5 py-0.5 rounded-xl`}>
                                        {item.display ? 'Enable' : 'Disable'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2 items-center relative">
                                    <a onClick={() => moveItem(index, 'up')} className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
                                        <i className="ti ti-chevron-up text-xl"></i>
                                    </a> |
                                    <a onClick={() => moveItem(index, 'down')} className="cursor-pointer font-medium text-gray-900 hover:text-blue-500 hover:underline">
                                        <i className="ti ti-chevron-down text-xl"></i>
                                    </a> |
                                    <div className="relative">
                                        <button
                                            onClick={() => setActiveDropdown(activeDropdown === item.a_id ? null : item.a_id)}
                                            className="font-medium text-gray-900 hover:text-blue-500"
                                        >
                                            <i className="ti ti-dots-vertical text-xl"></i>
                                        </button>
                                        {activeDropdown === item.a_id && (
                                            <div className="fixed right-0 mt-2 w-36 mr-8 bg-white border border-gray-300 rounded-md shadow-md z-50">
                                                <div className="py-1">
                                                    <a
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-edit text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Edit</span>
                                                    </a>
                                                    <a
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100"
                                                    >
                                                        <i className="ti ti-trash text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Delete</span>
                                                    </a>
                                                    <a
                                                        className="cursor-pointer flex gap-2 items-center px-4 py-2 hover:bg-blue-100">
                                                        <i className="ti ti-copy text-gray-500 text-xl"></i>
                                                        <span className="text-sm text-gray-700">Duplicate</span>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AnnouncementDashboard