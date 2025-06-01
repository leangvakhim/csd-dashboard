import React from 'react'
import Aside from '../Aside'
import CareerFieldHeader from './CareerFieldHeader'
import CareerFieldBody from './CareerFieldBody'
import { useState } from 'react'
import { API_ENDPOINTS, axiosInstance } from '../../service/APIConfig'
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Swal from 'sweetalert2'


const CareerField = () => {
    const [subtitleContent, setSubtitleContent] = useState('');
    const location = useLocation();
    const eventData = location.state?.eventData;
    const eventID = eventData?.data?.c_id;
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
        try {
            Swal.fire({
                title: 'Saving Career...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await saveCareer();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Career saved successfully.',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });

        } catch (error) {
            console.log('Unable to save career: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save career.',
            });
        }
    };

    const saveCareer = async () => {
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
                res = await axiosInstance.post(`${API_ENDPOINTS.updateCareer}/${formData.c_id}`, payload);
            } else {
                // Perform create
                const { c_order, ...createPayload } = payload;
                res = await axiosInstance.post(API_ENDPOINTS.createCareer, createPayload);
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
            const fetchEvent = async () => {
                try {
                    const response = await axiosInstance.get(`${API_ENDPOINTS.getCareer}/${eventID}`);
                    if (response.data && response.data.data) {
                        setFormData(response.data.data);
                        setSubtitleContent(response.data.data.c_detail || "");
                    }
                } catch (error) {
                    console.error("Failed to fetch news by ID:", error);
                }
            };
            fetchEvent();
        }
    }, [eventData]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            c_img: imageId,
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