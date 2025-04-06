import React, {useState, useEffect, useRef} from 'react'
import Aside from '../Aside'
import FacultyFieldHeader from './FacultyFieldHeader'
import FacultyFieldBody from './FacultyFieldBody'
import { useLocation } from 'react-router-dom'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios'

const FacultyField = () => {
    const socialRef = useRef();
    const contactRef = useRef();
    const backgroundRef = useRef();
    const infoRef = useRef();
    const [subtitleContent, setSubtitleContent] = useState('');
    const location = useLocation();
    const facultyData = location.state?.facultyData;
    const [formData, setFormData] = useState({
        lang: 1,
        f_name: null,
        f_position: null,
        f_portfolio: null,
        display: true,
        f_img: null,
        active: 1,
    });

    useEffect(() => {
        if (facultyData && facultyData.data) {
            setFormData(facultyData.data);
        }
    }, [facultyData]);

    useEffect(() => {
        const fetchSocials = async () => {
            if (formData.f_id && socialRef.current?.setData) {
                try {
                    const res = await axios.get(`${API_ENDPOINTS.getSocialByFaculty}/${formData.f_id}`);
                    const socialList = (res.data.data || []).map(item => ({
                        ...item,
                        social_id: item.social_id ?? item.id
                    }));
                    socialRef.current.setData(socialList);

                } catch (err) {
                    console.error("Failed to fetch social data:", err);
                }
            }
        };
        fetchSocials();
    }, [formData.f_id]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            f_img: imageId,
        }));
    };

    const saveFaculty = async () => {
        const isUpdate = !!formData.f_id;
        const payload = {
            lang: formData.lang,
            f_name: formData.f_name || '',
            f_position: formData.f_position || '',
            f_portfolio: formData.f_portfolio || '',
            f_img: formData.f_img || null,
            display: formData.display ? 1 : 0,
            active: formData.active ? 1 : 0,
        };

        if (!isUpdate) {
            const res = await axios.post(API_ENDPOINTS.createFaculty, payload);
            const createdFaculty = res.data.data;
            setFormData(prev => ({
                ...prev,
                f_id: createdFaculty.f_id
            }));
            return createdFaculty;
        } else {
            await axios.post(`${API_ENDPOINTS.updateFaculty}/${formData.f_id}`, payload);
            return { f_id: formData.f_id };
        }
    };

    const saveFacultySocial = async () => {
        const f_id = formData.f_id;
        if (!f_id) {
            console.warn(" Cannot save socials: missing faculty ID.");
            return;
        }

        const socialData = socialRef.current?.getData?.() || [];

        const seen = new Set();
        const filteredSocials = Array.isArray(socialData)
            ? socialData.filter(item => {
                const key = `${item.social_link}-${item.social_img}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return item.social_link || item.social_img;
            })
            : [];

        const newSocials = filteredSocials.filter(item => typeof item.social_id !== 'number').map(item => ({
            social_order: item.social_order,
            social_link: item.social_link,
            social_img: item.social_img,
            display: item.display ?? 1,
            active: item.active ?? 1
        }));

        const updateSocials = filteredSocials.filter(item => typeof item.social_id === 'number');

        for (const item of updateSocials) {
            const payload = {
                social_order: item.social_order,
                social_link: item.social_link,
                social_img: item.social_img,
                social_faculty: f_id,
                display: item.display ?? 1,
                active: item.active ?? 1
            };
            // Perform update
            await axios.post(`${API_ENDPOINTS.updateSocial}/${item.social_id}`, payload);
        }

        // Perform create
        if (newSocials.length > 0) {
            const payload = {
                f_id,
                social_faculty: newSocials
            };
            await axios.post(API_ENDPOINTS.createSocial, payload);
        }

        // Perform reorder
        const reorderPayload = filteredSocials
            .filter(item => typeof item.social_id === 'number')
            .map(item => ({
                social_id: item.social_id,
                social_order: item.social_order
        }));


        if (reorderPayload.length > 0) {
            await axios.post(API_ENDPOINTS.updateSocialOrder, reorderPayload, {
                headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
                }
            });
        }
    }

    const handleSave = async () => {
        try {
            // await saveFaculty();
            await saveFacultySocial();
            alert("Faculty information saved successfully!");
        } catch (err) {
            if (err.response?.data?.errors) {
                console.log('Validation errors:', err.response.data.errors);
            } else {
                console.log('Full error:', err);
            }
        }
    };

    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
                <FacultyFieldHeader onSave={handleSave}/>
                <FacultyFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    subtitleContent={subtitleContent}
                    setSubtitleContent={setSubtitleContent}
                    onImageSelect={handleImageSelect}
                    socialRef={socialRef}
                    initialSocialData={socialRef.current?.getData?.()}
                />
            </div>
        </div>
    )
}

export default FacultyField