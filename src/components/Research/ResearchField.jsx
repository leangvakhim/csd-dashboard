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
        rsd_title: null,
        rsd_img: null,
        rsd_subtitle: null,
        rsd_lead: null,
        rsd_fav: null,
        rsd_order: 1,
        display: true,
        active: 1,
    });

    useEffect(() => {
        if (researchData && researchData.data) {
            setFormData(researchData.data);
        }
    }, [researchData]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            rsd_img: imageId,
        }));
    };

    const saveResearch = async () => {
        const isUpdate = !!formData.rsd_id;
        const payload = {
            lang: formData.lang,
            rsd_title: formData.rsd_title || '',
            rsd_subtitle: formData.rsd_subtitle || '',
            rsd_lead: formData.rsd_lead || '',
            rsd_fav: formData.rsd_fav || null,
            rsd_img: formData.rsd_img,
            rsd_order: formData.rsd_order,
            display: formData.display ? 1 : 0,
            active: formData.active ? 1 : 0,
        };

        if (!isUpdate) {
            const res = await axios.post(API_ENDPOINTS.createResearch, payload);
            const createdResearch = res.data.data;
            setFormData(prev => ({
                ...prev,
                rsd_id: createdResearch.rsd_id
            }));
            return createdResearch;
        } else {
            await axios.post(`${API_ENDPOINTS.updateResearch}/${formData.rsd_id}`, payload);
            return { rsd_id: formData.rsd_id };
        }
    };

    const handleSave = async () => {
        try {
            await saveResearch();
            alert("Research saved successfully!");
        } catch (err) {
            if (err.response?.data?.errors) {
                console.log('Validation errors:', err.response.data.errors);
            } else {
                console.log('Full error:', err);
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
                    researchRef={researchRef}
                />
            </div>
        </div>
    )
}

export default ResearchField