import React, { useState, useEffect, useRef } from 'react';
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
    const [formData, setFormData] = useState({
        lang: 1,
        rsdl_title: '',
        rsdl_fav: '0',
        rsdl_detail: '',
        rsdl_img: '',
        rsdl_order: '',
        active: 1,
        display: 1,
    });

    useEffect(() => {
        if (researchlabData && researchlabData.data) {
            setFormData(researchlabData.data);
        }
    }, [researchlabData]);

    useEffect(() => {
        const fetchResearchlabTags = async () => {
            if (formData.rsdl_id && researchlabTagRef.current?.setData) {
                try {
                    const res = await axios.get(`${API_ENDPOINTS.getResearchlabTag}/${formData.rsdl_id}`);
                    const tagList = (res.data.data || []).map(item => ({
                        ...item,
                        rsdlt_id: item.rsdlt_id ?? item.id
                    }));
                    researchlabTagRef.current.setData(tagList);
                } catch (err) {
                    console.error("Failed to fetch researchlab tags:", err);
                }
            }
        };
        fetchResearchlabTags();
    }, [formData.rsdl_id]);

    console.log("researchlab id error",formData.rsdl_id)


    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            rsdl_img: imageId,
        }));
    };

    const saveResearchlab = async (imageId) => {
        const isUpdate = !!formData.rsdl_id;
        const payload = {
            lang: formData.lang,
            rsdl_title: formData.rsdl_title || '',
            rsdl_fav: formData.rsdl_fav || '0',
            rsdl_detail: formData.rsdl_detail || '',
            rsdl_img: imageId || null,
            rsdl_order: formData.rsdl_order,
            display: formData.display ? 1 : 0,
            active: formData.active ? 1 : 0,
        };

        console.log(payload);

        if (!isUpdate) {
            const res = await axios.post(API_ENDPOINTS.createResearchlab, payload);
            const createdResearchlab = res.data.data;
            setFormData(prev => ({
                ...prev,
                rsdl_id: createdResearchlab.rsdl_id
            }));
            return { rsdl_id: createdResearchlab.rsdl_id };
        } else {
            await axios.post(`${API_ENDPOINTS.updateResearchlab}/${formData.rsdl_id}`, payload);
            return { rsdl_id: formData.rsdl_id };
        }
    };

    const saveResearchlabTags = async (rsdl_id) => {
        try {
            if (!rsdl_id) {
                console.warn("Cannot save tags: missing researchlab ID.");
                return;
            }
    
            const tagData = researchlabTagRef.current?.getData?.() || [];
    
            // Remove duplicates
            const seen = new Set();
            const filteredTags = Array.isArray(tagData)
                ? tagData.filter(item => {
                    const key = `${item.rsdlt_title}-${item.rsdlt_img}`;
                    if (seen.has(key)) return false;
                    seen.add(key);
                    return item.rsdlt_title;
                })
                : [];
    
            
    
            const newTags = filteredTags.filter(item => typeof item.rsdlt_id !== 'number').map(item => ({
                rsdlt_title: item.rsdlt_title,
                rsdlt_img: item.rsdlt_img,
                active: item.active ?? 1
            }));
            // Update existing tags
            for (const item of filteredTags.filter(item => typeof item.rsdlt_id === 'number')) {
                try {
                    const payload = {
                        rsdlt_title: item.rsdlt_title,
                        rsdlt_img: item.rsdlt_img,
                        active: item.active ?? 1,
                        rsdlt_rsdl: rsdl_id,
                    };
                    await axios.post(`${API_ENDPOINTS.updateResearchlabTag}/${item.rsdlt_id}`, payload, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                } catch (error) {
                    console.error(`Failed to update tag ${item.rsdlt_id}:`, error.response?.data || error.message);
                }
            }
    
            // Create new tags
            if (newTags.length > 0) {
                try {
                    const createPayload = {
                        rsdl_id,
                        rsdlt_tags: newTags
                    };
                    console.log('Creating tags with payload:', createPayload);
                    
                    const response = await axios.post(API_ENDPOINTS.createResearchlabTag, createPayload, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });
                    
                    console.log('Create tags response:', response.data);
                } catch (error) {
                    console.error('Failed to create new tags:', {
                        error: error.response?.data || error.message,
                        request: error.config?.data
                    });
                    throw error; // Re-throw if you want calling code to handle it
                }
            }
    
            // Reorder tags
            const reorderPayload = filteredTags
                .filter(item => typeof item.rsdlt_id === 'number')
                .map(item => ({
                    rsdlt_id: item.rsdlt_id,
                    order: item.rsdlt_order || 0,
                }));
    
            if (reorderPayload.length > 0) {
                try {
                    await axios.post(API_ENDPOINTS.updateResearchlabTagOrder, reorderPayload, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                        },
                    });
                } catch (error) {
                    console.error('Failed to reorder tags:', error.response?.data || error.message);
                }
            }
        } catch (error) {
            console.error('Unexpected error in saveResearchlabTags:', error);
            throw error;
        }
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

    const handleSave = async () => {
        try {
            const imageId = await getImageIdByUrl(formData.rsdl_img);
            const res = await saveResearchlab(imageId); // Pass imageId directly
            const newId = res.rsdl_id;

            setFormData(prev => ({
                ...prev,
                rsdl_id: newId,
                rsdl_img: imageId
            }));

            // Now pass rsdl_id to saveResearchlabTags
            await saveResearchlabTags(newId);
            alert("Research lab saved successfully!");
        } catch (err) {
            console.error('Error saving research lab:', err);
            alert(`Error saving research lab: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div id="main-wrapper" className="flex">
            <Aside />
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