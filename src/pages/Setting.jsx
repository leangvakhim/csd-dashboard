import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Aside from '../components/Aside'
import { useLoading } from "../components/Context/LoadingContext";
import SettingHeader from '../components/Setting/SettingHeader'
import SettingField from '../components/Setting/SettingField'
import { API_ENDPOINTS, axiosInstance } from '../service/APIConfig';
import Swal from 'sweetalert2';

const Setting = () => {
    const universitySocialRef = useRef();
    const [formData, setFormData] = useState({
        set_facultytitle: "",
        set_facultydep: "",
        set_telegramtoken: "",
        set_chatid: "",
        set_logo: 0,
        set_amstu: null,
        set_enroll: null,
        set_baseurl: "",
        lang: 1,
    });

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                Swal.fire({
                    title: 'Loading setting...',
                    allowOutsideClick: false,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                });

                const { data } = await axiosInstance.get(`${API_ENDPOINTS.getSettingByLang}/${formData.lang}`);
                setFormData({
                    ...data.data,
                });

                Swal.close();
            } catch (err) {
                Swal.close();
                if (err.response?.status === 404) {
                    console.log(`No setting found for lang=${formData.lang}.`);
                } else {
                    console.error("Failed to fetch setting:", err);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: 'Failed to fetch setting.',
                    });
                }
            }
        };

        if (formData.lang) {
            fetchSetting();
        }
    }, [formData.lang]);

    const saveSetting = async () => {
        try {
            const payload = {
                lang: formData.lang || 1,
                set_facultytitle: formData.set_facultytitle,
                set_facultydep: formData.set_facultydep,
                set_telegramtoken: formData.set_telegramtoken,
                set_chatid: formData.set_chatid,
                set_logo: formData.set_logo,
                set_amstu: parseFloat(formData.set_amstu),
                set_baseurl: formData.set_baseurl,
                set_enroll: parseFloat(formData.set_enroll),
            };

            const checkResponse = await axiosInstance.get(`${API_ENDPOINTS.getSettingByLang}/${formData.lang}`);
            const id = checkResponse?.data?.data?.set_id;
            if (id) {
                await axiosInstance.post(`${API_ENDPOINTS.updateSetting}/${id}`, payload);
            } else {
                await axiosInstance.post(API_ENDPOINTS.createSetting, payload);
            }
        } catch (err) {
             if (err.response?.status === 404) {
                await axiosInstance.post(API_ENDPOINTS.createSetting, payload);
            } else {
                console.error("Other error while saving:", err);
            }
        }
    }

    const saveSettingSocial = async () => {
        let shouldCreate = true;
        try {
            const slidersData = await universitySocialRef.current?.getUniversitySocials?.();
            if (!Array.isArray(slidersData)) return;

        for (const social of slidersData) {
            const payload = {
                ...social,
                active: 1
            };

            if (social.setsoc_id) {
                try {
                    const check = await axiosInstance.get(`${API_ENDPOINTS.getSocialSetting}/${social.setsoc_id}`);
                    if (check?.data?.data) {
                        shouldCreate = false;
                    }
                } catch (err) {
                    if (err.response?.status === 404) {
                        shouldCreate = true;
                    } else {
                        console.error("Error checking social setting:", err);
                        continue;
                    }
                }
            }

            if (shouldCreate) {
                await axiosInstance.post(API_ENDPOINTS.createSocialSetting, { setting_social: [payload] });
            } else {
                await axiosInstance.post(`${API_ENDPOINTS.updateSocialSetting}/${social.setsoc_id}`, { setting_social: payload });
            }
        }

        if (slidersData.length > 0) {reorderSocialSetting();}

        } catch (error) {
            console.error("Unable to save setting_social records:", error);
        }
    }

    const reorderSocialSetting = async () => {
        const slidersData = await universitySocialRef.current?.getUniversitySocials?.();

        const socialSettingPayload = slidersData.map((slider, index) => ({
            setsoc_id: parseInt(slider.setsoc_id),
            setsoc_order: index + 1
        }));

        try {
            await axiosInstance.post(API_ENDPOINTS.updateOrderSocialSetting, socialSettingPayload);
        } catch (error) {
            console.error("Failed to reorder slideshow:", error.response?.data || error.message);
        }
    };

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving settings...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await saveSetting();
            await saveSettingSocial();

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Settings saved successfully',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save settings.',
            });
            console.error('Error saving settings:', error);
        }
    }
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

            <div className=" w-full page-wrapper overflow-hidden">
                <SettingHeader onSave={handleSave}/>
                <SettingField
                    formData={formData}
                    setFormData={setFormData}
                    ref={universitySocialRef}
                />
            </div>
        </div>
    )
}

export default Setting