import React from 'react'
import Swal from 'sweetalert2';
import Aside from '../Aside'
import NewsFieldHeader from './NewsFieldHeader'
import NewsFieldBody from './NewsFieldBody'
import { useState } from 'react'
import { API_ENDPOINTS, axiosInstance } from '../../service/APIConfig'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NewsField = () => {
    const [subtitleContent, setSubtitleContent] = useState('');
    const location = useLocation();
    const eventData = location.state?.eventData;
    const newID = eventData?.data.n_id;
    const [formData, setFormData] = useState({
        lang: 1,
        n_title: null,
        n_shorttitle: null,
        n_tags: null,
        display: true,
        n_date: null,
        n_fav: true,
        ref_id: null,
        active: 1,
    });

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            await saveNews();

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'News saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (error) {
            console.error("Error saving:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save news. Please try again.',
            });
        }
    };

    const saveNews = async () => {
        let res;
        const payload = {
            lang: formData.lang,
            n_title: formData.n_title || '',
            n_shorttitle: formData.n_shorttitle || '',
            n_tags: formData.n_tags || '',
            n_date: formData.n_date || null,
            n_fav: 1,
            n_img: formData.n_img || null,
            ref_id: parseInt(formData.ref_id) || null,
            display: formData.display ? 1 : 0,
            n_detail: subtitleContent || '',
            active: formData.active ? 1 : 0
        };

        try {
            if (formData.n_id) {
                // Perform update
                res = await axiosInstance.post(`${API_ENDPOINTS.updateNews}/${formData.n_id}`, payload);
            } else {
                // Perform create
                const { n_order, ...createPayload } = payload;
                res = await axiosInstance.post(API_ENDPOINTS.createNews, createPayload);
            }
        } catch (err) {
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
        }
    }

    useEffect(() => {
        if (eventData && eventData.data) {
            const fetchNews = async () => {
                try {
                    const response = await axiosInstance.get(`${API_ENDPOINTS.getNews}/${newID}`);
                    if (response.data && response.data.data) {
                        setFormData(response.data.data);
                        setSubtitleContent(response.data.data.n_detail || "");
                    }
                } catch (error) {
                    console.error("Failed to fetch news by ID:", error);
                }
            };
            fetchNews();
        }

    }, [eventData]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            n_img: imageId,
        }));
    };
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
        setUsername(storedUsername);
        }
    }, []);

    return (
        <div id="main-wrapper" className=" flex">
            <Aside username={username}/>

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