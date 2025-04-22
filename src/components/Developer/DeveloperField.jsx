import React, { useState } from 'react'
import Aside from '../Aside'
import DeveloperFieldHeader from './DeveloperFieldHeader'
import DeveloperFieldBody from './DeveloperFieldBody'
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';

const DeveloperField = () => {

  const [formData, setFormData] = useState({
    fullName: "",
    position: "",
    display: false,
    image: "",
    description: "",
    lang: 1,
    socialSlider: []
  });

  const buildPayload = async (order) => {

    return {
      d_name: formData.fullName,
      d_position: formData.position,
      d_write: formData.description,
      d_img: await getImageIdByUrl(formData.image),
      display: formData.display,
      lang: formData.lang,
      d_order: order,
      active: formData.active || 1,
      // socialSlider: formData.socialSlider.map((item, index) => ({
      //   ds_title: item.title,
      //   ds_img: item.image,
      //   ds_link: item.subtitle,
      //   ds_order: index + 1,
      //   display: item.display,
      // })),
    };
  };

  const getImageIdByUrl = async (url) => {
    try {
      const response = await axios.get(API_ENDPOINTS.getImages);
      const images = Array.isArray(response.data) ? response.data : response.data.data;

      const matchedImage = images.find((img) => img.image_url === url);
      return matchedImage?.image_id || null;
    } catch (error) {
      console.error('❌ Failed to fetch image ID:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    try {
      const { data: developers } = await axios.get(API_ENDPOINTS.getDevelopers);
      const newOrder = developers.data.length + 1;

      const payload = await buildPayload(newOrder);

      const fetchDeveloper = async () => {
        await axios.post(API_ENDPOINTS.createDeveloper, {developer: [payload]});
      };
      // console.log("🔧 Payload sent to backend:", payload);
      alert("Save developer member success");

      fetchDeveloper();

    } catch (error) {
      console.log('Unable to create developer: ', error);
    }
  };


  return (
    <div id="main-wrapper" class=" flex">
      <Aside />

      <div class=" w-full page-wrapper overflow-hidden">
        <DeveloperFieldHeader handleSubmit={handleSubmit} />
        <DeveloperFieldBody formData={formData} setFormData={setFormData} />
      </div>
    </div>
  )
}

export default DeveloperField