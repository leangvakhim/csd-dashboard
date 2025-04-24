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
        rsdl_img: null,
        rsdl_order: '',
        active: 1,
        display: true,
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
            rsdl_fav: formData.rsdl_fav || '0',
            rsdl_detail: formData.rsdl_detail || '',
            rsdl_img: await getImageIdByUrl(formData.rsdl_img) || null,
            rsdl_order: formData.rsdl_order || 0,
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

    const saveResearchlabTags = async () => {
        const rsdl_id = formData.rsdl_id;
        if (!rsdl_id) {
            console.warn("Cannot save tags: missing researchlab ID.");
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

        for (const item of filteredTags) {
            const payload = {
                rsdlt_title: item.rsdlt_title,
                rsdlt_img: item.rsdlt_img_id || null,
                rsdlt_rsdl: rsdl_id,
            };
            if (item.rsdlt) {
                await axios.post(`${API_ENDPOINTS.updateResearchlabTag}/${item.rsdlt}`, {rsdlt_tags: [payload]});
            } else {
                await axios.post(API_ENDPOINTS.createResearchlabTag, {
                    rsdl_id,
                    rsdlt_tags: [payload],
                });
            }
        }
    };

    const handleSave = async () => {
        try {
            await saveResearchlab();
            await saveResearchlabTags();
            alert("Research lab saved successfully!");
        } catch (err) {
            console.error('Error saving research lab:', err);
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