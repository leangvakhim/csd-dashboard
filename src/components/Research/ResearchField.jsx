import React, { useState, useEffect, useRef } from 'react'
import Aside from '../Aside'
import ResearchFieldHeader from './ResearchFieldHeader'
import ResearchFieldBody from './ResearchFieldBody'
import { useLocation } from 'react-router-dom'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios'

const ResearchField = () => {
    const researchRef = useRef();
    const location = useLocation();
    const researchData = location.state?.researchData;
    const [formData, setFormData] = useState({
        lang: 1,
        rsd_title: '',
        rsd_subtitle: '',
        rsd_lead: '',
        rsd_fav: '',
        rsd_img: '',
        rsd_order: '',
        display: 1,
        active: 1,
    });

    useEffect(() => {
        if (researchData?.data?.rsd_id) {
            fetchResearchById(researchData.data.rsd_id);
        }
    }, [researchData]);

    const fetchResearchById = async (id) => {
        try {
            const res = await axios.get(`${API_ENDPOINTS.getResearch}/${id}`);
            if (res.data && res.data.data) {
                setFormData(res.data.data);
            }
        } catch (error) {
            console.error('❌ Failed to fetch research by ID:', error);
        }
    };

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            rsd_img: imageId,
        }));
    };

    const saveResearch = async () => {
        const isUpdate = !!formData?.rsd_id;
        const payload = {
            lang: formData.lang,
            rsd_title: formData.rsd_title || '',
            rsd_subtitle: formData.rsd_subtitle || '',
            rsd_lead: formData.rsd_lead || '',
            rsd_fav: parseInt(formData.rsd_fav),
            rsd_img: formData.rsd_img || undefined,
            display: formData.display ? 1 : 0,
        };

        try {
            if (!isUpdate) {
                const res = await axios.post(API_ENDPOINTS.createResearch, payload);
                const createdResearch = res.data.data;
                await fetchResearchById(createdResearch.rsd_id);
                await savePageResearch(createdResearch.rsd_id);
                return createdResearch;
            } else {
                const res = await axios.post(`${API_ENDPOINTS.updateResearch}/${formData.rsd_id}`, payload);
                await fetchResearchById(formData.rsd_id);
                await savePageResearch(formData.rsd_id);
                return { rsd_id: formData.rsd_id };
            }


        } catch (error) {
            console.error('Error saving research:', error);
            if (error.response) {
                console.error('Full error response:', error.response.data);
            }
            throw error; // Optionally, handle the error differently based on your needs
        }

    };

    const savePageResearch = async (rsdt_text) => {
        const researchSection = researchRef.current?.getResearchSections?.() || [];

        if (!rsdt_text) {
            console.error("rsdt_text is undefined! Cannot sync section.");
            return;
        }

        if (rsdt_text) {
            const sectionPayload = researchSection.map((section, index) => ({
                rsdt_id: section.rsdt_id || null,
                rsdt_text: rsdt_text,
                rsdt_order: section.rsdt_order,
                rsdt_type: section.rsdt_type,
                rsdt_code: section.rsdt_type + "-" + section.rsdt_id,
                active: section.active ?? 1,
            }));

            console.log("Payload is: ",sectionPayload);

            try {
                await axios.put(API_ENDPOINTS.syncRsdTitle, {
                    rsdt_text: rsdt_text,
                    research_title: sectionPayload,
                });

                // Fetch updated section IDs after sync
                // const updatedSectionRes = await axios.get(`${API_ENDPOINTS.getSection}?sec_page=${page_id}`);
                // const updatedSections = updatedSectionRes.data?.data || [];

                // const updatedSectionMap = updatedSections.reduce((acc, section) => {
                //     acc[`${section.sec_order}_${section.sec_type}`] = section.sec_id;
                //     return acc;
                // }, {});

                // for (const section of sections) {
                //     const resolvedSecId = updatedSectionMap[`${section.sec_order}_${section.sec_type}`] || section.sec_id;
                //     const resolvedPageId = section.sec_page || page_id;
                //     const handler = sectionSaveHandlers[section.sec_type];
                //     if (['New', 'Event', 'Announcement', 'Research', 'Faculty', 'Lab', 'Scholarship', 'Career', 'Partner', 'Feedback'].includes(section.sec_type)) {
                //         await saveHeaderSection(section.sec_type.toLowerCase(), resolvedSecId, resolvedPageId);
                //     } else if (handler) {
                //         await handler(resolvedSecId, resolvedPageId);
                //     } else {
                //         console.warn(`⚠️ No save handler defined for section type: ${section.sec_type} with order: ${section.sec_order}`);
                //     }
                // }

            } catch (error) {
                console.error("Failed to sync section:", error.response?.data || error.message);
            }
        }
    }

    const handleSave = async () => {
        try {
            await saveResearch();
            alert("Research saved successfully!");
        } catch (err) {
            if (err.response?.data?.errors) {
                console.log('Validation errors:', err.response.data.errors);
            } else {
                console.error('Full error:', err);
            }
        }
    };

    return (
        <div id="main-wrapper" className=" flex">
            <Aside />

            <div className=" w-full page-wrapper overflow-hidden">
                <ResearchFieldHeader onSave={handleSave} />
                <ResearchFieldBody
                    formData={formData}
                    onImageSelect={handleImageSelect}
                    setFormData={setFormData}
                    ref={researchRef}
                />
            </div>
        </div>
    )
}

export default ResearchField;
