import React, { useState, useEffect, useRef } from 'react'
import PageFieldHeader from './PageFieldHeader'
import PageFieldBody from './PageFieldBody'
import Aside from '../Aside'
import axios from 'axios'
import { API_ENDPOINTS } from '../../service/APIConfig'
import { useLocation } from 'react-router-dom'

const PageField = () => {
    const location = useLocation();
    const pageData = location.state?.pageData;
    const pageRef = useRef();
    const [formData, setFormData] = useState({
        p_title: '',
        p_alias: '',
        p_busy: 0,
        p_menu: null,
        display: false
    });

    useEffect(() => {
        if (pageData && pageData.data) {
            setFormData(pageData.data);
        }
    }, [pageData]);

    const saveDepartment = async (savedSectionId) => {
        const programs = await pageRef.current?.getPrograms?.() || [];

        if (programs.length > 0 && savedSectionId) {
            const programPayload = programs.map((program) => ({
                dep_sec: savedSectionId,
                dep_title: program.dep_title || '',
                dep_detail: program.dep_detail || '',
                dep_img1: program.dep_img1 || null,
                dep_img2: program.dep_img2 || null,
            }));

            // console.log("🎓 Programs sent as array:", programPayload);
            await axios.post(API_ENDPOINTS.createDepartment, { programs: programPayload });
        }
    }

    const saveSection = async (savedPageId) => {
        const sections = pageRef.current?.getSections?.() || [];

        if (sections.length > 0 && savedPageId) {
            const sectionPayload = sections.map((section, index) => ({
                sec_page: savedPageId,
                sec_order: section.sec_order,
                lang: section.lang,
                display: section.display ?? 0,
                active: section.active ?? 1,
            }));

            const response = await axios.post(API_ENDPOINTS.createSection, { sections: sectionPayload });
            // console.log("📦 Sections sent as array:", sectionPayload);

            const savedSectionId = Array.isArray(response.data?.data)
                ? response.data.data[0]?.sec_id
                : response.data?.data?.sec_id;

            // console.log("📥 savedSectionId:", savedSectionId);

            saveDepartment(savedSectionId);
        }
    };

    const savePage = async () => {
        const payload = {
            p_title: formData.p_title || '',
            p_alias: formData.p_alias || '',
            p_busy: !!formData.p_busy,
            display: !!formData.display,
            active: true,
            menu_id: formData.p_menu ?? null
        };

        // console.log("🟡 Payload to send:", payload);

        try {
            let response;
            if (formData.p_id) {
                response = await axios.post(`${API_ENDPOINTS.updatePage}/${formData.p_id}`, payload);
            } else {
                response = await axios.post(API_ENDPOINTS.createPage, payload);
            }

            const savedPageId = response.data?.data?.p_id;

            saveSection(savedPageId);

        } catch (error) {
            console.error('❌ Failed to save page or sections:', error.response?.data || error.message);
            throw error;
        }
    }

    const handleSave = async () => {
        try{
            await savePage();
            alert("Page save successfully");
        } catch (err) {
            console.error(" Error saving:", err);
        }
    };

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <PageFieldHeader onSave={handleSave}/>
                <PageFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    ref={pageRef}
                    pageData={formData}
                />
            </div>
        </div>
    )
}

export default PageField