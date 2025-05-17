import React, { useState, useEffect, useRef } from 'react'
import Swal from 'sweetalert2';
import Aside from '../Aside'
import FacultyFieldHeader from './FacultyFieldHeader'
import FacultyFieldBody from './FacultyFieldBody'
import { useLocation } from 'react-router-dom'
import { API_ENDPOINTS, API } from '../../service/APIConfig'
import axios from 'axios'
import { useLoading } from '../Context/LoadingContext'

const FacultyField = () => {
    const socialRef = useRef();
    const contactRef = useRef();
    const backgroundRef = useRef();
    const infoRef = useRef();
    const {setLoading} = useLoading();
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
        ref_id: null,
        active: 1,
    });

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

    useEffect(() => {
        try{
            if (facultyData && facultyData.data) {
                setFormData(facultyData.data);
            }
        }catch(error){
            console.error(error);
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
            ref_id: parseInt(formData.ref_id) || null,
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
            fc_order: item.fc_order,
            fc_name: item.fc_name,
            display: item.display ? 1 : 0,
            active: 1,
        }));

        // Existing contacts (with fc_id)
        const updateContacts = filteredContacts.filter(item => typeof item.fc_id == "number");

        for (const item of updateContacts) {
            const updatePayload = {
                fc_order: item.fc_order, // Potential issue: no fallback
                fc_name: item.fc_name,
                display: item.display ?? 1,
                active: item.active ?? 1,
                fc_f: f_id, // Faculty ID
            };
            try {
                await axios.post(`${API_ENDPOINTS.updateFacultyContact}/${item.fc_id}`, updatePayload);
            } catch (error) {
                console.error("Error updating contact:", error);
            }
        }

        // Create new contacts

        if (newContacts.length > 0) {
            const createPayload = {
                f_id, // Faculty ID
                fc_f: newContacts, // Potential issue: Key name
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

    const saveFacultyInfo = async () => {
        const f_id = formData.f_id;
        if (!f_id) {
            console.warn("Cannot save info: missing faculty ID.");
            return;
        }

        const infoData = infoRef.current?.getData?.() || [];

        const seen = new Set();
        const filteredInfos = Array.isArray(infoData)
            ? infoData.filter(item => {
                const key = `${item.finfo_title}-${item.finfo_detail}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return item.finfo_title || item.finfo_detail;
            })
            : [];

        if (!Array.isArray(infoData)) return;

        for (const info of filteredInfos) {
            const payload = {
                finfo_order: info.finfo_order,
                finfo_title: info.finfo_title,
                finfo_detail: info.finfo_detail,
                finfo_side: info.finfo_side,
                finfo_f: f_id,
                display: info.display ?? 1,
                active: info.active ?? 1,
                finfo_id: null,
            };

            try {
                if (
                    typeof info.finfo_id === 'number' &&
                    info.finfo_id > 0 &&
                    !String(info.finfo_id).startsWith("temp")
                ) {
                    try {
                        const res = await axios.get(`${API_ENDPOINTS.getFacultyInfo}/${info.finfo_id}`);
                        if (res?.data?.data?.faculty?.f_id === f_id) {
                            await axios.post(`${API_ENDPOINTS.updateFacultyInfo}/${info.finfo_id}`, payload);
                        } else {
                            await axios.post(API_ENDPOINTS.createFacultyInfo, { f_id, finfo_f: [payload] });
                        }
                    } catch (error) {
                        if (error.response?.status === 404) {
                            await axios.post(API_ENDPOINTS.createFacultyInfo, { f_id, finfo_f: [payload] });
                        } else {
                            console.error("❌ Error validating finfo_id:", error);
                        }
                    }
                } else {
                    await axios.post(API_ENDPOINTS.createFacultyInfo, { f_id, finfo_f: [payload] });
                }
            } catch (error) {
                console.error("❌ Error saving faculty info:", error);
            }
        }

        if (infoData.length > 0) {
            reorderFacultyInfo();
        }
    };

    const reorderFacultyInfo = async () => {
        const infoData = infoRef.current?.getData?.() || [];

        const facultyInfoPayload = infoData.map((slider, index) => ({
            finfo_id: parseInt(slider.finfo_id),
            finfo_order: index + 1
        }));

        try {
            await axios.post(API_ENDPOINTS.updateFacultyInfoOrder, facultyInfoPayload);
        } catch (error) {
            console.error("Failed to reorder facultyInfo:", error.response?.data || error.message);
        }
    };

    const saveFacultyBG = async () => {
        const f_id = formData.f_id;
        if (!f_id) {
            console.warn("Faculty ID missing, cannot save background.");
            return;
        }

        const bgData = backgroundRef.current?.getData?.() || [];

        const seen = new Set();
        const uniqueBG = Array.isArray(bgData)
            ? bgData.filter(item => {
                const key = `${item.fbg_name}-${item.fbg_id}`;
                if (seen.has(key)) return false;
                seen.add(key);
                return item.fbg_name;
            })
            : [];

        const newItems = uniqueBG.filter(item => typeof item.fbg_id !== 'number');
        const existingItems = uniqueBG.filter(item => typeof item.fbg_id === 'number');

        const createPayload = await Promise.all(newItems.map(async item => ({
            fbg_f: f_id,
            fbg_order: item.fbg_order,
            fbg_name: item.fbg_name,
            fbg_img: await getImageIdByUrl(item.fbg_img),
            display: item.display ?? 1,
            active: item.active ?? 1,
        })));

        const updatePayloads = await Promise.all(existingItems.map(async item => ({
            fbg_order: item.fbg_order,
            fbg_name: item.fbg_name,
            fbg_img: await getImageIdByUrl(item.fbg_img),
            display: item.display ?? 1,
            active: item.active ?? 1,
            fbg_f: f_id
        })));

        try {
            await Promise.all(updatePayloads.map((payload, i) =>
                axios.post(`${API_ENDPOINTS.updateFacultyBG}/${existingItems[i].fbg_id}`, payload)
            ));

            if (createPayload.length > 0) {
                await axios.post(API_ENDPOINTS.createFacultyBG, { facultyBG: createPayload });
            }

            const reorder = existingItems.map(item => ({
                fbg_id: item.fbg_id,
                fbg_order: item.fbg_order
            }));

            if (reorder.length > 0) {
                await axios.post(API_ENDPOINTS.updateFacultyBGOrder, reorder, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                });
            }
        } catch (err) {
            console.error("Error saving faculty background:", err);
        }
    };

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving Faculty...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                },
                buttonsStyling: false,
                backdrop: true,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-gray-700',
                }
            });

            await saveFaculty();
            await saveFacultySocial();
            await saveFacultyContact();
            await saveFacultyBG();
            await saveFacultyInfo();

            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Faculty saved successfully!',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                },
                buttonsStyling: false,
                customClass: {
                    popup: 'bg-white rounded-lg shadow-lg',
                    title: 'text-lg font-semibold text-green-600'
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save faculty data.',
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
                    infoRef={infoRef}
                    initialSocialData={socialRef.current?.getData?.()}
                />
            </div>
        </div>
    )
}

export default FacultyField