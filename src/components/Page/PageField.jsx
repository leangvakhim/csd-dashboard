import React, { useState, useEffect, useRef } from 'react'
import PageFieldHeader from './PageFieldHeader'
import PageFieldBody from './PageFieldBody'
import Aside from '../Aside'
import axios from 'axios'
import { API_ENDPOINTS } from '../../service/APIConfig'
import { useLocation } from 'react-router-dom'

const PageField = () => {
    const location = useLocation();
    const pageData = location.state?.pageData;
    const pageRef = useRef();
    const [formData, setFormData] = useState({
        p_title: '',
        p_alias: '',
        p_busy: 0,
        p_menu: null,
        display: false
    });

    useEffect(() => {
        if (pageData && pageData.data) {
            setFormData(pageData.data);
        }
    }, [pageData]);

    // Single
    const saveDepartment = async (savedSectionId, savedPageId) => {
        const programs = await pageRef.current?.getPrograms?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getDepartment}?ban_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.dep_id);

        if (programs.length > 0 && savedSectionId) {
            for (const program of programs) {
                const dep_sec = program.dep_sec || savedSectionId;
                const page_id = program.page_id || savedPageId;
                const programPayload = {
                    dep_sec: dep_sec,
                    dep_title: program.dep_title || '',
                    dep_detail: program.dep_detail || '',
                    dep_img1: program.dep_img1 || null,
                    dep_img2: program.dep_img2 || null,
                    page_id: page_id,
                };

                if(
                    program.dep_id &&
                    existingServiceIds.includes(parseInt(program.dep_id)) &&
                    parseInt(dep_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateDepartment}/${program.dep_id}`, { programs: programPayload });
                } else {
                    if (!program.dep_id || !existingServiceIds.includes(parseInt(program.dep_id))) {
                        await axios.post(API_ENDPOINTS.createDepartment, { programs: [programPayload] });
                    }
                }
            }
        }
    }
    const saveBanner = async (savedSectionId, savedPageId) => {
        const banners = await pageRef.current?.getBanners?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getBanner}?ban_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.ban_id);

        if (banners.length > 0 && savedSectionId) {
            for (const banner of banners) {
                const ban_sec = banner.dep_sec || savedSectionId;
                const page_id = banner.page_id || savedPageId;
                const bannerPayload = {
                    ban_sec: ban_sec,
                    ban_title: banner.ban_title || '',
                    ban_subtitle: banner.ban_subtitle || '',
                    ban_img: banner.ban_img || null,
                    page_id: page_id,
                };

                if (
                    banner.ban_id &&
                    existingServiceIds.includes(parseInt(banner.ban_id)) &&
                    parseInt(ban_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateBanner}/${banner.ban_id}`, { banners: bannerPayload });
                } else {
                    if (!banner.ban_id || !existingServiceIds.includes(parseInt(banner.ban_id))) {
                        await axios.post(API_ENDPOINTS.createBanner, { banners: [bannerPayload] });
                    }
                }
            }
        }
    }
    const saveInformation = async (savedSectionId, savedPageId) => {
        const informations = await pageRef.current?.getInformations?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getText}?ban_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.text_id);

        if (informations.length > 0 && savedSectionId) {
            for (const information of informations) {
                const text_sec = information.text_sec || savedSectionId;
                const page_id = information.page_id || savedPageId;
                const informationPayload = {
                    text_sec: text_sec,
                    title: information.title || '',
                    desc: information.desc || '',
                    text_type: information.text_type || null,
                    page_id: page_id,
                };

                if (
                    information.text_id &&
                    existingServiceIds.includes(parseInt(information.text_id)) &&
                    parseInt(text_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateText}/${information.text_id}`, { texts: informationPayload });
                } else {
                    if (!information.text_id || !existingServiceIds.includes(parseInt(information.text_id))) {
                        await axios.post(API_ENDPOINTS.createText, { texts: [informationPayload] });
                    }
                }
            }
        }
    }
    const saveTestimonial = async (savedSectionId, savedPageId) => {
        const testimonials = await pageRef.current?.getTestimonials?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getTestimonial}?t_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.t_id);

        if (testimonials.length > 0 && savedSectionId) {
            for (const testimonial of testimonials) {
                const t_sec = testimonial.t_sec || savedSectionId;
                const page_id = testimonial.page_id || savedPageId;
                const testimonialPayload = {
                    t_sec: t_sec,
                    t_title: testimonial.t_title || '',
                    page_id: page_id,
                };

                if (
                    testimonial.t_id &&
                    existingServiceIds.includes(parseInt(testimonial.t_id)) &&
                    parseInt(t_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateTestimonial}/${testimonial.t_id}`, { testimonials: testimonialPayload });
                } else {
                    if (!testimonial.t_id || !existingServiceIds.includes(parseInt(testimonial.t_id))) {
                        await axios.post(API_ENDPOINTS.createTestimonial, { testimonials: [testimonialPayload] });
                    }
                }
            }
        }
    }
    const saveAcademic = async (savedSectionId, savedPageId) => {
        const academics = await pageRef.current?.getAcademics?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getAcademic}?ban_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.acad_id);

        if (academics.length > 0 && savedSectionId) {
            for (const academic of academics) {
                const acad_sec = academic.acad_sec || savedSectionId;
                const page_id = academic.page_id || savedPageId;
                const academicPayload = {
                    acad_sec: acad_sec,
                    acad_title: academic.acad_title || '',
                    acad_detail: academic.acad_detail || '',
                    acad_img: academic.acad_img || null,
                    acad_btntext1: academic.acad_btntext1 || '',
                    acad_btntext2: academic.acad_btntext2 || '',
                    acad_routepage: academic.acad_routepage || '',
                    acad_routetext: academic.acad_routetext || '',
                    page_id: page_id,
                };

                if (
                    academic.acad_id &&
                    existingServiceIds.includes(parseInt(academic.acad_id)) &&
                    parseInt(acad_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAcademic}/${academic.acad_id}`, { academics: academicPayload });
                } else {
                    if (!academic.acad_id || !existingServiceIds.includes(parseInt(academic.acad_id))) {
                        await axios.post(API_ENDPOINTS.createAcademic, { academics: [academicPayload] });
                    }
                }
            }
        }
    }
    const saveGallery = async (savedSectionId, savedPageId) => {
        const galleries = await pageRef.current?.getGallery?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getGallery}?gal_sec=${savedSectionId}`);
        const existingGalleries = response.data?.data || [];
        const existingGalleryIds = existingGalleries.map(service => service.gal_id);

        if (galleries.length > 0 && savedSectionId) {
            for (const gallery of galleries) {
                const gal_sec = gallery.gal_sec || savedSectionId;
                const page_id = gallery.page_id || savedPageId;
                const galleryPayload = {
                    gal_sec: gal_sec,
                    gal_img1: gallery.gal_img1,
                    gal_img2: gallery.gal_img2,
                    gal_img3: gallery.gal_img3,
                    gal_img4: gallery.gal_img4,
                    gal_img5: gallery.gal_img5,
                    gal_text: gallery.gal_text,
                    page_id: page_id,
                };

                console.log("Payload: ",galleryPayload);

                if (
                    gallery.gal_id &&
                    existingGalleryIds.includes(parseInt(gallery.gal_id)) &&
                    parseInt(gal_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateGallery}/${gallery.gal_id}`, { gallery: galleryPayload });
                } else {
                    if (!gallery.gal_id || !existingGalleryIds.includes(parseInt(gallery.gal_id))) {
                        await axios.post(API_ENDPOINTS.createGallery, { gallery: [galleryPayload] });
                    }
                }
            }
        }
    }
    const saveCriteria = async (savedSectionId, savedPageId) => {
        const criterias = await pageRef.current?.getCriterias?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getCriteria}?gc_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.gc_id);

        if (criterias.length > 0 && savedSectionId) {
            for (const criteria of criterias) {
                const gc_sec = criteria.gc_sec || savedSectionId;
                const page_id = criteria.page_id || savedPageId;
                const criteriaPayload = {
                    gc_sec: gc_sec,
                    gc_title: criteria.gc_title || '',
                    gc_tag: criteria.gc_tag || '',
                    gc_type: criteria.gc_type || '',
                    gc_detail: criteria.gc_detail || '',
                    gc_img1: criteria.gc_img1 || null,
                    gc_img2: criteria.gc_img2 || null,
                    page_id: page_id,
                };

                if(
                    criteria.gc_id &&
                    existingServiceIds.includes(parseInt(criteria.gc_id)) &&
                    parseInt(gc_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateCriteria}/${criteria.gc_id}`, { criteria: criteriaPayload });
                } else {
                    if (!criteria.gc_id || !existingServiceIds.includes(parseInt(criteria.gc_id))) {
                        await axios.post(API_ENDPOINTS.createCriteria, { criteria: [criteriaPayload] });
                    }
                }
            }
        }
    }
    const saveUnlock = async (savedSectionId, savedPageId) => {
        const unlocks = await pageRef.current?.getUnlocks?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getUnlock}?umd_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.umd_id);

        if (unlocks.length > 0 && savedSectionId) {
            for (const unlock of unlocks) {
                const umd_sec = unlock.umd_sec || savedSectionId;
                const page_id = unlock.page_id || savedPageId;
                const unlockPayload = {
                    umd_sec: umd_sec,
                    umd_title: unlock.umd_title || '',
                    umd_detail: unlock.umd_detail || '',
                    umd_img: unlock.umd_img || null,
                    umd_routepage: unlock.umd_routepage || '',
                    umd_btntext: unlock.umd_btntext || '',
                    page_id: page_id,
                };

                if(
                    unlock.umd_id &&
                    existingServiceIds.includes(parseInt(unlock.umd_id)) &&
                    parseInt(umd_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateUnlock}/${unlock.umd_id}`, { unlock: unlockPayload });
                } else {
                    if (!unlock.umd_id || !existingServiceIds.includes(parseInt(unlock.umd_id))) {
                        await axios.post(API_ENDPOINTS.createUnlock, { unlock: [unlockPayload] });
                    }
                }
            }
        }
    }
    const saveFee = async (savedSectionId, savedPageId) => {
        const fees = await pageRef.current?.getFees?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getFee}?fe_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.fe_id);

        if (fees.length > 0 && savedSectionId) {
            for (const fee of fees) {
                const fe_sec = fee.fe_sec || savedSectionId;
                const page_id = fee.page_id || savedPageId;
                const feePayload = {
                    fe_sec: fe_sec,
                    fe_title: fee.fe_title || '',
                    fe_desc: fee.fe_desc || '',
                    fe_img: fee.fe_img || null,
                    fe_price: fee.fe_price || '',
                    page_id: page_id,
                };

                if(
                    fee.fe_id &&
                    existingServiceIds.includes(parseInt(fee.fe_id)) &&
                    parseInt(fe_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateFee}/${fee.fe_id}`, { fee: feePayload });
                } else {
                    if (!fee.fe_id || !existingServiceIds.includes(parseInt(fee.fe_id))) {
                        await axios.post(API_ENDPOINTS.createFee, { fee: [feePayload] });
                    }
                }
            }
        }
    }

    // hybrid
    const saveFacilties = async (savedSectionId, savedPageId) => {
        const acadFacilities = await pageRef.current?.getFacilities?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getAcadFacilities}?af_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.af_id);

        if (acadFacilities.length > 0 && savedSectionId) {
            for (const acadFacility of acadFacilities) {
                const af_sec = acadFacility.af_sec || savedSectionId;
                const page_id = acadFacility.page_id || savedPageId;

                const acadFacilitiesPayload = {
                    af_sec: af_sec,
                    af_img: acadFacility.af_img,
                    af_text: acadFacility.af_text,
                    page_id: page_id,
                };

                if (
                    acadFacility.af_id &&
                    existingServiceIds.includes(parseInt(acadFacility.af_id)) &&
                    parseInt(af_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAcadFacilities}/${acadFacility.af_id}`, { facilities: acadFacilitiesPayload });
                    await saveAcadFacilitySliders(acadFacility.af_id, acadFacility.subservices || []);

                } else {
                    if (!acadFacility.af_id || !existingServiceIds.includes(parseInt(acadFacility.af_id))) {
                        const res = await axios.post(API_ENDPOINTS.createAcadFacilities, { facilities: [acadFacilitiesPayload] });
                        const createdId = res.data?.data?.[0]?.af_id;
                        if (createdId) {
                            await saveAcadFacilitySliders(acadFacility.af_id, acadFacility.subservices || []);
                        }
                    }
                }
            }
        }
    };
    const saveAcadFacilitySliders = async (facilityId, sliders) => {
        if (!facilityId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubserviceAF}?ss_af=${facilityId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .filter(item => item.ss_ras === null)
            .map(item => item.ss_id);

        for (const ss of sliders) {
            const ssPayload = {
                ss_af: facilityId,
                ss_ras: null,
                ss_title: ss.title,
                ss_subtitle: ss.subtitle,
                ss_img: ss.image,
                display: ss.display,
            };
            const ssId = ss.id || ss.ss_id;

            try {
                if (
                    ssId &&
                    existingSubIds.includes(parseInt(ssId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceAF}/${ssId}`, { subservice: ssPayload });
                } else {
                    if (!ssId || !existingSubIds.includes(parseInt(ssId))) {
                        await axios.post(API_ENDPOINTS.createSubserviceAF, { subservice: [ssPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subservice:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderAcadFacilitySliders(facilityId); }
    };
    const saveSpecializations = async (savedSectionId, savedPageId) => {
        const Specializations = await pageRef.current?.getSpecializations?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getSpecialization}?ras_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.ras_id);

        if (Specializations.length > 0 && savedSectionId) {
            for (const specialization of Specializations) {
                const ras_sec = specialization.ras_sec || savedSectionId;
                const page_id = specialization.page_id || savedPageId;

                const specializationPayload = {
                    ras_sec: ras_sec,
                    ras_img1: specialization.ras_img1,
                    ras_img2: specialization.ras_img2,
                    ras_text: specialization.ras_text,
                    page_id: page_id,
                };

                if (
                    specialization.ras_id &&
                    existingServiceIds.includes(parseInt(specialization.ras_id)) &&
                    parseInt(ras_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${specialization.ras_id}`, { specialization: specializationPayload });
                    await saveSpecializationSliders(specialization.ras_id, specialization.subservices || []);
                } else {
                    if (!specialization.ras_id || !existingServiceIds.includes(parseInt(specialization.ras_id))) {
                        const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [specializationPayload] });
                        const createdId = res.data?.data?.[0]?.ras_id;
                        if (createdId) {
                            await saveSpecializationSliders(specialization.ras_id, specialization.subservices || []);
                        }
                    }
                }
            }
        }
    };
    const saveSpecializationSliders = async (specializationId, sliders) => {
        if (!specializationId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubserviceAF}?ss_ras=${specializationId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .filter(item => item.ss_af === null)
            .map(item => item.ss_id);

        for (const ss of sliders) {
            const ssPayload = {
                ss_af: null,
                ss_ras: specializationId,
                ss_title: ss.title,
                ss_subtitle: ss.subtitle,
                ss_img: ss.image,
                display: ss.display,
            };
            const ssId = ss.id || ss.ss_id;

            try {
                if (
                    ssId &&
                    existingSubIds.includes(parseInt(ssId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceRAS}/${ssId}`, { subservice: ssPayload });
                } else {
                    if (!ssId || !existingSubIds.includes(parseInt(ssId))) {
                        await axios.post(API_ENDPOINTS.createSubserviceRAS, { subservice: [ssPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subservice:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderSpecializationSliders(specializationId); }
    };
    const saveType = async (savedSectionId, savedPageId) => {
        const types = await pageRef.current?.getTypes?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getType}?tse_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.tse_id);

        if (types.length > 0 && savedSectionId) {
            for (const type of types) {
                const tse_sec = type.tse_sec || savedSectionId;
                const page_id = type.page_id || savedPageId;

                const TypePayload = {
                    tse_sec: tse_sec,
                    tse_text: type.tse_text,
                    tse_type: parseInt(type.tse_type),
                    page_id: page_id,
                };

                if (
                    type.tse_id &&
                    existingServiceIds.includes(parseInt(type.tse_id)) &&
                    parseInt(tse_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateType}/${type.tse_id}`, { type: TypePayload });
                    await saveSubTypeSliders(type.tse_id, type.subtypes || []);
                } else {
                    if (!type.tse_id|| !existingServiceIds.includes(parseInt(type.tse_id))) {
                        const res = await axios.post(API_ENDPOINTS.createType, { type: [TypePayload] });
                        const createdId = res.data?.data?.[0]?.tse_id;
                        if (createdId) {
                            await saveSubTypeSliders(type.tse_id, type.subtypes || []);
                        }
                    }
                }
            }
        }
    };
    const saveSubTypeSliders = async (typeId, sliders) => {
        if (!typeId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubType}?tse_sec=${typeId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.stse_id);

        for (const stse of sliders) {
            const stsePayload = {
                stse_tse: typeId,
                stse_title: stse.stse_title,
                stse_detail: stse.stse_detail,
                display: stse.display,
            };
            const stseId = stse.id || stse.stse_id;

            try {
                if (
                    stseId &&
                    existingSubIds.includes(parseInt(stseId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubType}/${stseId}`, { subtse: stsePayload });
                } else {
                    if (!stseId || !existingSubIds.includes(parseInt(stseId))) {
                        await axios.post(API_ENDPOINTS.createSubType, { subtse: [stsePayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subtse:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderSubtseSliders(typeId); }
    };
    const saveCSD = async (savedSectionId, savedPageId) => {
        const csds = await pageRef.current?.getCSDs?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getSpecialization}?ras_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.ras_id);

        if (csds.length > 0 && savedSectionId) {
            for (const csd of csds) {
                const ras_sec = csd.ras_sec || savedSectionId;
                const page_id = csd.page_id || savedPageId;

                const csdPayload = {
                    ras_sec: ras_sec,
                    ras_img1: csd.ras_img1,
                    ras_img2: csd.ras_img2,
                    ras_text: csd.ras_text,
                    page_id: page_id,
                };

                if (
                    csd.ras_id &&
                    existingServiceIds.includes(parseInt(csd.ras_id)) &&
                    parseInt(ras_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${csd.ras_id}`, { specialization: csdPayload });
                    await saveCSDSliders(csd.ras_id, csd.subservices || []);
                    await saveCSDAddOn(csd.ras_id, csd.rasons || []);
                } else {
                    if (!csd.ras_id || !existingServiceIds.includes(parseInt(csd.ras_id))) {
                        const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [csdPayload] });
                        const createdId = res.data?.data?.[0]?.ras_id;
                        if (createdId) {
                            await saveCSDSliders(csd.ras_id, csd.subservices || []);
                            await saveCSDAddOn(csd.ras_id, csd.rasons || []);
                        }
                    }
                }
            }
        }
    };
    const saveCSDSliders = async (csdId, sliders) => {
        if (!csdId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubserviceAF}?ss_ras=${csdId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .filter(item => item.ss_af === null)
            .map(item => item.ss_id);

        for (const ss of sliders) {
            const ssPayload = {
                ss_af: null,
                ss_ras: csdId,
                ss_title: ss.title,
                ss_subtitle: ss.subtitle,
                ss_img: ss.image,
                display: ss.display,
            };
            const ssId = ss.id || ss.ss_id;

            try {
                if (
                    ssId &&
                    existingSubIds.includes(parseInt(ssId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceRAS}/${ssId}`, { subservice: ssPayload });
                } else {
                    if (!ssId || !existingSubIds.includes(parseInt(ssId))) {
                        await axios.post(API_ENDPOINTS.createSubserviceRAS, { subservice: [ssPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subservice:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderCSDSliders(csdId); }
    };
    const saveCSDAddOn = async (csdId, sliders) => {
        if (!csdId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getAddOnCSD}?rason_ras=${csdId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.rason_id);

        for (const rason of sliders) {
            const rasonPayload = {
                rason_ras: csdId,
                rason_title: rason.rason_title,
                rason_subtitle: rason.rason_subtitle,
                rason_amount: rason.rason_amount,
            };
            const ssId = rason.id || rason.rason_id;

            try {
                if (
                    ssId &&
                    existingSubIds.includes(parseInt(ssId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAddOnCSD}/${ssId}`, { rasons: rasonPayload });
                } else {
                    if (!ssId || !existingSubIds.includes(parseInt(ssId))) {
                        await axios.post(API_ENDPOINTS.createAddOnCSD, { rasons: [rasonPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save rason:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderCSDSliders(csdId); }
    };
    const saveStudy = async (savedSectionId, savedPageId) => {
        const studys = await pageRef.current?.getStudys?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getStudy}?std_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.std_id);

        if (studys.length > 0 && savedSectionId) {
            for (const study of studys) {
                const std_sec = study.std_sec || savedSectionId;
                const page_id = study.page_id || savedPageId;

                const StudyPayload = {
                    std_sec: std_sec,
                    std_title: study.std_title,
                    std_subtitle: study.std_subtitle,
                    std_type: parseInt(study.std_type),
                    page_id: page_id,
                };

                if (
                    study.std_id &&
                    existingServiceIds.includes(parseInt(study.std_id)) &&
                    parseInt(std_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateStudy}/${study.std_id}`, { study: StudyPayload });
                    await saveSubStudyDegreeSliders(study.std_id, study.substudys || []);
                } else {
                    if (!study.std_id|| !existingServiceIds.includes(parseInt(study.std_id))) {
                        const res = await axios.post(API_ENDPOINTS.createStudy, { study: [StudyPayload] });
                        const createdId = res.data?.data?.[0]?.std_id;
                        if (createdId) {
                            await saveSubStudyDegreeSliders(study.std_id, study.substudys || []);
                        }
                    }
                }
            }
        }
    };
    const saveSubStudyDegreeSliders = async (studyId, sliders) => {
        if (!studyId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubStudyDegree}?y_std=${studyId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.y_id);

        for (const year of sliders) {
            const yearPayload = {
                y_std: studyId,
                y_title: year.y_title,
                y_subtitle: year.y_subtitle,
                y_detail: year.y_detail,
                display: year.display,
            };
            const yId = year.id || year.y_id;

            try {
                if (
                    yId &&
                    existingSubIds.includes(parseInt(yId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubStudyDegree}/${yId}`, { year: yearPayload });
                } else {
                    if (!yId || !existingSubIds.includes(parseInt(yId))) {
                        await axios.post(API_ENDPOINTS.createSubStudyDegree, { year: [yearPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save year:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderSubStudyDegreeSliders(studyId); }
    };
    const saveAvailable = async (savedSectionId, savedPageId) => {
        const availables = await pageRef.current?.getAvailables?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getAvailable}?apd_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.apd_id);

        if (availables.length > 0 && savedSectionId) {
            for (const available of availables) {
                const apd_sec = available.apd_sec || savedSectionId;
                const page_id = available.page_id || savedPageId;

                const AvailablePayload = {
                    apd_sec: apd_sec,
                    apd_title: available.apd_title,
                    page_id: page_id,
                };

                if (
                    available.apd_id &&
                    existingServiceIds.includes(parseInt(available.apd_id)) &&
                    parseInt(apd_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAvailable}/${available.apd_id}`, { available: AvailablePayload });
                    await saveSubAvailableSliders(available.apd_id, available.subavailables || []);
                } else {
                    if (!available.apd_id|| !existingServiceIds.includes(parseInt(available.apd_id))) {
                        const res = await axios.post(API_ENDPOINTS.createAvailable, { available: [AvailablePayload] });
                        const createdId = res.data?.data?.[0]?.apd_id;
                        if (createdId) {
                            await saveSubAvailableSliders(available.apd_id, available.subavailables || []);
                        }
                    }
                }
            }
        }
    };
    const saveSubAvailableSliders = async (availableId, sliders) => {
        if (!availableId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubAvailable}?sapd_apd=${availableId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.sapd_id);

        for (const subavailable of sliders) {
            const subAvailablePayload = {
                sapd_apd: availableId,
                sapd_title: subavailable.sapd_title,
                sapd_img: subavailable.sapd_image,
                sapd_routepage: subavailable.sapd_routepage,
                display: subavailable.display,
            };
            const sapdId = subavailable.id || subavailable.sapd_id;

            try {
                if (
                    sapdId &&
                    existingSubIds.includes(parseInt(sapdId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubAvailable}/${sapdId}`, { subapd: subAvailablePayload });
                } else {
                    if (!sapdId || !existingSubIds.includes(parseInt(sapdId))) {
                        await axios.post(API_ENDPOINTS.createSubAvailable, { subapd: [subAvailablePayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subapd:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderSubAvailableSliders(availableId); }
    };
    const saveRequirement = async (savedSectionId, savedPageId) => {
        const requirements = await pageRef.current?.getRequirements?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getCriteria}?gc_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.gc_id);

        if (requirements.length > 0 && savedSectionId) {
            for (const requirement of requirements) {
                const gc_sec = requirement.gc_sec || savedSectionId;
                const page_id = requirement.page_id || savedPageId;
                const requirementPayload = {
                    gc_sec: gc_sec,
                    gc_title: requirement.gc_title || '',
                    gc_tag: requirement.gc_tag || '',
                    gc_type: requirement.gc_type || null,
                    gc_detail: requirement.gc_detail || '',
                    gc_img1: requirement.gc_img1 || null,
                    gc_img2: requirement.gc_img2 || null,
                    page_id: page_id,
                };

                if(
                    requirement.gc_id &&
                    existingServiceIds.includes(parseInt(requirement.gc_id)) &&
                    parseInt(gc_sec) === parseInt(savedSectionId) &&
                    parseInt(page_id) === parseInt(savedPageId)
                ){
                    await axios.post(`${API_ENDPOINTS.updateCriteria}/${requirement.gc_id}`, { criteria: requirementPayload });
                    await saveSubRequirement(requirement.gc_id, requirement.subrequirements || []);
                } else {
                    if (!requirement.gc_id || !existingServiceIds.includes(parseInt(requirement.gc_id))) {
                        await axios.post(API_ENDPOINTS.createCriteria, { criteria: [requirementPayload] });
                        const createdId = res.data?.data?.[0]?.gc_id;
                        if (createdId) {
                            await saveSubRequirement(requirement.gc_id, requirement.subrequirements || []);
                        }
                    }
                }
            }
        }
    }
    const saveSubRequirement = async (requirementId, sliders) => {
        if (!requirementId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubRequirement}?gca_gc=${requirementId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.gca_id);

        for (const subavailable of sliders) {
            const subAvailablePayload = {
                gca_gc: requirementId,
                gca_tag: subavailable.gca_tag,
                gca_btntitle: subavailable.gca_btntitle,
                gca_btnlink: subavailable.gca_btnlink,
            };
            const gcaddonId = subavailable.id || subavailable.gca_id;

            try {
                if (
                    gcaddonId &&
                    existingSubIds.includes(parseInt(gcaddonId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubRequirement}/${gcaddonId}`, { gcaddon: subAvailablePayload });
                } else {
                    if (!gcaddonId || !existingSubIds.includes(parseInt(gcaddonId))) {
                        await axios.post(API_ENDPOINTS.createSubRequirement, { gcaddon: [subAvailablePayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subapd:", error.response?.data || error.message);
            }
        }
    };

    // sliders
    const saveSlideshow = async (savedSectionId, savedPageId) => {
        const slideshows = await pageRef.current?.getSlideshows?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getSlideshow}?ban_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.slider_id);

        if (slideshows.length > 0 && savedSectionId) {
            for (const item of slideshows) {
                const slider_sec = item.slider_sec || savedSectionId;
                const page_id = item.page_id || savedPageId;

                const payload = {
                    ...item,
                    slider_sec: slider_sec,
                    page_id: page_id,
                };

            if (
                item.slider_id &&
                existingServiceIds.includes(parseInt(item.slider_id)) &&
                parseInt(slider_sec) === parseInt(savedSectionId) &&
                parseInt(page_id) === parseInt(savedPageId)
            ) {
                    await axios.post(`${API_ENDPOINTS.updateSlideshow}/${item.slider_id}`, { Slideshow: payload });
                } else {
                    if (!item.s_id || !existingServiceIds.includes(parseInt(item.s_id))) {
                        await axios.post(API_ENDPOINTS.createSlideshow, { Slideshow: [payload] });
                    }
                }
            }

            if (slideshows.length > 0) {reorderSlideshow();}
        }
    }
    const saveService = async (savedSectionId, savedPageId) => {
        const services = await pageRef.current?.getServices?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getService}?ban_sec=${savedSectionId}`);
        const existingServices = response.data?.data || [];
        const existingServiceIds = existingServices.map(service => service.s_id);

        if (services.length > 0 && savedSectionId) {
            for (const item of services) {
                const s_sec = item.s_sec || savedSectionId;
                const page_id = item.page_id || savedPageId;

                const payload = {
                    ...item,
                    s_sec: s_sec,
                    page_id: page_id,
                };

            if (
                item.s_id &&
                existingServiceIds.includes(parseInt(item.s_id)) &&
                parseInt(s_sec) === parseInt(savedSectionId) &&
                parseInt(page_id) === parseInt(savedPageId)
            ) {
                    await axios.post(`${API_ENDPOINTS.updateService}/${item.s_id}`, { Service: payload });
                } else {
                    if (!item.s_id || !existingServiceIds.includes(parseInt(item.s_id))) {
                        await axios.post(API_ENDPOINTS.createService, { Service: [payload] });
                    }
                }
            }

            if (services.length > 0) { reorderService(); }
        }
    }
    const reorderSlideshow = async () => {
        const slideshows = await pageRef.current?.getSlideshows?.() || [];

        const slideshowPayload = slideshows.map((slideshow, index) => ({
            slider_id: parseInt(slideshow.slider_id),
            slider_order: index + 1
        }));

        try {
            await axios.put(API_ENDPOINTS.updateSlideshowOrder, slideshowPayload);
        } catch (error) {
            console.error("Failed to reorder slideshow:", error.response?.data || error.message);
        }
    };
    const reorderService = async () => {
        const services = await pageRef.current?.getServices?.() || [];

        const servicePayload = services.map((service, index) => ({
            s_id: parseInt(service.s_id),
            s_order: index + 1
        }));

        try {
            await axios.put(API_ENDPOINTS.updateServiceOrder, servicePayload);
        } catch (error) {
            console.error("Failed to reorder services:", error.response?.data || error.message);
        }
    };
    const reorderAcadFacilitySliders = async (facilityId) => {
        const acadFacilities = await pageRef.current?.getFacilities?.() || [];
        const targetFacility = acadFacilities.find(f => parseInt(f.af_id) === parseInt(facilityId));

        if (!targetFacility || !Array.isArray(targetFacility.subservices)) return;

        const reorderedPayload = targetFacility.subservices.map((item, index) => ({
            ss_id: parseInt(item.ss_id || item.id),
            ss_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubserviceAFOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder academic facility sliders:", error.response?.data || error.message);
        }
    };
    const reorderSpecializationSliders = async (specializationId) => {
        const Specializations = await pageRef.current?.getSpecializations?.() || [];
        const targetSpecialization = Specializations.find(f => parseInt(f.ras_id) === parseInt(specializationId));

        if (!targetSpecialization || !Array.isArray(targetSpecialization.subservices)) return;

        const reorderedPayload = targetSpecialization.subservices.map((item, index) => ({
            ss_id: parseInt(item.ss_id || item.id),
            ss_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubserviceRASOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder academic facility sliders:", error.response?.data || error.message);
        }
    };
    const reorderSubtseSliders = async (typeId) => {
        const types = await pageRef.current?.getTypes?.() || [];
        const targetType = types.find(f => parseInt(f.tse_id) === parseInt(typeId));

        if (!targetType || !Array.isArray(targetType.subtypes)) return;

        const reorderedPayload = targetType.subtypes.map((item, index) => ({
            stse_id: parseInt(item.stse_id || item.id),
            stse_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubTypeOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder subtse sliders:", error.response?.data || error.message);
        }
    };
    const reorderCSDSliders = async (csdId) => {
        const csds = await pageRef.current?.getCSDs?.() || [];
        const targetCSD = csds.find(f => parseInt(f.ras_id) === parseInt(csdId));

        if (!targetCSD || !Array.isArray(targetCSD.subservices)) return;

        const reorderedPayload = targetCSD.subservices.map((item, index) => ({
            ss_id: parseInt(item.ss_id || item.id),
            ss_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubserviceRASOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder academic facility sliders:", error.response?.data || error.message);
        }
    };
    const reorderSubStudyDegreeSliders = async (studyId) => {
        const years = await pageRef.current?.getStudys?.() || [];
        const targetYear = years.find(f => parseInt(f.std_id) === parseInt(studyId));

        if (!targetYear || !Array.isArray(targetYear.substudys)) return;

        const reorderedPayload = targetYear.substudys.map((item, index) => ({
            y_id: parseInt(item.y_id || item.id),
            y_order: index + 1,
        }));

        console.log("Reorder: ", reorderedPayload);

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubStudyDegreeOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder subtse sliders:", error.response?.data || error.message);
        }
    };
    const reorderSubAvailableSliders = async (availableId) => {
        const availables = await pageRef.current?.getAvailables?.() || [];
        const targetAvailable = availables.find(f => parseInt(f.apd_id) === parseInt(availableId));

        if (!targetAvailable || !Array.isArray(targetAvailable.subavailables)) return;

        const reorderedPayload = targetAvailable.subavailables.map((item, index) => ({
            sapd_id: parseInt(item.sapd_id || item.id),
            sapd_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubAvailableOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder subtse sliders:", error.response?.data || error.message);
        }
    };

    const syncSection = async (savedPageId) => {
        const sections = pageRef.current?.getSections?.() || [];
        const page_id = savedPageId;

        if (!page_id) {
            console.error("Page_id is undefined! Cannot sync section.");
            return;
        }

        if (savedPageId) {
            const sectionPayload = sections.map((section, index) => ({
                sec_id: section.sec_id || null,
                sec_page: savedPageId,
                sec_order: section.sec_order,
                sec_type: section.sec_type,
                lang: section.lang,
                active: section.active ?? 1,
            }));

            try {
                const response = await axios.put(API_ENDPOINTS.syncSection, {
                    sec_page: page_id,
                    sections: sectionPayload,
                });

                const savedSectionId = Array.isArray(response.data?.data)
                ? response.data.data[0]?.sec_id
                : response.data?.data?.sec_id;

                // console.log("📥 savedSectionId:", savedSectionId);

                // sliders
                // saveSlideshow(savedSectionId, savedPageId);
                // saveService(savedSectionId, savedPageId);

                // single
                // saveBanner(savedSectionId, savedPageId);
                // saveInformation(savedSectionId, savedPageId);
                // saveTestimonial(savedSectionId, savedPageId);
                // saveAcademic(savedSectionId, savedPageId);
                // saveGallery(savedSectionId, savedPageId);
                // saveDepartment(savedSectionId, savedPageId);
                // saveCriteria(savedSectionId, savedPageId);
                // saveUnlock(savedSectionId, savedPageId);
                // saveFee(savedSectionId, savedPageId);

                // hybrid
                // saveFacilties(savedSectionId, savedPageId);
                // saveType(savedSectionId, savedPageId);
                // saveSpecializations(savedSectionId, savedPageId);
                // saveCSD(savedSectionId, savedPageId);
                // saveStudy(savedSectionId, savedPageId);
                // saveAvailable(savedSectionId, savedPageId);
                // saveRequirement(savedSectionId, savedPageId);

            } catch (error) {
                console.error("Failed to sync section:", error.response?.data || error.message);
            }
        }
    };

    const reorderSection = async () => {
        const sections = pageRef.current?.getSections?.() || [];

        const sectionPayload = sections.map((section, index) => ({
            sec_id: section.sec_id,
            sec_order: index + 1
        }));

        try {
            await axios.post(API_ENDPOINTS.updateSectionOrder, sectionPayload);
        } catch (error) {
            console.error("❌ Failed to reorder section:", error.response?.data || error.message);
        }
    };

    const savePage = async () => {
        const payload = {
            p_title: formData.p_title || '',
            p_alias: formData.p_alias || '',
            p_busy: !!formData.p_busy,
            display: !!formData.display,
            active: true,
            menu_id: formData.p_menu ?? null
        };


        try {
            let response;
            if (formData?.p_id) {
                response = await axios.post(`${API_ENDPOINTS.updatePage}/${formData.p_id}`, payload);
            } else {
                response = await axios.post(API_ENDPOINTS.createPage, payload);
            }

            const savedPageId = response.data?.data?.p_id;

            syncSection(savedPageId);
            reorderSection();

        } catch (error) {
            console.error('❌ Failed to save page or sections:', error.response?.data || error.message);
            throw error;
        }
    }

    const handleSave = async () => {
        try{
            await savePage();
            alert("Page save successfully");
        } catch (err) {
            console.error(" Error saving:", err);
        }
    };

    return (
        <div id="main-wrapper" className=" flex">
            <Aside/>
            <div className=" w-full page-wrapper overflow-hidden">
                <PageFieldHeader onSave={handleSave}/>
                <PageFieldBody
                    formData={formData}
                    setFormData={setFormData}
                    ref={pageRef}
                    pageData={formData}
                    page_id={formData.p_id}
                />
            </div>
        </div>
    )
}

export default PageField