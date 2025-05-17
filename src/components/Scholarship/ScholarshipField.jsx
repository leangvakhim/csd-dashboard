import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Aside from '../Aside';
import ScholarshipFieldHeader from './ScholarshipFieldHeader';
import ScholarshipFieldBody from './ScholarshipFieldBody';
import { API_ENDPOINTS } from '../../service/APIConfig';
import Swal from 'sweetalert2';

const ScholarshipField = () => {
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const eventData = location.state?.eventData;

    const [formData, setFormData] = useState({
        lang: 1,
        sc_sponsor: '',
        sc_title: '',
        sc_shortdesc: '',
        sc_detail: '',
        sc_deadline: '',
        sc_postdate: '',
        sc_img: '',
        scletter_img: '',
        sc_fav: '',
        sc_orders: '',
        ref_id: null,
        active: 1,
        display: 1,
    });

    useEffect(() => {
        if (eventData && eventData.data) {
            setFormData(eventData.data);
        }
    }, [eventData]);

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving Scholarship...',
                allowOutsideClick: false,
                backdrop: true,
                didOpen: () => {
                    Swal.showLoading();
                },
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-gray-700',
                    confirmButton: 'bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded'
                }
            });

            await saveScholarship()

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Scholarship saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-green-600'
                },
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save scholarship.',
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-red-600'
                }
            });

            if (err.response?.data?.errors) {
                console.log('Validation errors:', err.response.data.errors);
            } else {
                console.error('Full error:', err);
            }
        }
    };

    const saveScholarship = async () => {
        const payload = {
            lang: formData.lang,
            sc_sponsor: formData.sc_sponsor,
            sc_title: formData.sc_title,
            sc_shortdesc: formData.sc_shortdesc,
            sc_detail: formData.sc_detail,
            sc_deadline: formData.sc_deadline,
            sc_postdate: formData.sc_postdate,
            sc_img: formData.sc_img,
            scletter_img: formData.scletter_img,
            ref_id: parseInt(formData.ref_id) || null,
            sc_fav: 1,
            sc_orders: formData.sc_orders,
            active: formData.active ? 1 : 0,
            display: formData.display ? 1 : 0,
        };

        try {
            let res;
            if (formData.sc_id) {
                // Update existing scholarship
                res = await axios.post(`${API_ENDPOINTS.updateScholarship}/${formData.sc_id}`, payload);
                console.log('Update response:', res.data);
            } else {
                // Create new scholarship
                res = await axios.post(API_ENDPOINTS.createScholarship, payload);
                console.log('Create response:', res.data);
            }
        } catch (err) {
            console.error("Error saving scholarship:", err);
            if (err.response?.data?.errors) {
                console.error("Validation errors:", err.response.data.errors);
            }
            alert("Failed to save scholarship. Check console for details.");
        }
    }

    const handleImageSelect = (imageId, type = 'sc_img') => {
        setFormData(prev => ({
            ...prev,
            [type]: imageId,
        }));
    };

    return (
        <div id="main-wrapper" className="flex">
            <Aside />
            <div className="w-full page-wrapper overflow-hidden">
                <ScholarshipFieldHeader onSave={handleSave} loading={loading} />
                <ScholarshipFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    onImageSelect={handleImageSelect}
                />
            </div>
        </div>
    );
};

export default ScholarshipField;
