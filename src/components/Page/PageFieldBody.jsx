import React, { useEffect, forwardRef } from 'react'
import PageSection from './PageSection'

const PageFieldBody = forwardRef((props, pageRef) => {
    const { formData, setFormData, page_id } = props;

    // useEffect(() => {
    //     if (pageRef && pageRef.current) {
    //         if (typeof pageRef.current.getPrograms === 'function') {
    //         } else {
    //         console.warn("❌ getPrograms() is NOT defined on pageRef.current");
    //         }
    //     } else {
    //         console.warn("❌ pageRef is missing or not set");
    //     }
    // }, []);

    return (
        <div className='px-4'>
            <div className="flex flex-row gap-4 px-4">
                <div className="flex-1">
                    <label className="block text-xl font-medium leading-6 text-white-900">
                    Title
                    </label>
                    <div className="mt-2">
                    <input
                        type="text"
                        value={formData?.p_title || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, p_title: e.target.value }))}
                        className="block w-full !border-gray-200 border-0 rounded-md py-2 pl-5 text-gray-900 shadow-sm ring-1 ring-inset !ring-gray-300 placeholder:text-gray-400 focus:ring-2 sm:text-2xl sm:leading-6"
                    />
                    </div>
                </div>

                <div className="flex-1">
                    <label className="block text-xl font-medium leading-6 text-white-900">
                    Alias
                    </label>
                    <div className="mt-2">
                    <input
                        type="text"
                        value={formData?.p_alias || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, p_alias: e.target.value }))}
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
                            type="checkbox"
                            checked={formData?.display === true}
                            onChange={(e) => setFormData(prev => ({ ...prev, display: e.target.checked }))}
                        />
                        <span class="slider"></span>
                    </label>
                    </div>
                </div>
            </div>
            <div>
                <PageSection
                    ref={pageRef}
                    formData={formData}
                    setFormData={setFormData}
                    page_id={page_id}
                />
            </div>
        </div>
    )
});

export default PageFieldBody;