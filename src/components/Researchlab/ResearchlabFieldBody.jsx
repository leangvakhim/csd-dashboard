import React, { useState, useEffect, useCallback } from 'react';
import JoditEditor from 'jodit-react';
import 'jodit/es5/jodit.css';
import ResearchlabTagSection from './ResearchlabTagSection';
import { API_ENDPOINTS } from '../../service/APIConfig';

const config = {
    readonly: false,  // Set to true for read-only mode
    height: 400,
    placeholder: 'Start typing...',
    buttons: [
        'bold', 'italic', 'underline', 'strikethrough', '|',
        'ul', 'ol', '|', 'image', 'link', 'table', '|',
        'align', 'undo', 'redo', 'hr', '|',
        'source'
    ],
    uploader: {
        insertImageAsBase64URI: true,  // Enable base64 image upload
    },
};

const ResearchlabFieldBody = ({ 
    formData,
    setFormData, 
    researchlabTagRef, 
    onImageSelect 
}) => {
    const [activeTab, setActiveTab] = useState(formData.lang || 1);

    useEffect(() => {
        if (formData.lang) {
            setActiveTab(formData.lang);
        }
    }, [formData.lang]);
  
    

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    }, [setFormData]);

    const handleEditorChange = useCallback((newContent) => {
        setFormData(prev => ({
            ...prev,
            rsdl_detail: newContent
        }));
    }, [setFormData]);
   
    
    console.log("prop error",formData.rsdl_id)

    return (
        <div className='sm:px-8 px-2 py-2 mb-1'>
            <div className="tabs">
                <div className="flex">
                    <ul className="flex items-center h-12 bg-gray-100 rounded-lg transition-all duration-300 p-2 overflow-hidden">
                        {[
                            { id: 1, label: "English" },
                            { id: 2, label: "Khmer" }
                        ].map(langOption => (
                            <li key={langOption.id}>
                                <a
                                    href="javascript:void(0)"
                                    className={`mx-2 inline-block py-1.5 px-6 text-gray-600 hover:text-gray-800 font-medium ${activeTab === langOption.id ? 'bg-white rounded-lg text-gray-600' : 'tablink'
                                        } whitespace-nowrap`}
                                    onClick={() => {
                                        setActiveTab(langOption.id);
                                        setFormData(prev => ({ ...prev, lang: langOption.id }));
                                    }}
                                    role="tab"
                                >
                                    {langOption.label}
                                </a>
                            </li>
                        ))}
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
                                    name="rsdl_title"
                                    value={formData.rsdl_title || ''}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                                />
                            </div>
                        </div>

                        <div className="flex-1 w-full">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Favourite
                            </label>
                            <div className="mt-2">
                                <select
                                    name="rsdl_fav"
                                    value={formData.rsdl_fav || ''}
                                    onChange={handleInputChange}
                                    className="!border-gray-300 block w-full border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6">
                                    <option value="" disabled>Choose options</option>
                                    <option value="1">Yes</option>
                                    <option value="0">No</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-non mb-2">
                            <label className="block text-xl font-medium leading-6 text-white-900">
                                Display
                            </label>
                            <div className="mt-1">
                                <label className="toggle-switch mt-2">
                                    <input
                                        type="checkbox"
                                        name="display"
                                        checked={formData.display === 1}
                                        onChange={handleInputChange}
                                    />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Second row */}
                    <ResearchlabTagSection
                        ref={researchlabTagRef}
                        rsdl_id={formData.rsdl_id}
                    />

                    {/* Third row */}
                    <div>
                        <div className="grid grid-cols-1 gap-4 py-2">
                            <div className="w-full">
                                <label className="block text-xl font-medium leading-6 text-white-900">
                                    Description
                                </label>
                                <div className="mt-2 cursor-text">
                                    <JoditEditor
                                        value={formData.rsdl_detail || ''}
                                        config={config}
                                        tabIndex={1}
                                        onBlur={handleEditorChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResearchlabFieldBody;
