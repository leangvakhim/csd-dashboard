import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import SettingFieldHeader from './SettingFieldHeader'
import SettingFieldBodyInfo from './SettingFieldBodyInfo'
import Aside from '../Aside'
import { API_ENDPOINTS, API, axiosInstance } from "../../service/APIConfig";
import Swal from 'sweetalert2';

const SettingFieldBody = () => {
    const universityContactRef = useRef();

    const handleSave = async () => {
        Swal.fire({ title: 'Saving...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const slidersData = await universityContactRef.current?.getUniversityContacts?.();

        const payload = {
            ...slidersData
        };

        try {
            const checkResponse = await axiosInstance.get(`${API_ENDPOINTS.getContactByLang}/${payload.lang}`);
                const id = checkResponse?.data?.data?.con_id;
                if (id) {
                    await axiosInstance.post(`${API_ENDPOINTS.updateContact }/${id}`, payload);
                } else {
                    await axiosInstance.post(API_ENDPOINTS.createContact, payload);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    await axiosInstance.post(API_ENDPOINTS.createContact, payload);
                } else {
                    console.error("Other error while saving:", err);
                }
            }
            Swal.close();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Setting contact saved successfully.',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (error) {
            Swal.close();
            console.error("Unable to save contact university records:", error);
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
                <SettingFieldHeader onSave={handleSave}/>
                <SettingFieldBodyInfo
                    ref={universityContactRef}
                />
            </div>
        </div>
    )
}

export default SettingFieldBody
