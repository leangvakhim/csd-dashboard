import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import Aside from '../Aside';
import AnnouncementFieldHeader from './AnnouncementFieldHeader';
import AnnouncementFieldBody from './AnnouncementFieldBody';
import { API_ENDPOINTS, axiosInstance } from '../../service/APIConfig';
import { useLocation } from 'react-router-dom';

const AnnouncementField = () => {
  const [subtitleContent, setSubtitleContent] = useState('');
  const location = useLocation();
  const announcementData = location.state?.announcementData;
  const announcementID = announcementData?.data?.am_id;
  const [formData, setFormData] = useState({
    am_id: null,
    lang: 1,
    am_title: '',
    am_shortdesc: '',
    display: true,
    am_postdate: '',
    am_fav: false,
    am_tag: '',
    active: 1,
    am_img: null,
    ref_id: null,
    am_orders: 0,
  });

  useEffect(() => {
    if (announcementData && announcementData.data) {
        const fetchAnnouncement = async () => {
            try {
                const response = await axiosInstance.get(`${API_ENDPOINTS.getAnnouncement}/${announcementID}`);
                if (response.data && response.data.data) {
                    setFormData(response.data.data);
                }
            } catch (error) {
                console.error("Failed to fetch news by ID:", error);
            }
        };
        fetchAnnouncement();
    }
  }, [announcementData]);

  const handleSave = async () => {
    try {
      Swal.fire({
        title: 'Saving...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      await saveAnnouncement();

      Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Announcement saved successfully!',
        timer: 1500,
        showConfirmButton: false,
        willClose: () => {
          setTimeout(() => {
              window.location.reload();
          }, 500);
        }
      });
    } catch (err) {
      console.error('Error announcement:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      } else {
        console.error('Failed to connect to the server.');
      }

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save announcement. Please try again.',
      });
    }
  };

  const saveAnnouncement = async () => {
    const payload = {
      lang: formData.lang,
      am_title: formData.am_title,
      am_shortdesc: formData.am_shortdesc || null,
      am_postdate: formData.am_postdate,
      am_fav: 1,
      am_tag: formData.am_tag,
      am_img: formData.am_img || null,
      display: formData.display ? 1 : 0,
      am_detail: subtitleContent,
      ref_id: parseInt(formData.ref_id) || null,
      active: formData.active ? 1 : 0,
      am_orders: formData.am_orders || 0,
    };

    try {
      let res;
      if (formData.am_id) {
        res = await axiosInstance.post(
          `${API_ENDPOINTS.updateAnnouncement}/${formData.am_id}`,
          payload,
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
      } else {
        res = await axiosInstance.post(API_ENDPOINTS.createAnnouncement, payload, {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } catch (err) {
      console.error('Error saving announcement:', err);
      if (err.response) {
        console.error('Server response:', err.response.data);
      } else {
        console.error('Failed to connect to the server.');
      }
    }
  }

  useEffect(() => {
    if (announcementData) {
      setFormData({
        am_id: announcementData.am_id || null,
        lang: announcementData.lang || 1,
        am_title: announcementData.am_title || '',
        am_shortdesc: announcementData.am_shortdesc || '',
        display: !!announcementData.display,
        am_postdate: announcementData.am_postdate || '',
        am_fav: 1,
        am_tag: announcementData.am_tag,
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