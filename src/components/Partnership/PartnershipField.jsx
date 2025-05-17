import React from 'react'
import Aside from '../Aside'
import PartnershipFieldHeader from './PartnershipFieldHeader'
import PartnershipFieldBody from './PartnershipFieldBody'
import { useState } from 'react'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios';
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

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
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (formData.ps_id) {
                // Perform update
                res = await axios.post(`${API_ENDPOINTS.updatePartnership}/${formData.ps_id}`, payload);
            } else {
                // Perform create
                const { ps_order, ...createPayload } = payload;
                res = await axios.post(API_ENDPOINTS.createPartnership, createPayload);
            }

            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Partnership saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (err) {
            Swal.close();
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Error saving partnership data.'
            });
        }
    };

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            ps_img: imageId,
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