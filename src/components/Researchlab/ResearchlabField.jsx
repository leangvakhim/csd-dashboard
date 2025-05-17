import React, { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Aside from '../Aside';
import ResearchlabFieldHeader from './ResearchlabFieldHeader';
import ResearchlabFieldBody from './ResearchlabFieldBody';
import { API_ENDPOINTS } from '../../service/APIConfig';

const ResearchlabField = () => {
    const researchlabTagRef = useRef();
    const location = useLocation();
    const researchlabData = location.state?.researchlabData;
    const rsdlID = researchlabData?.data.rsdl_id;
    const [formData, setFormData] = useState({
        lang: 1,
        rsdl_title: '',
        rsdl_fav: 1,
        rsdl_detail: '',
        rsdl_img: '',
        rsdl_order: '',
        ref_id: null,
        active: 1,
        display: true,
    });

    useEffect(() => {
        if (rsdlID) {
            axios.get(`${API_ENDPOINTS.getResearchlab}/${rsdlID}`)
                .then(res => {
                    if (res.data && res.data.data) {
                        setFormData(res.data.data);
                    }
                })
                .catch(err => {
                    console.error("Failed to fetch researchlab data by ID:", err);
                });
        }
    }, [researchlabData]);

    useEffect(() => {
        const fetchResearchlabTags = async () => {
            if (formData.rsdl_id && researchlabTagRef.current?.setData) {
                try {
                    const res = await axios.get(`${API_ENDPOINTS.getResearchlabTag}/${formData.rsdl_id}`);
                    const tagList = (res.data.data || []).map(item => ({
                        ...item,
                        rsdlt_id: item.rsdlt_id ?? item.id,
                    }));
                    researchlabTagRef.current.setData(tagList);
                } catch (err) {
                    console.error("Failed to fetch researchlab tags:", err);
                }
            }
        };
        fetchResearchlabTags();
    }, [formData.rsdl_id]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            rsdl_img: imageId,
        }));
    };

    const getImageIdByUrl = async (url) => {
        try {
            const response = await axios.get(API_ENDPOINTS.getImages);
            const images = Array.isArray(response.data) ? response.data : response.data.data;

            const matchedImage = images.find((img) => img.image_url === url);
            return matchedImage?.image_id || null;
        } catch (error) {
            console.error('❌ Failed to fetch image ID:', error);
            return null;
        }
    };

    const saveResearchlab = async () => {
        const isUpdate = !!formData.rsdl_id;
        const payload = {
            lang: formData.lang,
            rsdl_title: formData.rsdl_title || '',
            rsdl_fav: 1,
            rsdl_detail: formData.rsdl_detail || '',
            rsdl_img: isNaN(formData.rsdl_img)
                ? await getImageIdByUrl(formData.rsdl_img) || null
                : formData.rsdl_img,
            rsdl_order: formData.rsdl_order || 0,
            ref_id: parseInt(formData.ref_id) || null,
            display: formData.display ? 1 : 0,
            active: formData.active ? 1 : 0,
        };

        if (!isUpdate) {
            const res = await axios.post(API_ENDPOINTS.createResearchlab, payload);
            const createdResearchlab = res.data.data;
            setFormData(prev => ({
                ...prev,
                rsdl_id: createdResearchlab.rsdl_id,
            }));
            return { rsdl_id: createdResearchlab.rsdl_id };
        } else {
            await axios.post(`${API_ENDPOINTS.updateResearchlab}/${formData.rsdl_id}`, payload);
            return { rsdl_id: formData.rsdl_id };
        }
    };


    const saveResearchlabTags = async (rsdl_id) => {
        if (!rsdl_id || isNaN(rsdl_id) || rsdl_id === 'undefined') {
            console.warn("⛔ Cannot save tags: invalid or missing researchlab ID:", rsdl_id);
            return;
        }

        const tagData = researchlabTagRef.current?.getData?.() || [];

        const seen = new Set();
        const filteredTags = Array.isArray(tagData)
            ? tagData.filter(item => {
                const key = `${item.rsdlt_title}-${item.rsdlt_id}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return item.rsdlt_title;
            })
            : [];

        let allTags = [];
        try {
            const res = await axios.get(API_ENDPOINTS.getResearchlabTag);
            allTags = res.data?.data || [];
        } catch (error) {
            console.error("❌ Failed to fetch all researchlab tags:", error);
            return;
        }

        const existingTags = allTags.filter(tag => tag.rsdlt_rsdl === rsdl_id);

        for (const item of filteredTags) {
            const payload = {
                rsdlt_title: item.rsdlt_title,
                rsdlt_img: item.rsdlt_img_id || null,
                rsdlt_rsdl: rsdl_id,
            };

            try {
                if (item.rsdlt) {
                    const res = await axios.get(`${API_ENDPOINTS.getResearchlabTag}/${item.rsdlt}`);
                    const existing = res.data?.data;

                    if (existing && existing.rsdlt_rsdl == rsdl_id) {
                        await axios.post(`${API_ENDPOINTS.updateResearchlabTag}/${item.rsdlt}`, { rsdlt_tags: [payload] });
                    } else {
                        console.warn("Updating skipped due to mismatched rsdl_id. Creating new tag instead.");
                        await axios.post(API_ENDPOINTS.createResearchlabTag, { rsdl_id, rsdlt_tags: [payload] });
                    }
                } else {
                    const alreadyExists = existingTags.some(t => t.rsdlt_title === item.rsdlt_title);

                    if (!alreadyExists) {
                        await axios.post(API_ENDPOINTS.createResearchlabTag, { rsdl_id, rsdlt_tags: [payload] });
                    } else {
                        console.log("Duplicate tag skipped:", item.rsdlt_title);
                    }
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    await axios.post(API_ENDPOINTS.createResearchlabTag, { rsdl_id, rsdlt_tags: [payload] });
                } else {
                    console.error("❌ Error saving tag:", error);
                }
            }
        }
    };

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
            });

            const { rsdl_id } = await saveResearchlab();
            setFormData(prev => ({ ...prev, rsdl_id }));

            setTimeout(() => {
                saveResearchlabTags(rsdl_id);
            }, 0);

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Research lab saved successfully!',
                showConfirmButton: false,
                timer: 1500,
                willClose: () => {
                    window.location.reload();
                }
            });
        } catch (err) {
            console.error('Error saving research lab:', err);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to save research lab. Please try again.',
            });
        }
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
            <div className="w-full page-wrapper overflow-hidden">
                <ResearchlabFieldHeader onSave={handleSave} />
                <ResearchlabFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    researchlabTagRef={researchlabTagRef}
                    onImageSelect={handleImageSelect}
                    initialResearchlabTagData={researchlabTagRef.current?.getData?.()}
                />
            </div>
        </div>
    );
};

export default ResearchlabField;