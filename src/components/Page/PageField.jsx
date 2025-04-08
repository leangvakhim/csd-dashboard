import React, { useState, useEffect } from 'react'
import PageFieldHeader from './PageFieldHeader'
import PageFieldBody from './PageFieldBody'
import Aside from '../Aside'
import axios from 'axios'
import { API_ENDPOINTS } from '../../service/APIConfig'
import { useLocation } from 'react-router-dom'

const PageField = () => {
    const location = useLocation();
    const pageData = location.state?.pageData;
    const [formData, setFormData] = useState({
        p_title: '',
        p_alias: '',
        p_busy: 0,
        p_menu: null,
        display: false
    });
    const pageRef = React.useRef();

    useEffect(() => {
        if (pageData && pageData.data) {
            setFormData(pageData.data);
        }
    }, [pageData]);

    const savePage = async () => {
        const payload = {
            p_title: formData.p_title || '',
            p_alias: formData.p_alias || '',
            p_busy: !!formData.p_busy,
            display: !!formData.display,
            active: true,
            menu_id: formData.p_menu ?? null
        };

        console.log("🟡 Payload to send:", payload);

        try {
            let response;
            if (formData.p_id) {
                response = await axios.post(`${API_ENDPOINTS.updatePage}/${formData.p_id}`, payload);
                // console.log("✅ Page updated:", response.data);
            } else {
                response = await axios.post(API_ENDPOINTS.createPage, payload);
                // console.log("✅ Page created:", response.data);
            }

            const savedPageId = response.data?.data?.p_id;
            const sections = pageRef.current?.getSections?.() || [];
            console.log(sections);

            // if (sections.length > 0 && savedPageId) {
            if (sections.length > 0 && savedPageId) {
                for (const section of sections) {
                    const sectionPayload = {
                        sec_page: savedPageId,
                        sec_order: section.sec_order,
                        lang: section.lang,
                        display: section.display ?? 0,
                        active: section.active ?? 1
                    };

                    await axios.post(API_ENDPOINTS.createSection, sectionPayload);
                    console.log("📦 Section saved:", sectionPayload);
                }
            }

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
                />
            </div>
        </div>
    )
}

export default PageField