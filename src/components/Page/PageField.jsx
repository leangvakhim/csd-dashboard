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

        if (programs.length > 0 && savedSectionId) {
            for (const program of programs) {

                const programPayload = {
                    dep_sec: savedSectionId,
                    dep_title: program.dep_title || '',
                    dep_detail: program.dep_detail || '',
                    dep_img1: program.dep_img1 || null,
                    dep_img2: program.dep_img2 || null,
                    page_id: savedPageId,
                };
                if(program.dep_title === '' && program.dep_detail === '' && program.dep_img1 === null && program.dep_img2 === null) return;

                if( program.dep_id ){
                    await axios.post(`${API_ENDPOINTS.updateDepartment}/${program.dep_id}`, { programs: programPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createDepartment, { programs: [programPayload] });
                }
            }
        }
    };
    const saveBanner = async (savedSectionId, savedPageId) => {
        const banners = await pageRef.current?.getBanners?.() || [];

        if (banners.length > 0 && savedSectionId) {
            for (const banner of banners) {

                const bannerPayload = {
                    ban_sec: savedSectionId,
                    ban_title: banner.ban_title || '',
                    ban_subtitle: banner.ban_subtitle || '',
                    ban_img: banner.ban_img || null,
                    page_id: savedPageId,
                };

                if(banner.ban_title === '' && banner.ban_subtitle === '' && banner.ban_img === null) return;
                if ( banner.ban_id ) {
                    await axios.post(`${API_ENDPOINTS.updateBanner}/${banner.ban_id}`, { banners: bannerPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createBanner, { banners: [bannerPayload] });
                }
            }
        }
    };
    const saveInformation = async (savedSectionId, savedPageId) => {
        const informations = await pageRef.current?.getInformations?.() || [];

        if (informations.length > 0 && savedSectionId) {
            for (const information of informations) {

                const informationPayload = {
                    text_sec: savedSectionId,
                    title: information.title || '',
                    desc: information.desc || '',
                    text_type: information.text_type || null,
                    page_id: savedPageId,
                };

                if( information.title === '' && information.desc === '' && information.text_type === null) return;

                if ( information.text_id ) {
                    await axios.post(`${API_ENDPOINTS.updateText}/${information.text_id}`, { texts: informationPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createText, { texts: [informationPayload] });
                }
            }
        }
    };
    const saveTestimonial = async (savedSectionId, savedPageId) => {
        const testimonials = await pageRef.current?.getTestimonials?.() || [];

        if (testimonials.length > 0 && savedSectionId) {
            for (const testimonial of testimonials) {

                const testimonialPayload = {
                    t_sec: savedSectionId,
                    t_title: testimonial.t_title || '',
                    page_id: savedPageId,
                };

                if ( testimonial.t_id ) {
                    await axios.post(`${API_ENDPOINTS.updateTestimonial}/${testimonial.t_id}`, { testimonials: testimonialPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createTestimonial, { testimonials: [testimonialPayload] });
                }
            }
        }
    };
    const saveAcademic = async (savedSectionId, savedPageId) => {
        const academics = await pageRef.current?.getAcademics?.() || [];

        if (academics.length > 0 && savedSectionId) {
            for (const academic of academics) {

                const academicPayload = {
                    acad_sec: savedSectionId,
                    acad_title: academic.acad_title || '',
                    acad_detail: academic.acad_detail || '',
                    acad_img: academic.acad_img || null,
                    acad_btntext1: academic.acad_btntext1 || '',
                    acad_btntext2: academic.acad_btntext2 || '',
                    acad_routepage: academic.acad_routepage || '',
                    acad_routetext: academic.acad_routetext || '',
                    page_id: savedPageId,
                };

                if ( academic.acad_id  ) {
                    await axios.post(`${API_ENDPOINTS.updateAcademic}/${academic.acad_id}`, { academics: academicPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createAcademic, { academics: [academicPayload] });
                }
            }
        }
    };
    const saveGallery = async (savedSectionId, savedPageId) => {
        const galleries = await pageRef.current?.getGallery?.() || [];

        if (galleries.length > 0 && savedSectionId) {
            for (const gallery of galleries) {
                const gal_sec = gallery.gal_sec;
                const page_id = gallery.page_id;
                const galleryPayload = {
                    gal_sec: savedSectionId,
                    gal_img1: gallery.gal_img1,
                    gal_img2: gallery.gal_img2,
                    gal_img3: gallery.gal_img3,
                    gal_img4: gallery.gal_img4,
                    gal_img5: gallery.gal_img5,
                    gal_text: gallery.gal_text,
                    page_id: savedPageId,
                };

                if ( gallery.gal_id ) {
                    await axios.post(`${API_ENDPOINTS.updateGallery}/${gallery.gal_id}`, { gallery: galleryPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createGallery, { gallery: [galleryPayload] });
                }
            }
        }
    };
    const saveCriteria = async (savedSectionId, savedPageId) => {
        const criterias = await pageRef.current?.getCriterias?.() || [];

        if (criterias.length > 0 && savedSectionId) {
            for (const criteria of criterias) {

                const criteriaPayload = {
                    gc_sec: savedSectionId,
                    gc_title: criteria.gc_title || '',
                    gc_tag: criteria.gc_tag || '',
                    gc_type: criteria.gc_type || '',
                    gc_detail: criteria.gc_detail || '',
                    gc_img1: criteria.gc_img1 || null,
                    gc_img2: criteria.gc_img2 || null,
                    page_id: savedPageId,
                };

                if( criteria.gc_id ){
                    await axios.post(`${API_ENDPOINTS.updateCriteria}/${criteria.gc_id}`, { criteria: criteriaPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createCriteria, { criteria: [criteriaPayload] });
                }
            }
        }
    };
    const saveUnlock = async (savedSectionId, savedPageId) => {
        const unlocks = await pageRef.current?.getUnlocks?.() || [];

        if (unlocks.length > 0 && savedSectionId) {
            for (const unlock of unlocks) {

                const unlockPayload = {
                    umd_sec: savedSectionId,
                    umd_title: unlock.umd_title || '',
                    umd_detail: unlock.umd_detail || '',
                    umd_img: unlock.umd_img || null,
                    umd_routepage: unlock.umd_routepage || '',
                    umd_btntext: unlock.umd_btntext || '',
                    page_id: savedPageId,
                };

                if( unlock.umd_id ){
                    await axios.post(`${API_ENDPOINTS.updateUnlock}/${unlock.umd_id}`, { unlock: unlockPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createUnlock, { unlock: [unlockPayload] });
                }
            }
        }
    };
    const saveFee = async (savedSectionId, savedPageId) => {
        const fees = await pageRef.current?.getFees?.() || [];

        if (fees.length > 0 && savedSectionId) {
            for (const fee of fees) {

                const feePayload = {
                    fe_sec: savedSectionId,
                    fe_title: fee.fe_title || '',
                    fe_desc: fee.fe_desc || '',
                    fe_img: fee.fe_img || null,
                    fe_price: fee.fe_price || '',
                    page_id: savedPageId,
                };

                if( fee.fe_id ){
                    await axios.post(`${API_ENDPOINTS.updateFee}/${fee.fe_id}`, { fee: feePayload });
                } else {
                    await axios.post(API_ENDPOINTS.createFee, { fee: [feePayload] });
                }
            }
        }
    };
    const saveIntroduction = async (savedSectionId, savedPageId) => {
        const introductions = await pageRef.current?.getIntroductions?.() || [];

        if (introductions.length > 0 && savedSectionId) {
            for (const introduction of introductions) {
                const introductionPayload = {
                    in_sec: savedSectionId,
                    in_title: introduction.in_title || '',
                    in_detail: introduction.in_detail || '',
                    inadd_title: introduction.inadd_title || '',
                    in_addsubtitle: introduction.in_addsubtitle || '',
                    in_img: introduction.in_img || null,
                    page_id: savedPageId,
                };


                if( introduction.in_id ){
                    await axios.post(`${API_ENDPOINTS.updateIntroduction}/${introduction.in_id}`, { introduction: introductionPayload });
                } else {
                    await axios.post(API_ENDPOINTS.createIntroduction, { introduction: [introductionPayload] });
                }
            }
        }
    };
    const saveHeaderSection = async (type, savedSectionId, savedPageId) => {
        const dataMap = {
            new: 'getNews',
            event: 'getEvents',
            announcement: 'getAnnouncements',
            research: 'getResearchs',
            faculty: 'getFacultys',
            lab: 'getLabs',
            scholarship: 'getScholarships',
            career: 'getCareers',
            partner: 'getPartners',
            feedback: 'getFeedbacks'
        };

        const dataKey = dataMap[type];
        if (!dataKey) return;

        const itemsKey = 'headersection';
        const updateEndpoint = API_ENDPOINTS.updateHeaderSection;
        const createEndpoint = API_ENDPOINTS.createHeaderSection;

        const items = await pageRef.current?.[dataKey]?.() || [];
        const response = await axios.get(`${API_ENDPOINTS.getHeaderSection}?hsec_sec=${savedSectionId}`);
        const existingItems = response.data?.data || [];
        const existingIds = existingItems.map(item => item.hsec_id);

        if (items.length > 0 && savedSectionId) {
            for (const item of items) {
                const hsec_sec = item.hsec_sec || savedSectionId;
                const resolvedPageId = item.page_id || savedPageId;
                const payload = {
                    hsec_sec: savedSectionId,
                    hsec_title: item.hsec_title || '',
                    hsec_subtitle: item.hsec_subtitle || '',
                    hsec_btntitle: item.hsec_btntitle || '',
                    hsec_amount: parseInt(item.hsec_amount) || '',
                    hsec_routepage: item.hsec_routepage || '',
                    page_id: resolvedPageId,
                };

                const itemId = item.hsec_id;
                if (
                    itemId &&
                    existingIds.includes(parseInt(itemId)) &&
                    parseInt(hsec_sec) === parseInt(savedSectionId) &&
                    parseInt(resolvedPageId) === parseInt(savedPageId)
                ) {
                    await axios.post(`${updateEndpoint}/${itemId}`, { [itemsKey]: payload });
                } else {
                    if (!itemId || !existingIds.includes(parseInt(itemId))) {
                        await axios.post(createEndpoint, { [itemsKey]: [payload] });
                    }
                }
            }
        }
    };

    // hybrid
    const saveFacilties = async (savedSectionId, savedPageId) => {
        const acadFacilities = await pageRef.current?.getFacilities?.() || [];

        if (acadFacilities.length > 0 && savedSectionId) {
            for (const acadFacility of acadFacilities) {

                const acadFacilitiesPayload = {
                    af_sec: savedSectionId,
                    af_img: acadFacility.af_img,
                    af_text: acadFacility.af_text,
                    page_id: savedPageId,
                };

                if ( acadFacility.af_id ) {
                    await axios.post(`${API_ENDPOINTS.updateAcadFacilities}/${acadFacility.af_id}`, { facilities: acadFacilitiesPayload });
                    await saveAcadFacilitySliders(acadFacility.af_id, acadFacility.subservices || []);

                } else {
                    const res = await axios.post(API_ENDPOINTS.createAcadFacilities, { facilities: [acadFacilitiesPayload] });
                    const createdId = res.data?.data?.[0]?.af_id;
                    if (createdId) {
                        await saveAcadFacilitySliders(acadFacility.af_id, acadFacility.subservices || []);
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

        if (Specializations.length > 0 && savedSectionId) {
            for (const specialization of Specializations) {

                const specializationPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: specialization.ras_img1,
                    ras_img2: specialization.ras_img2,
                    ras_text: specialization.ras_text,
                    page_id: savedPageId,
                };

                if ( specialization.ras_id ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${specialization.ras_id}`, { specialization: specializationPayload });
                    await saveSpecializationSliders(specialization.ras_id, specialization.subservices || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [specializationPayload] });
                    const createdId = res.data?.data?.[0]?.ras_id;
                    if (createdId) {
                        await saveSpecializationSliders(specialization.ras_id, specialization.subservices || []);
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

        if (types.length > 0 && savedSectionId) {
            for (const type of types) {

                const TypePayload = {
                    tse_sec: savedSectionId,
                    tse_text: type.tse_text,
                    tse_type: parseInt(type.tse_type),
                    page_id: savedPageId,
                };

                if ( type.tse_id ) {
                    await axios.post(`${API_ENDPOINTS.updateType}/${type.tse_id}`, { type: TypePayload });
                    await saveSubTypeSliders(type.tse_id, type.subtypes || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createType, { type: [TypePayload] });
                    const createdId = res.data?.data?.[0]?.tse_id;
                    if (createdId) {
                        await saveSubTypeSliders(type.tse_id, type.subtypes || []);
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

        if (csds.length > 0 && savedSectionId) {
            for (const csd of csds) {

                const csdPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: csd.ras_img1,
                    ras_img2: csd.ras_img2,
                    ras_text: csd.ras_text,
                    page_id: savedPageId,
                };

                if ( csd.ras_id ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${csd.ras_id}`, { specialization: csdPayload });
                    await saveCSDSliders(csd.ras_id, csd.subservices || []);
                    await saveCSDAddOn(csd.ras_id, csd.rasons || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [csdPayload] });
                    const createdId = res.data?.data?.[0]?.ras_id;
                    if (createdId) {
                        await saveCSDSliders(csd.ras_id, csd.subservices || []);
                        await saveCSDAddOn(csd.ras_id, csd.rasons || []);
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

        if (studys.length > 0 && savedSectionId) {
            for (const study of studys) {

                const StudyPayload = {
                    std_sec: savedSectionId,
                    std_title: study.std_title,
                    std_subtitle: study.std_subtitle,
                    std_type: parseInt(study.std_type),
                    page_id: savedPageId,
                };

                if ( study.std_id ) {
                    await axios.post(`${API_ENDPOINTS.updateStudy}/${study.std_id}`, { study: StudyPayload });
                    await saveSubStudyDegreeSliders(study.std_id, study.substudys || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createStudy, { study: [StudyPayload] });
                    const createdId = res.data?.data?.[0]?.std_id;
                    if (createdId) {
                        await saveSubStudyDegreeSliders(study.std_id, study.substudys || []);
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

        if (availables.length > 0 && savedSectionId) {
            for (const available of availables) {

                const AvailablePayload = {
                    apd_sec: savedSectionId,
                    apd_title: available.apd_title,
                    page_id: savedPageId,
                };

                if ( available.apd_id ) {
                    await axios.post(`${API_ENDPOINTS.updateAvailable}/${available.apd_id}`, { available: AvailablePayload });
                    await saveSubAvailableSliders(available.apd_id, available.subavailables || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createAvailable, { available: [AvailablePayload] });
                    const createdId = res.data?.data?.[0]?.apd_id;
                    if (createdId) {
                        await saveSubAvailableSliders(available.apd_id, available.subavailables || []);
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

        if (requirements.length > 0 && savedSectionId) {
            for (const requirement of requirements) {
                const requirementPayload = {
                    gc_sec: savedSectionId,
                    gc_title: requirement.gc_title || '',
                    gc_tag: requirement.gc_tag || '',
                    gc_type: requirement.gc_type || null,
                    gc_detail: requirement.gc_detail || '',
                    gc_img1: requirement.gc_img1 || null,
                    gc_img2: requirement.gc_img2 || null,
                    page_id: savedPageId,
                };

                if( requirement.gc_id ){
                    await axios.post(`${API_ENDPOINTS.updateCriteria}/${requirement.gc_id}`, { criteria: requirementPayload });
                    await saveSubRequirement(requirement.gc_id, requirement.subrequirements || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createCriteria, { criteria: [requirementPayload] });
                    const createdId = res.data?.data?.[0]?.gc_id;
                    if (createdId) {
                        await saveSubRequirement(requirement.gc_id, requirement.subrequirements || []);
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
    const saveFuture = async (savedSectionId, savedPageId) => {
        const futures = await pageRef.current?.getFutures?.() || [];

        if (futures.length > 0 && savedSectionId) {
            for (const future of futures) {

                const FuturePayload = {
                    uf_sec: savedSectionId,
                    uf_title: future.uf_title,
                    uf_subtitle: future.uf_subtitle,
                    uf_img: future.uf_img,
                    page_id: savedPageId,
                };

                if ( future.uf_id ) {
                    await axios.post(`${API_ENDPOINTS.updateFuture}/${future.uf_id}`, { future: FuturePayload });
                    await saveSubFutureSliders(future.uf_id, future.subfutures || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createFuture, { future: [FuturePayload] });
                    const createdId = res.data?.data?.[0]?.uf_id;
                    if (createdId) {
                        await saveSubFutureSliders(future.uf_id, future.subfutures || []);
                    }
                }
            }
        }
    };
    const saveSubFutureSliders = async (futureId, sliders) => {
        if (!futureId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubFuture}?ufa_uf=${futureId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.ufa_id);

        for (const subfuture of sliders) {
            const subFuturePayload = {
                ufa_uf: futureId,
                ufa_title: subfuture.ufa_title,
                ufa_subtitle: subfuture.ufa_subtitle,
                display: subfuture.display,
            };
            const subfutureId = subfuture.id || subfuture.ufa_id;

            try {
                if (
                    subfutureId &&
                    existingSubIds.includes(parseInt(subfutureId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubFuture}/${subfutureId}`, { ufaddon: subFuturePayload });
                } else {
                    if (!subfutureId || !existingSubIds.includes(parseInt(subfutureId))) {
                        await axios.post(API_ENDPOINTS.createSubFuture, { ufaddon: [subFuturePayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save ufaddon:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderFutureSliders(futureId); }
    };
    const savePotentials = async (savedSectionId, savedPageId) => {
        const Potentials = await pageRef.current?.getPotentials?.() || [];

        if (Potentials.length > 0 && savedSectionId) {
            for (const potential of Potentials) {

                const potentialPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: potential.ras_img1,
                    ras_img2: potential.ras_img2,
                    ras_text: potential.ras_text,
                    page_id: savedPageId,
                };

                if ( potential.ras_id  ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${potential.ras_id}`, { specialization: potentialPayload });
                    await savePotentialSliders(potential.ras_id, potential.subservices || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [potentialPayload] });
                    const createdId = res.data?.data?.[0]?.ras_id;
                    if (createdId) {
                        await savePotentialSliders(potential.ras_id, potential.subservices || []);
                    }
                }
            }
        }
    };
    const savePotentialSliders = async (potentialId, sliders) => {
        if (!potentialId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubserviceAF}?ss_ras=${potentialId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .filter(item => item.ss_af === null)
            .map(item => item.ss_id);

        for (const ss of sliders) {
            const ssPayload = {
                ss_af: null,
                ss_ras: potentialId,
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

        if (sliders.length > 0) { await reorderPotentialSliders(potentialId); }
    };
    const saveInnovations = async (savedSectionId, savedPageId) => {
        const innovations = await pageRef.current?.getInnovations?.() || [];

        if (innovations.length > 0 && savedSectionId) {
            for (const innovation of innovations) {

                const innovationPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: innovation.ras_img1,
                    ras_img2: innovation.ras_img2,
                    ras_text: innovation.ras_text,
                    page_id: savedPageId,
                };

                if ( innovation.ras_id ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${innovation.ras_id}`, { specialization: innovationPayload });
                    await saveInnovationSliders(innovation.ras_id, innovation.subservices || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [innovationPayload] });
                    const createdId = res.data?.data?.[0]?.ras_id;
                    if (createdId) {
                        await saveInnovationSliders(innovation.ras_id, innovation.subservices || []);
                    }
                }
            }
        }
    };
    const saveInnovationSliders = async (innovationId, sliders) => {
        if (!innovationId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubserviceAF}?ss_ras=${innovationId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .filter(item => item.ss_af === null)
            .map(item => item.ss_id);

        for (const ss of sliders) {
            const ssPayload = {
                ss_af: null,
                ss_ras: innovationId,
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

        if (sliders.length > 0) { await reorderInnovationSliders(innovationId); }
    };
    const saveFaqs = async (savedSectionId, savedPageId) => {
        const faqs = await pageRef.current?.getFAQs?.() || [];

        if (faqs.length > 0 && savedSectionId) {
            for (const faq of faqs) {

                const faqPayload = {
                    faq_sec: savedSectionId,
                    faq_title: faq.faq_title,
                    faq_subtitle: faq.faq_subtitle,
                    page_id: savedPageId,
                };

                if ( faq.faq_id ) {
                    await axios.post(`${API_ENDPOINTS.updateFAQ}/${faq.faq_id}`, { faq: faqPayload });
                    await saveFAQSliders(faq.faq_id, faq.subfaqs || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createFAQ, { faq: [faqPayload] });
                    const createdId = res.data?.data?.[0]?.faq_id;
                    if (createdId) {
                        await saveFAQSliders(faq.faq_id, faq.subfaqs || []);
                    }
                }
            }
        }
    };
    const saveFAQSliders = async (faqId, sliders) => {
        if (!faqId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubFAQ}?fa_faq=${faqId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.fa_id);

        for (const fa of sliders) {
            const faPayload = {
                fa_faq: faqId,
                fa_question: fa.fa_question,
                fa_answer: fa.fa_answer,
                display: fa.display,
            };
            const faId = fa.id || fa.fa_id;

            try {
                if (
                    faId &&
                    existingSubIds.includes(parseInt(faId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubFAQ}/${faId}`, { faqaddon: faPayload });
                } else {
                    if (!faId || !existingSubIds.includes(parseInt(faId))) {
                        await axios.post(API_ENDPOINTS.createSubFAQ, { faqaddon: [faPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subservice:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderFAQSliders(faqId); }
    };
    const saveApplys = async (savedSectionId, savedPageId) => {
        const applys = await pageRef.current?.getApplys?.() || [];

        if (applys.length > 0 && savedSectionId) {
            for (const apply of applys) {

                const applyPayload = {
                    ha_sec: savedSectionId,
                    ha_title: apply.ha_title,
                    ha_img: apply.ha_img,
                    ha_tagtitle: apply.ha_tagtitle,
                    ha_subtitletag: apply.ha_subtitletag,
                    ha_date: apply.ha_date,
                    page_id: savedPageId,
                };

                if ( apply.ha_id ) {
                    await axios.post(`${API_ENDPOINTS.updateApply}/${apply.ha_id}`, { apply: applyPayload });
                    await saveApplySliders(apply.ha_id, apply.subservices || []);

                } else {
                    const res = await axios.post(API_ENDPOINTS.createApply, { apply: [applyPayload] });
                    const createdId = res.data?.data?.[0]?.ha_id;
                    if (createdId) {
                        await saveApplySliders(apply.ha_id, apply.subservices || []);

                    }
                }
            }
        }
    };
    const saveApplySliders = async (applyId, sliders) => {
        if (!applyId || !Array.isArray(sliders)) return;
        const res = await axios.get(`${API_ENDPOINTS.getSubApply}?sha_ha=${applyId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.sha_id);

        for (const sha of sliders) {
            const subApplyPayload = {
                sha_ha: applyId,
                sha_title: sha.sha_title,
                display: sha.display,
            };
            const shaId = sha.id || sha.sha_id;

            try {
                if (
                    shaId &&
                    existingSubIds.includes(parseInt(shaId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubApply}/${shaId}`, { subapply: subApplyPayload });
                } else {
                    if (!shaId || !existingSubIds.includes(parseInt(shaId))) {
                        await axios.post(API_ENDPOINTS.createSubApply, { subapply: [subApplyPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subservice:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderApplySliders(applyId); }
    };
    const saveImportants = async (savedSectionId, savedPageId) => {
        const importants = await pageRef.current?.getImportants?.() || [];

        if (importants.length > 0 && savedSectionId) {
            for (const important of importants) {

                const importantPayload = {
                    idd_sec: savedSectionId,
                    idd_title: important.idd_title,
                    idd_subtitle: important.idd_subtitle,
                    page_id: savedPageId,
                };

                if ( important.idd_id ) {
                    await axios.post(`${API_ENDPOINTS.updateImportant}/${important.idd_id}`, { important: importantPayload });
                    await saveImportantSliders(important.idd_id, important.subservices || []);
                } else {
                    const res = await axios.post(API_ENDPOINTS.createImportant, { important: [importantPayload] });
                    const createdId = res.data?.data?.[0]?.idd_id;
                    if (createdId) {
                        await saveImportantSliders(important.idd_id, important.subservices || []);
                    }
                }
            }
        }
    };
    const saveImportantSliders = async (importantId, sliders) => {
        if (!importantId || !Array.isArray(sliders)) return;
        const res = await axios.get(`${API_ENDPOINTS.getSubImportant}?sidd_idd=${importantId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingSubIds = existingSubservices
            .map(item => item.sidd_id);

        for (const sidd of sliders) {
            const subApplyPayload = {
                sidd_idd: importantId,
                sidd_title: sidd.sidd_title,
                sidd_subtitle: sidd.sidd_subtitle,
                sidd_tag: sidd.sidd_tag,
                sidd_date: sidd.sidd_date,
                display: sidd.display,
            };
            const siddId = sidd.id || sidd.sidd_id;

            try {
                if (
                    siddId &&
                    existingSubIds.includes(parseInt(siddId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubImportant}/${siddId}`, { subimportant: subApplyPayload });
                } else {
                    if (!siddId || !existingSubIds.includes(parseInt(siddId))) {
                        await axios.post(API_ENDPOINTS.createSubImportant, { subimportant: [subApplyPayload] });
                    }
                }
            } catch (error) {
                console.error("❌ Failed to save subservice:", error.response?.data || error.message);
            }
        }

        if (sliders.length > 0) { await reorderImportantSliders(importantId); }
    };

    // sliders
    const saveSlideshow = async (savedSectionId, savedPageId) => {
        const slideshows = await pageRef.current?.getSlideshows?.() || [];

        if (slideshows.length > 0 && savedSectionId) {
            for (const item of slideshows) {

                const payload = {
                    ...item,
                    slider_sec: savedSectionId,
                    page_id: savedPageId,
                };

            if ( item.slider_id) {
                await axios.post(`${API_ENDPOINTS.updateSlideshow}/${item.slider_id}`, { Slideshow: payload });
            } else {
                await axios.post(API_ENDPOINTS.createSlideshow, { Slideshow: [payload] });
                }
            }

            if (slideshows.length > 0) {reorderSlideshow();}
        }
    }
    const saveService = async (savedSectionId, savedPageId) => {
        const services = await pageRef.current?.getServices?.() || [];

        if (services.length > 0 && savedSectionId) {
            for (const item of services) {

                const payload = {
                    ...item,
                    s_sec: savedSectionId,
                    page_id: savedPageId,
                };

            if ( item.s_id ) {
                    await axios.post(`${API_ENDPOINTS.updateService}/${item.s_id}`, { Service: payload });
                } else {
                    await axios.post(API_ENDPOINTS.createService, { Service: [payload] });
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
    const reorderFutureSliders = async (futureId) => {
        const futures = await pageRef.current?.getFutures?.() || [];
        const targetFuture = futures.find(f => parseInt(f.uf_id) === parseInt(futureId));

        if (!targetFuture || !Array.isArray(targetFuture.subfutures)) return;

        const reorderedPayload = targetFuture.subfutures.map((item, index) => ({
            ufa_id: parseInt(item.ufa_id || item.id),
            ufa_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubFutureOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder subtse sliders:", error.response?.data || error.message);
        }
    };
    const reorderPotentialSliders = async (potentialId) => {
        const Potentials = await pageRef.current?.getPotentials?.() || [];
        const targetPotential = Potentials.find(f => parseInt(f.ras_id) === parseInt(potentialId));

        if (!targetPotential || !Array.isArray(targetPotential.subservices)) return;

        const reorderedPayload = targetPotential.subservices.map((item, index) => ({
            ss_id: parseInt(item.ss_id || item.id),
            ss_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubserviceRASOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder academic facility sliders:", error.response?.data || error.message);
        }
    };
    const reorderInnovationSliders = async (innovationId) => {
        const Innovations = await pageRef.current?.getInnovations?.() || [];
        const targetInnovation = Innovations.find(f => parseInt(f.ras_id) === parseInt(innovationId));

        if (!targetInnovation || !Array.isArray(targetInnovation.subservices)) return;

        const reorderedPayload = targetInnovation.subservices.map((item, index) => ({
            ss_id: parseInt(item.ss_id || item.id),
            ss_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubserviceRASOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder academic facility sliders:", error.response?.data || error.message);
        }
    };
    const reorderFAQSliders = async (faqId) => {
        const faqs = await pageRef.current?.getFAQs?.() || [];
        const targetFAQ = faqs.find(f => parseInt(f.faq_id) === parseInt(faqId));

        if (!targetFAQ || !Array.isArray(targetFAQ.subfaqs)) return;

        const reorderedPayload = targetFAQ.subfaqs.map((item, index) => ({
            fa_id: parseInt(item.fa_id || item.id),
            fa_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubFAQOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder faq sliders:", error.response?.data || error.message);
        }
    };
    const reorderApplySliders = async (applyId) => {
        const applys = await pageRef.current?.getApplys?.() || [];
        const targetApply = applys.find(f => parseInt(f.ha_id) === parseInt(applyId));

        if (!targetApply || !Array.isArray(targetApply.subservices)) return;

        const reorderedPayload = targetApply.subservices.map((item, index) => ({
            sha_id: parseInt(item.sha_id || item.id),
            sha_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubApplyOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder faq sliders:", error.response?.data || error.message);
        }
    };
    const reorderImportantSliders = async (importantId) => {
        const importants = await pageRef.current?.getImportants?.() || [];
        const targetImportant = importants.find(f => parseInt(f.idd_id) === parseInt(importantId));

        if (!targetImportant || !Array.isArray(targetImportant.subservices)) return;

        const reorderedPayload = targetImportant.subservices.map((item, index) => ({
            sidd_id: parseInt(item.sidd_id || item.id),
            sidd_order: index + 1,
        }));

        try {
            const response = await axios.post(API_ENDPOINTS.updateSubImportantOrder, reorderedPayload);
        } catch (error) {
            console.error("❌ Failed to reorder faq sliders:", error.response?.data || error.message);
        }
    };
    const sectionSaveHandlers = {
        Slideshow: saveSlideshow,
        Service: saveService,
        Programs: saveDepartment,
        Banner: saveBanner,
        Information: saveInformation,
        Testimonial: saveTestimonial,
        Academic: saveAcademic,
        Gallery: saveGallery,
        Criteria: saveCriteria,
        Unlock: saveUnlock,
        Fee: saveFee,
        Introduction: saveIntroduction,
        Facilities: saveFacilties,
        Specialization: saveSpecializations,
        Type: saveType,
        CSD: saveCSD,
        Study: saveStudy,
        Available: saveAvailable,
        Requirement: saveRequirement,
        Future: saveFuture,
        Potential: savePotentials,
        Innovation: saveInnovations,
        FAQ: saveFaqs,
        Apply: saveApplys,
        Important: saveImportants,
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
                await axios.put(API_ENDPOINTS.syncSection, {
                    sec_page: page_id,
                    sections: sectionPayload,
                });

                // Fetch updated section IDs after sync
                const updatedSectionRes = await axios.get(`${API_ENDPOINTS.getSection}?sec_page=${page_id}`);
                const updatedSections = updatedSectionRes.data?.data || [];

                const updatedSectionMap = updatedSections.reduce((acc, section) => {
                    acc[`${section.sec_order}_${section.sec_type}`] = section.sec_id;
                    return acc;
                }, {});

                for (const section of sections) {
                    const resolvedSecId = updatedSectionMap[`${section.sec_order}_${section.sec_type}`] || section.sec_id;
                    const resolvedPageId = section.sec_page || page_id;
                    const handler = sectionSaveHandlers[section.sec_type];
                    if (['New', 'Event', 'Announcement', 'Research', 'Faculty', 'Lab', 'Scholarship', 'Career', 'Partner', 'Feedback'].includes(section.sec_type)) {
                        await saveHeaderSection(section.sec_type.toLowerCase(), resolvedSecId, resolvedPageId);
                    } else if (handler) {
                        await handler(resolvedSecId, resolvedPageId);
                    } else {
                        console.warn(`⚠️ No save handler defined for section type: ${section.sec_type} with order: ${section.sec_order}`);
                    }
                }

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
            // window.location.reload();
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