import React, { useState, useEffect } from 'react'
import Aside from '../Aside'
import DeveloperFieldHeader from './DeveloperFieldHeader'
import DeveloperFieldBody from './DeveloperFieldBody'
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import { useLocation } from 'react-router-dom';

const DeveloperField = () => {

  const [subtitleContent, setSubtitleContent] = useState('');
  // const [selectedImage, setSelectedImage] = useState("");

  const [formData, setFormData] = useState({
    d_name: "",
    d_position: "",
    d_img: "",
    d_write: "",
    display: true,
    lang: 1,
    socialSlider: []
  });

  const buildPayload = async (order) => {

    return {
      d_name: formData.d_name,
      d_position: formData.d_position,
      d_write: subtitleContent || '',
      // d_img: await getImageIdByUrl(formData.d_img),
      d_img: formData.d_img,
      display: formData.display ? 1 : 0,
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


  const location = useLocation();
  const developData = location.state?.developData;

  useEffect(() => {
    //display dialog on
    if (developData && developData.data) {
      setFormData({
        ...developData.data,
        display: !!developData.data.display,
      });

      setFormData(developData.data);
      setSubtitleContent(developData.data.d_write || "");

    }
  }, [developData]);

  const handleSubmit = async () => {
    console.log('data ', formData);

    try {
      const { data: developers } = await axios.get(API_ENDPOINTS.getDevelopers);
      const newOrder = developers.data.length + 1;

      const payload = await buildPayload(newOrder);

      const existedDev = developers.data.find(dev => dev.d_id === formData.d_id);
      if (existedDev) {
        const updateDeveloper = async () => {
          await axios.post(`${API_ENDPOINTS.updateDeveloper}/${formData.d_id}`, { developer: payload });
        };

        alert("Update developer member success");
        console.log(payload);
        
        updateDeveloper();

      } else {
        const fetchDeveloper = async () => {
          await axios.post(API_ENDPOINTS.createDeveloper, { developer: [payload] });
        };

        alert("Save developer member success");
        fetchDeveloper();
      }

    } catch (error) {
      console.log('Unable to create developer: ', error);
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
          subtitleContent={subtitleContent}
          setSubtitleContent={setSubtitleContent}
        // onImageSelect={handleImageSelect} 
        // getImageIdByUrl={getImageIdByUrl}
        // selectedImage={selectedImage}
        // setSelectedImage={setSelectedImage}
        />
      </div>
    </div>
  )
}

export default DeveloperField