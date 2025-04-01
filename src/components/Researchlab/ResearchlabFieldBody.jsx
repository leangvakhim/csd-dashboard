import React, {useState} from 'react'
import MediaLibraryModal from '../MediaLibraryModal';
import ResearchlabRichText from './ResearchlabRichText';

const ResearchlabFieldBody = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [isMediaLibraryOpen, setMediaLibraryOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const openMediaLibrary = () => {
        // setCurrentField(field);
        setMediaLibraryOpen(true);
    };

    const handleImageSelect = (imageUrl, field) => {
        if (field === "image") {
            setSelectedImage(imageUrl ? `${imageUrl}` : "");
        }
        setMediaLibraryOpen(false);
    };

    return (
        <div className='px-8 py-2 mb-1'>
            <div className="tabs">
                <div className="flex">
                    <ul className="flex items-center h-12 bg-gray-100 rounded-lg transition-all duration-300 p-2 overflow-hidden">
                        <li>
                            <a
                                href="javascript:void(0)"
                                className={`mx-2 inline-block py-1.5 px-6 text-gray-600 hover:text-gray-800 font-medium ${
                                    activeTab === 1
                                        ? 'bg-white rounded-lg text-gray-600'
                                        : 'tablink'
                                } whitespace-nowrap`}
                                onClick={() => setActiveTab(1)}
                                role="tab"
                            >
                                English
                            </a>
                        </li>
                        <li>
                            <a
                                href="javascript:void(0)"
                                className={`mx-2 inline-block py-1.5 px-6 text-gray-600 hover:text-gray-800 font-medium ${
                                    activeTab === 2
                                        ? 'bg-white rounded-lg text-gray-600'
                                        : 'tablink'
                                } whitespace-nowrap`}
                                onClick={() => setActiveTab(2)}
                                role="tab"
                            >
                                Khmer
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="mt-3">
                    {/* First row */}
                    <div className="flex flex-col sm:!flex-row gap-4 items-center py-2">
                        <div className="flex-1 w-full">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                            Title
                            </label>
                            <div className="mt-2">
                            <input
                                type="text"
                                className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                            />
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <label class="block text-xl font-medium leading-6 text-white-900">
                                Favourite
                            </label>
                            <div className='mt-2'>
                                <select class="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6">
                                    <option selected>Choose options</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-non">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                            Display
                            </label>
                            <div className="mt-2">
                            <label class="toggle-switch mt-2">
                                <input type="checkbox" />
                                <span class="slider"></span>
                            </label>
                            </div>
                        </div>
                    </div>
                    {/* Second row */}
                    <div>
                        <div className="grid grid-cols-1 gap-4 py-2">
                            <ResearchlabRichText />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResearchlabFieldBody