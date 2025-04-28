import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Aside from '../components/Aside'
import { useLoading } from "../components/Context/LoadingContext";
import SettingHeader from '../components/Setting/SettingHeader'
import SettingField from '../components/Setting/SettingField'
import axios from 'axios';
import { API_ENDPOINTS } from '../service/APIConfig';

const Setting = () => {

    const { loading, setLoading } = useLoading();

    useEffect(() => {
        if (loading) {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 200);
        return () => clearTimeout(timer);
        }
    }, [loading]);

    const universitySocialRef = useRef();
    const [formData, setFormData] = useState({
        set_facultytitle: "",
        set_facultydep: "",
        set_logo: 0,
        set_amstu: null,
        set_enroll: null,
        set_baseurl: "",
        lang: 1,
    });

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const { data } = await axios.get(`${API_ENDPOINTS.getSettingByLang}/${formData.lang}`);
                setFormData({
                    ...data.data,
                });
            } catch (err) {
                if (err.response?.status === 404) {
                    console.log(`No setting found for lang=${formData.lang}.`);
                } else {
                    console.error("Failed to fetch setting:", err);
                }
            }
        };

        if (formData.lang) {
            fetchSetting();
        }
    }, [formData.lang]);

    const saveSetting = async () => {
        const payload = {
            lang: formData.lang || 1,
            set_facultytitle: formData.set_facultytitle,
            set_facultydep: formData.set_facultydep,
            set_logo: formData.set_logo,
            set_amstu: parseFloat(formData.set_amstu),
            set_baseurl: formData.set_baseurl,
            set_enroll: parseFloat(formData.set_enroll),
        };

        try {
            const checkResponse = await axios.get(`${API_ENDPOINTS.getSettingByLang}/${formData.lang}`);
            const id = checkResponse?.data?.data?.set_id;
            if (id) {
                await axios.post(`${API_ENDPOINTS.updateSetting}/${id}`, payload);
            } else {
                await axios.post(API_ENDPOINTS.createSetting, payload);
            }
        } catch (err) {
             if (err.response?.status === 404) {
                await axios.post(API_ENDPOINTS.createSetting, payload);
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
                    const check = await axios.get(`${API_ENDPOINTS.getSocialSetting}/${social.setsoc_id}`);
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
                await axios.post(API_ENDPOINTS.createSocialSetting, { setting_social: [payload] });
            } else {
                await axios.post(`${API_ENDPOINTS.updateSocialSetting}/${social.setsoc_id}`, { setting_social: payload });
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
            await axios.post(API_ENDPOINTS.updateOrderSocialSetting, socialSettingPayload);
        } catch (error) {
            console.error("Failed to reorder slideshow:", error.response?.data || error.message);
        }
    };

    const handleSave = async () => {
        await saveSetting();
        await saveSettingSocial();
        alert("Setting saved successfully!");
    }
    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

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