import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Aside from '../components/Aside'
import SettingHeader from '../components/Setting/SettingHeader'
import SettingField from '../components/Setting/SettingField'
import axios from 'axios';
import { API_ENDPOINTS } from '../service/APIConfig';

const Setting = () => {

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
            const response = await axios.get(`${API_ENDPOINTS.getSetting}`);
            const setting = response.data?.data;
            if (setting) {
                setFormData({
                    ...setting,
                });
            }
            } catch (err) {
                console.error("Failed to fetch developer:", err);
            }
        };
        fetchSetting();
    }, []);

    const handleSave = async () => {
        const payload = {
            lang: formData.lang,
            set_facultytitle: formData.set_facultytitle,
            set_facultydep: formData.set_facultydep,
            set_logo: formData.set_logo,
            set_amstu: parseFloat(formData.set_amstu),
            set_baseurl: formData.set_baseurl,
            set_enroll: parseFloat(formData.set_enroll),
        };

        try {
            if (formData.set_id && Number(formData.set_id) > 0) {
                await axios.post(`${API_ENDPOINTS.updateSetting}/${formData.set_id}`, payload);
            } else {
                await axios.post(API_ENDPOINTS.createSetting, payload);
            }
            alert("Setting saved successfully!");
        } catch (err) {
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
        }
    }
    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>

            <div className=" w-full page-wrapper overflow-hidden">
                <SettingHeader onSave={handleSave}/>
                <SettingField
                    formData={formData}
                    setFormData={setFormData}
                />
            </div>
        </div>
    )
}

export default Setting