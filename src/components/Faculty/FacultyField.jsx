import React, { useState, useEffect, useRef } from 'react'
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
    // const infoRef = useRef();
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

    const saveFacultyContact = async () => {
        const f_id = formData.f_id;
        if (!f_id) {
            console.warn("Cannot save contacts: missing faculty ID.");
            return;
        }
        const contactData = contactRef.current?.getData?.() || [];
        // const contactinfo = Array.isArray(contactData.contactinfo) ? contactData.contactinfo : [];
        // const socialData = socialRef.current?.getData?.() || [];

        // Remove duplicates based on fc_name and fc_id (id is used for existing contacts)
        const seen = new Set();
        const filteredContacts = Array.isArray(contactData)
            ? contactData.filter(item => {
                const key = `${item.fc_name}-${item.fc_id}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return item.fc_name;
            })
            : [];

        // New contacts (no fc_id)
        const newContacts = filteredContacts.filter(item => typeof item.fc_id !== "number").map(item => ({
            fc_order: item.fc_order || 0,
            fc_name: item.fc_name,
            display: item.display ? 1 : 0,
            active: 1,
        }));
        console.log("🔍 Filtered contacts:", filteredContacts);
        console.log("🆕 New contacts to create:", newContacts);

        // Existing contacts (with fc_id)
        const updateContacts = filteredContacts.filter(item => typeof item.fc_id == "number");
        console.log("🔄 Contacts to update:", updateContacts);

        for (const item of updateContacts) {
            console.log(`🔧 Updating contact ID ${item.fc_id}`, item);
            const updatePayload = {
                fc_order: item.fc_order,
                fc_name: item.fc_name,
                display: item.display ?? 1,
                active: item.active ?? 1,
                fc_f: f_id, // Faculty ID
            };
            try {
                console.log("🔄 Update Payload:", updatePayload);
                await axios.post(`${API_ENDPOINTS.updateFacultyContact}/${item.fc_id}`, updatePayload);

            } catch (error) {
                console.error("Error updating contact:", error);
            }
        }

        // Create new contacts
        if (newContacts.length > 0) {
            const createPayload = {
                f_id, // Faculty ID
                contact_faculty: newContacts,
            };
            try {
                await axios.post(API_ENDPOINTS.createFacultyContact, createPayload);
                console.log("🆕 Create Payload:", createPayload);
            } catch (error) {
                console.error("Error creating contacts:", error);
            }
        }

        // Reorder contacts if needed
        const reorderPayload = filteredContacts
            .filter(item => typeof item.fc_id === "number")
            .map(item => ({
                fc_id: item.fc_id,
                fc_order: item.fc_order,
            }));

        if (reorderPayload.length > 0) {
            console.log("🔃 Reordering contacts:", reorderPayload);
            try {
                await axios.post(API_ENDPOINTS.updateFacultyContactOrder, reorderPayload, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
            } catch (error) {
                console.error("Error reordering contacts:", error);
            }
        }
    };


    const saveFacultyBG = async () => {
        const f_id = formData.f_id;
        if (!f_id) {
            console.warn("Cannot save background: missing faculty ID.");
            return;
        }

        const bgData = backgroundRef.current?.getData?.() || [];
        const bgList = Array.isArray(bgData) ? bgData : [];

        const newBGs = bgList.filter(item => typeof item.fbg_id !== 'number').map(item => ({
            fbg_order: item.fbg_order,
            fbg_img: item.fbg_img,
            display: item.display ?? 1,
            active: item.active ?? 1
        }));

        const updateBGs = bgList.filter(item => typeof item.fbg_id === 'number');

        for (const item of updateBGs) {
            const payload = {
                fbg_order: item.fbg_order,
                fbg_img: item.fbg_img,
                display: item.display ?? 1,
                active: item.active ?? 1,
                fbg_f: f_id,
            };
            await axios.post(`${API_ENDPOINTS.updateFacultyBG}/${item.fbg_id}`, payload);
        }

        if (newBGs.length > 0) {
            const payload = {
                f_id,
                faculty_bg: newBGs
            };
            await axios.post(API_ENDPOINTS.createFacultyBG, payload);
        }

        const reorderPayload = updateBGs.map(item => ({
            fbg_id: item.fbg_id,
            fbg_order: item.fbg_order
        }));

        if (reorderPayload.length > 0) {
            await axios.post(API_ENDPOINTS.updateFacultyBGOrder, reorderPayload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }
    };



    const handleSave = async () => {
        try {
            await saveFaculty();
            await saveFacultySocial();
            await saveFacultyContact();
            await saveFacultyBG();
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
            <Aside />

            <div class=" w-full page-wrapper overflow-hidden">
                <FacultyFieldHeader onSave={handleSave} />
                <FacultyFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    subtitleContent={subtitleContent}
                    setSubtitleContent={setSubtitleContent}
                    onImageSelect={handleImageSelect}
                    socialRef={socialRef}
                    contactRef={contactRef}
                    backgroundRef={backgroundRef}
                    initialSocialData={socialRef.current?.getData?.()}
                />
            </div>
        </div>
    )
}

export default FacultyField