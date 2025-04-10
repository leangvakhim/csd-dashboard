import React from 'react'
import Aside from '../Aside'
import PartnershipFieldHeader from './PartnershipFieldHeader'
import PartnershipFieldBody from './PartnershipFieldBody'
import { useState } from 'react'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios';
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';


const PartnershipField = () => {
    const location = useLocation();
    const eventData = location.state?.eventData;
    const [formData, setFormData] = useState({
        ps_title: '',
        ps_type: '',
        ps_img: '',
        ps_order: '',
        active: 1
    });

    useEffect(() => {
        if (eventData && eventData.data) {
            setFormData(eventData.data);
        }
    }, [eventData]);

    const handleSave = async () => {
        let res;
        const payload = {
            ps_title: formData.ps_title,
            ps_type: formData.ps_type,
            ps_order: formData.ps_order,
            ps_img: formData.ps_img,
            active: formData.active
        };

        try {
            if (formData.ps_id) {
                // Perform update
                res = await axios.post(`${API_ENDPOINTS.updatePartnership}/${formData.ps_id}`, payload);
            } else {
                // Perform create
                const { ps_order, ...createPayload } = payload;
                res = await axios.post(API_ENDPOINTS.createPartnership, createPayload);
            }
            alert("Partnership saved successfully!");
        } catch (err) {
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
        }
    };

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            ps_img: imageId,
        }));
    };
    return (
        <div id="main-wrapper" class=" flex">
            <Aside />

            <div class=" w-full page-wrapper overflow-hidden">
                <PartnershipFieldHeader onSave={handleSave} />
                <PartnershipFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    onImageSelect={handleImageSelect}
                />
            </div>
        </div>
    )
}

export default PartnershipField