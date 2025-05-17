import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';
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
        ref_id: null,
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
            rsd_fav: parseInt(1),
            ref_id: parseInt(formData.ref_id) || null,
            rsd_img: formData.rsd_img || undefined,
            display: formData.display ? 1 : 0,
        };

        try {
            if (!isUpdate) {
                const res = await axios.post(API_ENDPOINTS.createResearch, payload);
                const createdResearch = res.data.data;
                await fetchResearchById(createdResearch.rsd_id);
                // await savePageResearch(createdResearch.rsd_id);
                return createdResearch;
            } else {
                const res = await axios.post(`${API_ENDPOINTS.updateResearch}/${formData.rsd_id}`, payload);
                await fetchResearchById(formData.rsd_id);
                // await savePageResearch(formData.rsd_id);
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

    const saveDescription = async (savedSectionId, savedRsdId) => {
        const descriptions = await researchRef.current?.getDescriptions?.() || [];
        const filtered = descriptions.filter(desc => parseInt(desc.rsdd_rsdtile) === parseInt(savedSectionId));

        if (filtered.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(`${API_ENDPOINTS.getRsdDescription}?rsdd_rsdtile=${savedSectionId}`);
            const existingItems = existingResponse.data?.data || [];
            const existingIds = existingItems.map(slide => slide.rsdd_id);
            for (const description of filtered) {

                const descriptionPayload = {
                    rsdd_rsdtile: savedSectionId,
                    rsdd_title: description.rsdd_title || '',
                    rsdd_details: description.rsdd_details || '',
                    rsdId: savedRsdId,
                };

                if(
                    description.rsdd_id &&
                    existingIds.includes(parseInt(description.rsdd_id)) &&
                    parseInt(description.rsdd_rsdtile) === parseInt(savedSectionId) &&
                    parseInt(description.rsdId) === parseInt(savedRsdId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateRsdDescription}/${description.rsdd_id}`, { research_desc: descriptionPayload });
                } else {
                    if (description.rsdd_rsdtile) {
                        if (!description.rsdd_id || !existingIds.includes(parseInt(description.rsdd_id))) {
                            await axios.post(API_ENDPOINTS.createRsdDescription, { research_desc: [descriptionPayload] });
                        }
                    }
                }
            }
        }
    };

    const saveProject = async (savedSectionId, savedRsdId) => {
        const projects = await researchRef.current?.getProjects?.() || [];
        const filtered = projects.filter(desc => parseInt(desc.rsdp_rsdtile) === parseInt(savedSectionId));

        if (filtered.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(`${API_ENDPOINTS.getRsdProject}?rsdp_rsdtile=${savedSectionId}`);
            const existingItems = existingResponse.data?.data || [];
            const existingIds = existingItems.map(slide => slide.rsdp_id);
            for (const project of filtered) {

                const projectPayload = {
                    rsdp_rsdtile: savedSectionId,
                    rsdp_title: project.rsdp_title || '',
                    rsdp_detail: project.rsdp_detail || '',
                    rsdId: savedRsdId,
                };

                if(
                    project.rsdp_id &&
                    existingIds.includes(parseInt(project.rsdp_id)) &&
                    parseInt(project.rsdp_rsdtile) === parseInt(savedSectionId) &&
                    parseInt(project.rsdId) === parseInt(savedRsdId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateRsdProject}/${project.rsdp_id}`, { research_project: projectPayload });
                } else {
                    if (project.rsdp_rsdtile) {
                        if (!project.rsdp_id || !existingIds.includes(parseInt(project.rsdp_id))) {
                            await axios.post(API_ENDPOINTS.createRsdProject, { research_project: [projectPayload] });
                        }
                    }
                }
            }
        }
    };

    const reorderSection = async () => {
        const researchSection = researchRef.current?.getResearchSections?.() || [];

        const sectionPayload = researchSection.map((section, index) => ({
            rsdt_id: section.rsdt_id,
            rsdt_order: index + 1
        }));

        try {
            await axios.post(API_ENDPOINTS.updateResearchTitleOrder, sectionPayload);
        } catch (error) {
            console.error("❌ Failed to reorder section:", error.response?.data || error.message);
        }
    };

    const saveMeeting = async (savedSectionId, savedRsdId) => {
        const meetings = await researchRef.current?.getMeetings?.() || [];
        const filtered = meetings.filter(desc => parseInt(desc.rsdm_rsdtitle) === parseInt(savedSectionId));

        if (filtered.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(`${API_ENDPOINTS.getRsdMeeting}?rsdm_rsdtitle=${savedSectionId}`);
            const existingItems = existingResponse.data?.data || [];
            const existingIds = existingItems.map(slide => slide.rsdm_id);
            for (const meeting of filtered) {

                const meetingtPayload = {
                    rsdm_rsdtitle: savedSectionId,
                    rsdm_title: meeting.rsdm_title || '',
                    rsdm_img: meeting.rsdm_img || '',
                    rsdm_detail: meeting.rsdm_detail || '',
                    rsdId: savedRsdId,
                };

                if(
                    meeting.rsdm_id &&
                    existingIds.includes(parseInt(meeting.rsdm_id)) &&
                    parseInt(meeting.rsdm_rsdtitle) === parseInt(savedSectionId) &&
                    parseInt(meeting.rsdId) === parseInt(savedRsdId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateRsdMeeting}/${meeting.rsdm_id}`, { research_meet: meetingtPayload });
                } else {
                    if (meeting.rsdm_rsdtitle) {
                        if (!meeting.rsdm_id || !existingIds.includes(parseInt(meeting.rsdm_id))) {
                            await axios.post(API_ENDPOINTS.createRsdMeeting, { research_meet: [meetingtPayload] });
                        }
                    }
                }
            }
        }
    };

    const sectionSaveHandlers = {
        Description: saveDescription,
        Project: saveProject,
        Meeting: saveMeeting,
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
                rsdt_code: section.rsdt_code || `${section.rsdt_type}-${section.rsdt_id || 'new'}`,
                active: section.active ?? 1,
            }));

            try {
                await axios.put(API_ENDPOINTS.syncRsdTitle, {
                    rsdt_text: rsdt_text,
                    research_title: sectionPayload,
                });

                await reorderSection();

                // Fetch updated section IDs after sync
                const updatedSectionRes = await axios.get(`${API_ENDPOINTS.getResearchTitle}?rsdt_text=${rsdt_text}`);
                const updatedSections = updatedSectionRes.data?.data || [];

                const updatedSectionMap = updatedSections.reduce((acc, section) => {
                    acc[`${section.rsdt_order}_${section.rsdt_type}`] = section.rsdt_id;
                    return acc;
                }, {});

                for (const section of researchSection) {
                    const resolvedSecId = updatedSectionMap[`${section.rsdt_order}_${section.rsdt_type}`] || section.rsdt_id;
                    const resolvedRsdId = section.rsdt_text || rsdId;
                    const handler = sectionSaveHandlers[section.rsdt_type];
                    if (handler) {
                        await handler(resolvedSecId, resolvedRsdId);
                    } else {
                        console.warn(`⚠️ No save handler defined for section type: ${section.rsdt_type} with order: ${section.rsdt_order}`);
                    }
                }

            } catch (error) {
                console.error("Failed to sync section:", error.response?.data || error.message);
            }
        }
    }

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving Research...',
                allowOutsideClick: false,
                backdrop: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-gray-700',
                    confirmButton: 'bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded'
                }
            });

            // await saveResearch();
            await saveResearch().then((res) => {
            const savedId = res?.rsd_id;
                if (savedId) {
                    savePageResearch(savedId);
                }
            });

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Research saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-green-600'
                },
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save research.',
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-red-600'
                }
            });

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
