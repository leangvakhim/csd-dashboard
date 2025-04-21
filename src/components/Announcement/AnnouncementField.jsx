import React, { useState, useEffect } from 'react';
import Aside from '../Aside';
import AnnouncementFieldHeader from './AnnouncementFieldHeader';
import AnnouncementFieldBody from './AnnouncementFieldBody';
import { API_ENDPOINTS } from '../../service/APIConfig';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const AnnouncementField = () => {
  const [subtitleContent, setSubtitleContent] = useState('');
  const location = useLocation();
  const announcementData = location.state?.announcementData;
  const [formData, setFormData] = useState({
    am_id: null,
    lang: 1,
    am_title: '',
    am_shortdesc: '',
    display: true,
    am_postdate: '',
    am_fav: false,
    active: 1,
    am_img: null,
    am_orders: 0,
  });

  useEffect(() => {
    if (announcementData && announcementData.data) {
      setFormData(announcementData.data);
      setSubtitleContent(announcementData.data.am_detail || '');
    }
  }, [announcementData]);

  const handleImageSelect = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      am_img: imageId,
    }));
  };

  const handleSave = async () => {
    // Validate required fields
   

    const payload = {
      lang: formData.lang || 1,
      am_title: formData.am_title || '',
      am_shortdesc: formData.am_shortdesc || null,
      am_postdate: formData.am_postdate || null,
      am_fav: formData.am_fav ? 1 : 0,
      am_img: formData.am_img || null,
      display: formData.display ? 1 : 0,
      am_detail: subtitleContent || '',
      active: formData.active ? 1 : 0,
      am_orders: formData.am_orders || 0,
    };

    console.log('Submitting payload:', JSON.stringify(payload, null, 2));

    try {
      let res;
      if (formData.am_id) {
        // Perform update
        res = await axios.post(`${API_ENDPOINTS.updateAnnouncement}/${formData.am_id}`, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        // Perform create
        const { am_orders, ...createPayload } = payload;
        res = await axios.post(API_ENDPOINTS.createAnnouncement, createPayload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      alert('Announcement saved successfully!');
      console.log('Response:', res.data);
    } catch (err) {
      console.error('Error saving announcement:', err);
      if (err.response?.data?.errors) {
        console.error('Validation failed:', err.response.data.errors);
        alert(`Validation failed: ${JSON.stringify(err.response.data.errors)}`);
      } else {
        console.error('Server response:', err.response?.data);
        alert(`Failed to save announcement: ${err.response?.data?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div id="main-wrapper" className="flex">
      <Aside />
      <div className="w-full page-wrapper overflow-hidden">
        <AnnouncementFieldHeader onSave={handleSave} />
        <AnnouncementFieldBody
          formData={formData}
          setFormData={setFormData}
          subtitleContent={subtitleContent}
          setSubtitleContent={setSubtitleContent}
          onImageSelect={handleImageSelect}
        />
      </div>
    </div>
  );
};

export default AnnouncementField;