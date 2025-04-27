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

  const handleSave = async () => {

    const payload = {
      lang: formData.lang,
      am_title: formData.am_title,
      am_shortdesc: formData.am_shortdesc || null,
      am_postdate: formData.am_postdate,
      am_fav: formData.am_fav ? 1 : 0,
      am_img: formData.am_img || null,
      display: formData.display ? 1 : 0,
      am_detail: subtitleContent,
      active: formData.active ? 1 : 0,
      am_orders: formData.am_orders || 0,
    };

    try {
      let res;
      if (formData.am_id) {
        res = await axios.post(
          `${API_ENDPOINTS.updateAnnouncement}/${formData.am_id}`,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        res = await axios.post(API_ENDPOINTS.createAnnouncement, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
      alert('Announcement saved successfully!');
    } catch (err) {
      console.error('Error saving announcement:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      } else {
        console.error('Failed to connect to the server.');
      }
    }
  };

  useEffect(() => {
    if (announcementData) {
      setFormData({
        am_id: announcementData.am_id || null,
        lang: announcementData.lang || 1,
        am_title: announcementData.am_title || '',
        am_shortdesc: announcementData.am_shortdesc || '',
        display: !!announcementData.display,
        am_postdate: announcementData.am_postdate || '',
        am_fav: !!announcementData.am_fav,
        active: announcementData.active || 1,
        am_img: announcementData.am_img || null,
        am_orders: announcementData.am_orders || 0,
      });
      setSubtitleContent(announcementData.am_detail || '');
    }
  }, [announcementData]);

  const handleImageSelect = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      am_img: imageId,
    }));
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