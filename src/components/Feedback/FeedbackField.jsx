import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

import Aside from '../Aside';
import FeedbackFieldHeader from './FeedbackFieldHeader';
import FeedbackFieldBody from './FeedbackFieldBody';
import { API_ENDPOINTS } from '../../service/APIConfig';

const FeedBackField = () => {
    const location = useLocation();
    const eventData = location.state?.eventData;
    const [formData, setFormData] = useState({
        lang: 1,
        fb_title: '',
        fb_subtitle: '',
        fb_writer: '',
        fb_img: '',
        fb_order: '',
        active: 1,
        display: 1,
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (eventData && eventData.data) {
            setFormData(eventData.data);
        }
    }, [eventData]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
            const id = eventData?.data?.fb_id || formData?.fb_id;
            if (!id) return;

            const response = await axios.get(`${API_ENDPOINTS.getFeedback}/${id}`);
            setFormData(response.data.data);
            } catch (error) {
            console.error("Error fetching feedback data:", error);
            }
        };

        fetchFeedback();
    }, []);

    const handleSave = async () => {
        setLoading(true);

        Swal.fire({
            title: 'Saving feedback...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        const payload = {
            lang: formData.lang,
            fb_title: formData.fb_title,
            fb_subtitle: formData.fb_subtitle,
            fb_writer: formData.fb_writer,
            fb_img: formData.fb_img,
            fb_order: formData.fb_order,
            active: formData.active ? 1 : 0,
            display: formData.display ? 1 : 0,
        };

        try {
            let res;
            if (formData.fb_id) {
                res = await axios.post(`${API_ENDPOINTS.updateFeedback}/${formData.fb_id}`, payload);
            } else {
                const { fb_order, ...createPayload } = payload;
                res = await axios.post(API_ENDPOINTS.createFeedback, createPayload);
            }
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Feedback Saved',
                text: 'Your feedback has been successfully saved!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (err) {
            console.error("Error saving feedback:", err);
            if (err.response?.data?.errors) {
                console.error("Validation errors:", err.response.data.errors);
            }
            Swal.close();
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Something went wrong while saving feedback.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageSelect = (imageId) => {
        setFormData((prev) => ({
            ...prev,
            fb_img: imageId,
        }));
    };

    return (
        <div id="main-wrapper" className="flex">
            <Aside />
            <div className="w-full page-wrapper overflow-hidden">
                <FeedbackFieldHeader onSave={handleSave} loading={loading} />
                <FeedbackFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    onImageSelect={handleImageSelect}
                />
            </div>
        </div>
    );
};

export default FeedBackField;
