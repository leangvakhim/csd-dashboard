import React, { useState, useEffect } from 'react'
import Aside from '../Aside'
import DeveloperFieldHeader from './DeveloperFieldHeader'
import DeveloperFieldBody from './DeveloperFieldBody'
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import { useLocation } from 'react-router-dom';

const DeveloperField = () => {
  const location = useLocation();
  const developData = location.state?.developData;
  const [formData, setFormData] = useState({
    d_name: "",
    d_position: "",
    d_img: "",
    d_write: "",
    display: true,
    lang: 1,
    socialSlider: []
  });

  useEffect(() => {
    const fetchDeveloper = async (id) => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.getDevelopers}/${id}`);
        const developer = response.data?.data;
        if (developer) {
          setFormData({
            ...developer,
            display: !!developer.display,
          });
        }
      } catch (err) {
        console.error("Failed to fetch developer:", err);
      }
    };

    if (developData?.data?.d_id) {
      fetchDeveloper(developData.data.d_id);
    }
  }, [developData]);

  // console.log("developData is: ",developData.data);

  const handleSubmit = async () => {
    try {
      const payload = {
        d_name: formData.d_name,
        d_position: formData.d_position,
        d_write: formData.d_write || '',
        d_img: formData.d_img,
        display: formData.display ? 1 : 0,
        lang: formData.lang,
        active: formData.active || 1,
      }

      if (formData.d_id) {
        await axios.post(`${API_ENDPOINTS.updateDeveloper}/${formData.d_id}`, { developer: payload });
      } else {
        await axios.post(API_ENDPOINTS.createDeveloper, { developer: [payload] });
      }
      alert("Developer saved successfully");

    } catch (error) {
      console.log('Unable to save developer: ', error);
    }
  };

  return (
    <div id="main-wrapper" className=" flex">
      <Aside />

      <div className=" w-full page-wrapper overflow-hidden">
        <DeveloperFieldHeader handleSubmit={handleSubmit} />
        <DeveloperFieldBody
          formData={formData}
          setFormData={setFormData}
        />
      </div>
    </div>
  )
}

export default DeveloperField