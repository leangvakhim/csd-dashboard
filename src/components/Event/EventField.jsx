import React, {useState, useEffect} from 'react'
import Aside from '../Aside'
import EventsFieldHeader from './EventsFieldHeader'
import EventsFieldBody from './EventsFieldBody'
import { API_ENDPOINTS } from '../../service/APIConfig'
import axios from 'axios';

const EventsField = () => {
    const [subtitleContent, setSubtitleContent] = useState('');
    const [nextOrder, setNextOrder] = useState(1);
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

    const handleImageSelect = (imageId) => {
        setFormData(prev => ({
            ...prev,
            e_img: imageId,
        }));
        console.log("Selected image ID:", imageId);
    };

    useEffect(() => {
        axios.get(API_ENDPOINTS.getEvent)
            .then(response => {
                const existing = response.data.data || [];
                const maxOrder = Math.max(...existing.map(ev => ev.e_order || 0), 0);
                setExistingEvents(existing);
                setNextOrder(maxOrder + 1);
            });
    }, []);

    const handleSave = async () => {
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
            e_order: nextOrder,
            active: formData.active ? 1 : 0
        };

        // console.log("subtitleContent before save:", subtitleContent);
        // console.log("Payload to be sent:", payload);

        try {
            const res = await axios.post(API_ENDPOINTS.createEvent, payload);
            // console.log("Saved:", res.data);
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