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
        f_name: null,
        f_position: null,
        f_portfolio: null,
        display: true,
        f_img: null,
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
        const isUpdate = !!formData.f_id;
        const payload = {
            lang: formData.lang,
            rsd_title: formData.rsd_title || '',
            rsd_subtitle: formData.rsd_subtitle || '',
            rsd_lead: formData.rsd_lead || '',
            f_img: formData.f_img || null,
            display: formData.display ? 1 : 0,
            active: formData.active ? 1 : 0,
        };

        if (!isUpdate) {
            const res = await axios.post(API_ENDPOINTS.createFaculty, payload);
            const createdFaculty = res.data.data;
            setFormData(prev => ({
                ...prev,
                f_id: createdFaculty.f_id
            }));
            return createdFaculty;
        } else {
            await axios.post(`${API_ENDPOINTS.updateFaculty}/${formData.f_id}`, payload);
            return { f_id: formData.f_id };
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
                />
            </div>
        </div>
    )
}

export default ResearchField