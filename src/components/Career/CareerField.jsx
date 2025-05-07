import React from 'react'
import Aside from '../Aside'
import CareerFieldHeader from './CareerFieldHeader'
import CareerFieldBody from './CareerFieldBody'
import { useState } from 'react'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';


const CareerField = () => {
    const [subtitleContent, setSubtitleContent] = useState('');
    const location = useLocation();
    const eventData = location.state?.eventData;
    const [formData, setFormData] = useState({
        lang: 1,
        c_title: null,
        c_shorttitle: null,
        display: true,
        c_date: null,
        c_fav: true,
        ref_id: null,
        active: 1,
    });

    const handleSave = async () => {
        let res;
        const payload = {
            lang: formData.lang,
            c_title: formData.c_title || '',
            c_shorttitle: formData.c_shorttitle || '',
            c_date: formData.c_date || null,
            c_fav: 1,
            c_img: formData.c_img || null,
            display: formData.display ? 1 : 0,
            ref_id: parseInt(formData.ref_id) || null,
            c_detail: subtitleContent || '',
            active: formData.active ? 1 : 0
        };

        try {
            if (formData.c_id) {
                // Perform update
                res = await axios.post(`${API_ENDPOINTS.updateCareer}/${formData.c_id}`, payload);
            } else {
                // Perform create
                const { c_order, ...createPayload } = payload;
                res = await axios.post(API_ENDPOINTS.createCareer, createPayload);
            }
            alert("Career saved successfully!");
        } catch (err) {
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
        }
    };

    useEffect(() => {
        if (eventData && eventData.data) {
            setFormData(eventData.data);
            setSubtitleContent(eventData.data.c_detail || "");
        }
    }, [eventData]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            c_img: imageId,
        }));
    };
    return (
        <div id="main-wrapper" class=" flex">
            <Aside />

            <div class=" w-full page-wrapper overflow-hidden">
                <CareerFieldHeader onSave={handleSave}/>
                <CareerFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    subtitleContent={subtitleContent}
                    setSubtitleContent={setSubtitleContent}
                    onImageSelect={handleImageSelect}
                />
            </div>
        </div>
    )
}

export default CareerField