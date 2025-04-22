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

  const buildPayload = (order) => {
    return {
      d_name: formData.fullName,
      d_position: formData.position,
      d_write: formData.description,
      d_img: formData.image,
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

  const handleSubmit = async () => {
    try {
      const { data: developers } = await axios.get(API_ENDPOINTS.getDevelopers);
      const newOrder = developers.data.length + 1;

      const payload = buildPayload(newOrder);

      const fetchDeveloper = async () => {
        const response = await axios.post(API_ENDPOINTS.createDeveloper, payload);
        console.log('Developer submit data:', response);
        console.log('Developer submit data:', response.data);

      };

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