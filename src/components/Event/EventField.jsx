import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import EventsFieldHeader from './EventsFieldHeader'
import EventsFieldBody from './EventsFieldBody'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const EventsField = () => {
    const [subtitleContent, setSubtitleContent] = useState('');
    const location = useLocation();
    const eventData = location.state?.eventData;
    const [formData, setFormData] = useState({
        lang: 1,
        e_title: null,
        e_shorttitle: null,
        e_tags: null,
        display: true,
        e_date: null,
        e_fav: true,
        active: 1,
    });

    useEffect(() => {
        if (eventData && eventData.data) {
            setFormData(eventData.data);
            setSubtitleContent(eventData.data.e_detail || "");
        }
    }, [eventData]);

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            e_img: imageId,
        }));
    };

    const handleSave = async () => {
        let res;
        const payload = {
            lang: formData.lang,
            e_title: formData.e_title || '',
            e_shorttitle: formData.e_shorttitle || '',
            e_tags: formData.e_tags || '',
            e_date: formData.e_date || null,
            e_fav: formData.e_fav ? 1 : 0,
            e_img: formData.e_img || null,
            display: formData.display ? 1 : 0,
            e_detail: subtitleContent || '',
            active: formData.active ? 1 : 0
        };

        try {
            if (formData.e_id) {
                // Perform update
                res = await axios.post(`${API_ENDPOINTS.updateEvent}/${formData.e_id}`, payload);
            } else {
                // Perform create
                const { e_order, ...createPayload } = payload;
                res = await axios.post(API_ENDPOINTS.createEvent, createPayload);
            }
            alert("Event saved successfully!");
        } catch (err) {
            console.error("Error saving:", err);
            if (err.response?.data?.errors) {
                console.error("Validation failed:", err.response.data.errors);
            }
        }
    };

    return (
        <div id="main-wrapper" class=" flex">
            <Aside/>

            <div class=" w-full page-wrapper overflow-hidden">
               <EventsFieldHeader onSave={handleSave}/>
               <EventsFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    subtitleContent={subtitleContent}
                    setSubtitleContent={setSubtitleContent}
                    onImageSelect={handleImageSelect}
                />
            </div>
        </div>
    )
}

export default EventsField