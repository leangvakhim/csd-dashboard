import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Aside from '../Aside'
import DeveloperFieldHeader from './DeveloperFieldHeader'
import DeveloperFieldBody from './DeveloperFieldBody'
import axios from 'axios';
import { API_ENDPOINTS } from '../../service/APIConfig';
import { useLocation } from 'react-router-dom';
import { useLoading } from "../Context/LoadingContext";
import Swal from 'sweetalert2';

const DeveloperField = () => {
  const location = useLocation();
  const developData = location.state?.developData;
  const developerFieldRef = useRef();
  const {setLoading} = useLoading();
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

    try{
      if (developData?.data?.d_id) {
      fetchDeveloper(developData.data.d_id);
      fetchDeveloperSocials(developData.data.d_id);
    }
    }catch(error){
      console.error(error);
    }
  }, [developData]);

  const fetchDeveloperSocials = async (developerId) => {
    try {
      const response = await axios.get(`${API_ENDPOINTS.getSocialDeveloper}?ds_developer=${developerId}`);
      const socials = response.data?.data || [];
      setFormData(prev => ({
        ...prev,
        socialSlider: socials
      }));
    } catch (error) {
      console.error("Failed to fetch developer socials:", error);
    }
  };

  const saveDeveloper = async () => {
    try {
      const payload = {
        d_name: formData.d_name,
        d_position: formData.d_position,
        d_write: formData.d_write || '',
        d_img: formData.d_img,
        display: formData.display ? 1 : 0,
        lang: formData.lang,
        active: formData.active || 1,
      };

      let developerId = formData.d_id;

      if (developerId) {
        await axios.post(`${API_ENDPOINTS.updateDeveloper}/${developerId}`, { developer: payload });
      } else {
        const response = await axios.post(API_ENDPOINTS.createDeveloper, { developer: [payload] });
        developerId = response.data?.data?.[0]?.d_id;
      }

      if (developerId) {
        setFormData(prev => ({ ...prev, d_id: developerId }));
        await saveDeveloperSocials(developerId);
      }

    } catch (error) {
      console.log('Unable to save developer: ', error);
    }
  };

  const saveDeveloperSocials = async (developerId) => {
    try {
      const slidersData = await developerFieldRef.current?.getDevelopers?.();
      if (!Array.isArray(slidersData)) return;

      for (const social of slidersData) {
        const payload = {
          ...social,
          ds_developer: developerId,
          display: social.display ? 1 : 0,
          active: 1
        };

        try {
          if (social.ds_id) {
            const res = await axios.get(`${API_ENDPOINTS.getSocialDeveloper}/${social.ds_id}`);

              if (res.data && res.data.data) {
                if(res.data.data.ds_developer === developerId){
                  await axios.post(`${API_ENDPOINTS.updateSocialDeveloper}/${social.ds_id}`, {developer_social: payload });
                }else {
                  await axios.post(API_ENDPOINTS.createSocialDeveloper, {developer_social: [payload] });
                }
              } else {
                await axios.post(API_ENDPOINTS.createSocialDeveloper, {developer_social: [payload] });
              }
            } else {
              await axios.post(API_ENDPOINTS.createSocialDeveloper, {developer_social: [payload] });
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
              await axios.post(API_ENDPOINTS.createSocialDeveloper, {developer_social: [payload] });
            } else {
              console.error("❌ Error saving developer info:", error);
            }
        }
      }

      if (slidersData.length > 0) {reorderSocialDeveloper();}

    } catch (error) {
      console.error("Unable to save developer_social records:", error);
    }
  };

  const reorderSocialDeveloper = async () => {
        const slidersData = await developerFieldRef.current?.getDevelopers?.();

        const socialDeveloperPayload = slidersData.map((slider, index) => ({
            ds_id: parseInt(slider.ds_id),
            ds_order: index + 1
        }));

        try {
            await axios.post(API_ENDPOINTS.updateorderSocialDeveloper, socialDeveloperPayload);
        } catch (error) {
            console.error("Failed to reorder slideshow:", error.response?.data || error.message);
        }
    };

  const handleSubmit = async () => {
    try {
      Swal.fire({
        title: 'Saving Developer...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await saveDeveloper();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Developer saved successfully.',
        timer: 1500,
        showConfirmButton: false,
        willClose: () => {
            setTimeout(() => {
                window.location.reload();
            }, 500);
        }
      });

    } catch (error) {
      console.log('Unable to save developer: ', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to save developer.',
      });
    }
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

      <div className=" w-full page-wrapper overflow-hidden">
        <DeveloperFieldHeader handleSubmit={handleSubmit} />
        <DeveloperFieldBody
          formData={formData}
          setFormData={setFormData}
          ref={developerFieldRef}
        />
      </div>
    </div>
  )
}

export default DeveloperField