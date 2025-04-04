import React from 'react'
import Aside from '../Aside'
import NewsFieldHeader from './NewsFieldHeader'
import NewsFieldBody from './NewsFieldBody'
import { useState } from 'react'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NewsField = () => {
    const [subtitleContent, setSubtitleContent] = useState('');
    const location = useLocation();
    const eventData = location.state?.eventData;
    const [formData, setFormData] = useState({
        lang: 1,
        n_title: null,
        n_shorttitle: null,
        n_tags: null,
        display: true,
        n_date: null,
        n_fav: true,
        active: 1,
    });

    const handleSave = async () => {
        let res;
        const payload = {
            lang: formData.lang,
            n_title: formData.n_title || '',
            n_shorttitle: formData.n_shorttitle || '',
            n_tags: formData.n_tags || '',
            n_date: formData.n_date || null,
            n_fav: formData.n_fav ? 1 : 0,
            n_img: formData.n_img || null,
            display: formData.display ? 1 : 0,
            n_detail: subtitleContent || '',
            active: formData.active ? 1 : 0
        };

        try {
            if (formData.n_id) {
                // Perform update
                res = await axios.post(`${API_ENDPOINTS.updateNews}/${formData.n_id}`, payload);
            } else {
                // Perform create
                const { n_order, ...createPayload } = payload;
                res = await axios.post(API_ENDPOINTS.createNews, createPayload);
            }
            alert("News saved successfully!");
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
            setSubtitleContent(eventData.data.n_detail || "");
        }
    }, [eventData]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            n_img: imageId,
        }));
    };
    return (
        <div id="main-wrapper" class=" flex">
            <Aside />

            <div class=" w-full page-wrapper overflow-hidden">
                <NewsFieldHeader onSave={handleSave}/>
                <NewsFieldBody
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

export default NewsField