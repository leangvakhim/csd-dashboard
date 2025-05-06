import React, { useState, useEffect, useRef } from 'react'
import PageFieldHeader from './PageFieldHeader'
import PageFieldBody from './PageFieldBody'
import Aside from '../Aside'
import axios from 'axios'
import { API_ENDPOINTS } from '../../service/APIConfig'
import { useLocation } from 'react-router-dom'
import { useLoading } from '../Context/LoadingContext'
import Swal from 'sweetalert2';

const PageField = () => {
    const location = useLocation();
    const pageData = location.state?.pageData;
    const pageRef = useRef();
    const {setLoading} = useLoading();
    const [formData, setFormData] = useState({
        p_title: '',
        p_alias: '',
        p_busy: 0,
        p_menu: null,
        display: false
    });

    useEffect(() => {
        if (pageData && pageData.data) {
            // setLoading(true);
            setFormData(pageData.data);
        }
        // setLoading(false);
    }, [pageData]);

    // Single
    const saveDepartment = async (savedSectionId, savedPageId) => {
        const programs = await pageRef.current?.getPrograms?.() || [];

        if (programs.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getDepartment);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.dep_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.dep_id);
            const existingDepartments = existingItems.map(slide => slide.dep_sec);
            for (const program of programs) {

                const programPayload = {
                    dep_sec: savedSectionId,
                    dep_title: program.dep_title || '',
                    dep_detail: program.dep_detail || '',
                    dep_img1: program.dep_img1 || null,
                    dep_img2: program.dep_img2 || null,
                    page_id: savedPageId,
                };

                if(
                    program.dep_id &&
                    existingIds.includes(parseInt(program.dep_id)) &&
                    parseInt(program.dep_sec) === parseInt(savedSectionId) &&
                    parseInt(program.page_id) === parseInt(savedPageId) &&
                    existingDepartments.includes(parseInt(savedSectionId))

                ){
                    await axios.post(`${API_ENDPOINTS.updateDepartment}/${program.dep_id}`, { programs: programPayload });
                } else {
                    if (program.dep_sec) {
                        if (!program.dep_id || !existingIds.includes(parseInt(program.dep_id)) || !existingDepartments.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createDepartment, { programs: [programPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveBanner = async (savedSectionId, savedPageId) => {
        const banners = await pageRef.current?.getBanners?.() || [];

        if (banners.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getBanner);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.ban_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.ban_id);
            const existingBanners = existingItems.map(slide => slide.ban_sec);
            for (const banner of banners) {

                const bannerPayload = {
                    ban_sec: savedSectionId,
                    ban_title: banner.ban_title || '',
                    ban_subtitle: banner.ban_subtitle || '',
                    ban_img: banner.ban_img || null,
                    page_id: savedPageId,
                };

                if (
                    banner.ban_id &&
                    existingIds.includes(parseInt(banner.ban_id)) &&
                    parseInt(banner.ban_sec) === parseInt(savedSectionId) &&
                    parseInt(banner.page_id) === parseInt(savedPageId) &&
                    existingBanners.includes(parseInt(banner.ban_sec))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateBanner}/${banner.ban_id}`, { banners: bannerPayload });
                } else {
                    if (banner.ban_sec) {
                        if (!banner.ban_id || !existingIds.includes(parseInt(banner.ban_id)) || !existingBanners.includes(parseInt(banner.ban_sec))) {
                            await axios.post(API_ENDPOINTS.createBanner, { banners: [bannerPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveInformation = async (savedSectionId, savedPageId) => {
        const informations = await pageRef.current?.getInformations?.() || [];

        if (informations.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getText);
            const existingItems = (existingResponse.data?.data || []).filter(item => {
                const section = item.text_sec;
                return section && parseInt(section.sec_id) === parseInt(savedSectionId);
            });
            const existingIds = existingItems.map(slide => slide.text_id);
            const existingInformations = existingItems.map(slide => slide.text_sec);
            for (const information of informations) {

                const informationPayload = {
                    text_sec: savedSectionId,
                    title: information.title || '',
                    desc: information.desc || '',
                    text_type: parseInt(information.text_type) || null,
                    page_id: savedPageId,
                };

                if (
                    information.text_id &&
                    existingIds.includes(parseInt(information.text_id)) &&
                    parseInt(information.text_sec) === parseInt(savedSectionId) &&
                    parseInt(information.page_id) === parseInt(savedPageId) &&
                    existingInformations.some(info => parseInt(info.sec_id) === parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateText}/${information.text_id}`, { texts: informationPayload });
                } else {
                    if (information.text_sec) {
                        if (!information.text_id || !existingIds.includes(parseInt(information.text_id)) || !existingInformations.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createText, { texts: [informationPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveTestimonial = async (savedSectionId, savedPageId) => {
        const testimonials = await pageRef.current?.getTestimonials?.() || [];

        if (testimonials.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getTestimonial);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.t_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.t_id);
            const existingTestimonials = existingItems.map(slide => slide.t_sec);
            for (const testimonial of testimonials) {

                const testimonialPayload = {
                    t_sec: savedSectionId,
                    t_title: testimonial.t_title || '',
                    page_id: savedPageId,
                };

                if (
                    testimonial.t_sec &&
                    existingIds.includes(parseInt(testimonial.t_id)) &&
                    parseInt(testimonial.t_sec) === parseInt(savedSectionId) &&
                    parseInt(testimonial.page_id) === parseInt(savedPageId) &&
                    existingTestimonials.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateTestimonial}/${testimonial.t_id}`, { testimonials: testimonialPayload });
                } else {
                    if (testimonial.t_sec) {
                        if (!testimonial.t_id || !existingIds.includes(parseInt(testimonial.t_id)) || !existingTestimonials.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createTestimonial, { testimonials: [testimonialPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveAcademic = async (savedSectionId, savedPageId) => {
        const academics = await pageRef.current?.getAcademics?.() || [];

        if (academics.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getAcademic);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.acad_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.acad_id);
            const existingAcademics = existingItems.map(slide => slide.acad_sec);
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

                if (
                    academic.acad_sec &&
                    existingIds.includes(parseInt(academic.acad_id)) &&
                    parseInt(academic.acad_sec) === parseInt(savedSectionId) &&
                    parseInt(academic.page_id) === parseInt(savedPageId) &&
                    existingAcademics.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAcademic}/${academic.acad_id}`, { academics: academicPayload });
                } else {
                    if (academic.acad_sec) {
                        if (!academic.acad_id || !existingIds.includes(parseInt(academic.acad_id)) || !existingAcademics.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createAcademic, { academics: [academicPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveGallery = async (savedSectionId, savedPageId) => {
        const galleries = await pageRef.current?.getGallery?.() || [];

        if (galleries.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getGallery);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.gal_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.gal_id);
            const existingGallerys = existingItems.map(slide => slide.gal_sec);
            for (const gallery of galleries) {
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

                if (
                    gallery.gal_sec &&
                    existingIds.includes(parseInt(gallery.gal_id)) &&
                    parseInt(gallery.gal_sec) === parseInt(savedSectionId) &&
                    parseInt(gallery.page_id) === parseInt(savedPageId) &&
                    existingGallerys.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateGallery}/${gallery.gal_id}`, { gallery: galleryPayload });
                } else {
                    if (gallery.gal_sec) {
                        if (!gallery.gal_id || !existingIds.includes(parseInt(gallery.gal_id)) || !existingGallerys.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createGallery, { gallery: [galleryPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveCriteria = async (savedSectionId, savedPageId) => {
        const criterias = await pageRef.current?.getCriterias?.() || [];

        if (criterias.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getCriteria);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.gc_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.gc_id);
            const existingCriterias = existingItems.map(slide => slide.gc_sec);
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

                if(
                    criteria.gc_sec &&
                    existingIds.includes(parseInt(criteria.gc_id)) &&
                    parseInt(criteria.gc_sec) === parseInt(savedSectionId) &&
                    parseInt(criteria.page_id) === parseInt(savedPageId) &&
                    existingCriterias.includes(parseInt(savedSectionId))
                ){
                    await axios.post(`${API_ENDPOINTS.updateCriteria}/${criteria.gc_id}`, { criteria: criteriaPayload });
                } else {
                    if (criteria.gc_sec) {
                        if (!criteria.gc_id || !existingIds.includes(parseInt(criteria.gc_id)) || !existingCriterias.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createCriteria, { criteria: [criteriaPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveUnlock = async (savedSectionId, savedPageId) => {
        const unlocks = await pageRef.current?.getUnlocks?.() || [];

        if (unlocks.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getUnlock);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.umd_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.umd_id);
            const existingUnlocks = existingItems.map(slide => slide.umd_sec);
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

                if(
                    unlock.umd_sec &&
                    existingIds.includes(parseInt(unlock.umd_id)) &&
                    parseInt(unlock.umd_sec) === parseInt(savedSectionId) &&
                    parseInt(unlock.page_id) === parseInt(savedPageId) &&
                    existingUnlocks.includes(parseInt(savedSectionId))
                ){
                    await axios.post(`${API_ENDPOINTS.updateUnlock}/${unlock.umd_id}`, { unlock: unlockPayload });
                } else {
                    if (unlock.umd_sec) {
                        if (!unlock.umd_id || !existingIds.includes(parseInt(unlock.umd_id)) || !existingUnlocks.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createUnlock, { unlock: [unlockPayload] });
                        }
                    }
                }
            }
        }
    };
    const saveFee = async (savedSectionId, savedPageId) => {
        const fees = await pageRef.current?.getFees?.() || [];

        if (fees.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getFee);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.fe_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.fe_id);
            const existingFees = existingItems.map(slide => slide.fe_sec);
            for (const fee of fees) {

                const feePayload = {
                    fe_sec: savedSectionId,
                    fe_title: fee.fe_title || '',
                    fe_desc: fee.fe_desc || '',
                    fe_img: fee.fe_img || null,
                    fe_price: fee.fe_price || '',
                    page_id: savedPageId,
                };

                if(
                    fee.fe_sec &&
                    existingIds.includes(parseInt(fee.fe_id)) &&
                    parseInt(fee.fe_sec) === parseInt(savedSectionId) &&
                    parseInt(fee.page_id) === parseInt(savedPageId) &&
                    existingFees.includes(parseInt(savedSectionId))
                ){
                    await axios.post(`${API_ENDPOINTS.updateFee}/${fee.fe_id}`, { fee: feePayload });
                } else {
                    if (fee.fe_sec) {
                        if (!fee.fe_id || !existingIds.includes(parseInt(fee.fe_id)) || !existingFees.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createFee, { fee: [feePayload] });
                        }
                    }
                }
            }
        }
    };
    const saveIntroduction = async (savedSectionId, savedPageId) => {
        const introductions = await pageRef.current?.getIntroductions?.() || [];

        if (introductions.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getIntroduction);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.in_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.in_id);
            const existingIntroductions = existingItems.map(slide => slide.in_sec);
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


                if(
                    introduction.in_sec &&
                    existingIds.includes(parseInt(introduction.in_id)) &&
                    parseInt(introduction.in_sec) === parseInt(savedSectionId) &&
                    parseInt(introduction.page_id) === parseInt(savedPageId) &&
                    existingIntroductions.includes(parseInt(savedSectionId))
                ){
                    await axios.post(`${API_ENDPOINTS.updateIntroduction}/${introduction.in_id}`, { introduction: introductionPayload });
                } else {
                    if (introduction.in_sec) {
                        if (!introduction.in_id || !existingIds.includes(parseInt(introduction.in_id)) || !existingIntroductions.includes(parseInt(savedSectionId))) {
                            await axios.post(API_ENDPOINTS.createIntroduction, { introduction: [introductionPayload] });
                        }
                    }
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
        const existingResponse = await axios.get(API_ENDPOINTS.getHeaderSection);
        const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.hsec_sec) === parseInt(savedSectionId));
        const existingIds = existingItems.map(item => item.hsec_id);
        const existingHeaderSections = existingItems.map(slide => slide.hsec_sec);

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
                    parseInt(resolvedPageId) === parseInt(savedPageId) &&
                    existingHeaderSections.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${updateEndpoint}/${itemId}`, { [itemsKey]: payload });
                } else {
                    if (!itemId || !existingIds.includes(parseInt(itemId)) || !existingHeaderSections.includes(parseInt(savedSectionId))) {
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
            const existingResponse = await axios.get(API_ENDPOINTS.getAcadFacilities);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.af_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.af_id);
            const existingFacilities = existingItems.map(slide => slide.af_sec);
            for (const acadFacility of acadFacilities) {

                const acadFacilitiesPayload = {
                    af_sec: savedSectionId,
                    af_img: acadFacility.af_img,
                    af_text: acadFacility.af_text,
                    page_id: savedPageId,
                };

                if (
                    acadFacility.af_sec &&
                    existingIds.includes(parseInt(acadFacility.af_id)) &&
                    parseInt(acadFacility.af_sec) === parseInt(savedSectionId) &&
                    parseInt(acadFacility.page_id) === parseInt(savedPageId) &&
                    existingFacilities.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAcadFacilities}/${acadFacility.af_id}`, { facilities: acadFacilitiesPayload });
                    await saveAcadFacilitySliders(acadFacility.af_id, acadFacility.subservices || []);

                } else {
                    if (acadFacility.af_sec) {
                        if (!acadFacility.af_id || !existingIds.includes(parseInt(acadFacility.af_id)) || !existingFacilities.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createAcadFacilities, { facilities: [acadFacilitiesPayload] });
                            const createdId = res.data?.data?.[0]?.af_id;
                            if (createdId) {
                                await saveAcadFacilitySliders(acadFacility.af_id, acadFacility.subservices || []);
                            }
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
        const existingPairs = existingSubservices.map(item => ({
            ss_id: parseInt(item.ss_id),
            ss_af: parseInt(item.ss_af)
        }));

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
            const ssAF = ss.ss_af;

            try {
                if (
                    ssId &&
                    existingPairs.some(pair => pair.ss_id === parseInt(ssId) && pair.ss_af === parseInt(ssAF))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceAF}/${ssId}`, { subservice: ssPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubserviceAF, { subservice: [ssPayload] });
                    const createdId = res.data?.data?.[0]?.ss_id;
                    if (createdId) {
                        ss.ss_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getSpecialization);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.ras_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.ras_id);
            const existingSpecializations = existingItems.map(slide => slide.ras_sec);
            for (const specialization of Specializations) {

                const specializationPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: specialization.ras_img1,
                    ras_img2: specialization.ras_img2,
                    ras_text: specialization.ras_text,
                    page_id: savedPageId,
                };

                if (
                    specialization.ras_sec &&
                    existingIds.includes(parseInt(specialization.ras_id)) &&
                    parseInt(specialization.ras_sec) === parseInt(savedSectionId) &&
                    parseInt(specialization.page_id) === parseInt(savedPageId) &&
                    existingSpecializations.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${specialization.ras_id}`, { specialization: specializationPayload });
                    await saveSpecializationSliders(specialization.ras_id, specialization.subservices || []);
                } else {
                    if (specialization.ras_sec) {
                        if (!specialization.ras_id || !existingIds.includes(parseInt(specialization.ras_id)) || !existingSpecializations.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [specializationPayload] });
                            const createdId = res.data?.data?.[0]?.ras_id;
                            if (createdId) {
                                await saveSpecializationSliders(specialization.ras_id, specialization.subservices || []);
                            }
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
        const existingPairs = existingSubservices.map(item => ({
            ss_id: parseInt(item.ss_id),
            ss_ras: parseInt(item.ss_ras)
        }));

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
            const ssRasId = ss.ss_ras;

            try {
                if (
                    ssId &&
                    existingPairs.some(pair => pair.ss_id === parseInt(ssId) && pair.ss_ras === parseInt(ssRasId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceRAS}/${ssId}`, { subservice: ssPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubserviceRAS, { subservice: [ssPayload] });
                    const createdId = res.data?.data?.[0]?.ss_id;
                    if (createdId) {
                        ss.ss_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getType);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.tse_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.tse_id);
            const existingTypes = existingItems.map(slide => slide.tse_sec);
            for (const type of types) {

                const TypePayload = {
                    tse_sec: savedSectionId,
                    tse_text: type.tse_text,
                    tse_type: parseInt(type.tse_type),
                    page_id: savedPageId,
                };

                if (
                    type.tse_sec &&
                    existingIds.includes(parseInt(type.tse_id)) &&
                    parseInt(type.tse_sec) === parseInt(savedSectionId) &&
                    parseInt(type.page_id) === parseInt(savedPageId) &&
                    existingTypes.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateType}/${type.tse_id}`, { type: TypePayload });
                    await saveSubTypeSliders(type.tse_id, type.subtypes || []);
                } else {
                    if (type.tse_sec) {
                        if (!type.tse_id || !existingIds.includes(parseInt(type.tse_id)) || !existingTypes.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createType, { type: [TypePayload] });
                            const createdId = res.data?.data?.[0]?.tse_id;
                            if (createdId) {
                                await saveSubTypeSliders(createdId, type.subtypes || []);
                            }
                        }
                    }
                }
            }
        }
    };
    const saveSubTypeSliders = async (typeId, sliders) => {
        if (!typeId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubType}?stse_tse=${typeId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingPairs = existingSubservices.map(item => ({
            stse_id: parseInt(item.stse_id),
            stse_tse: parseInt(item.stse_tse)
        }));

        for (const stse of sliders) {
            const stsePayload = {
                stse_tse: typeId,
                stse_title: stse.stse_title,
                stse_detail: stse.stse_detail,
                display: stse.display,
            };
            const stseId = stse.id || stse.stse_id;
            const stseTse = stse.stse_tse;

            try {
                if (
                    stseId &&
                    existingPairs.some(pair => pair.stse_id === parseInt(stseId) && pair.stse_tse === parseInt(stseTse))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubType}/${stseId}`, { subtse: stsePayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubType, { subtse: [stsePayload] });
                    const createdId = res.data?.data?.[0]?.stse_id;
                    if (createdId) {
                        stse.stse_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getSpecialization);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.ras_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.ras_id);
            const existingCSDs = existingItems.map(slide => slide.ras_sec);
            for (const csd of csds) {

                const csdPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: csd.ras_img1,
                    ras_img2: csd.ras_img2,
                    ras_text: csd.ras_text,
                    page_id: savedPageId,
                };

                if (
                    csd.ras_sec &&
                    existingIds.includes(parseInt(csd.ras_id)) &&
                    parseInt(csd.ras_sec) === parseInt(savedSectionId) &&
                    parseInt(csd.page_id) === parseInt(savedPageId) &&
                    existingCSDs.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${csd.ras_id}`, { specialization: csdPayload });
                    await saveCSDSliders(csd.ras_id, csd.subservices || []);
                    await saveCSDAddOn(csd.ras_id, csd.rasons || []);
                } else {
                    if (csd.ras_sec) {
                        if (!csd.ras_id || !existingIds.includes(parseInt(csd.ras_id)) || !existingCSDs.includes(parseInt(savedSectionId))) {
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
        }
    };
    const saveCSDSliders = async (csdId, sliders) => {
        if (!csdId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubserviceAF}?ss_ras=${csdId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingPairs = existingSubservices.map(item => ({
            ss_id: parseInt(item.ss_id),
            ss_ras: parseInt(item.ss_ras)
        }));

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
            const ssRasId = ss.ss_ras;

            try {
                if (
                    ssId &&
                    existingPairs.some(pair => pair.ss_id === parseInt(ssId) && pair.ss_ras === parseInt(ssRasId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceRAS}/${ssId}`, { subservice: ssPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubserviceRAS, { subservice: [ssPayload] });
                    const createdId = res.data?.data?.[0]?.ss_id;
                    if (createdId) {
                        ss.ss_id = createdId;
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
        const existingPairs = existingSubservices.map(item => ({
            rason_id: parseInt(item.rason_id),
            rason_ras: parseInt(item.rason_ras)
        }));

        for (const rason of sliders) {
            const rasonPayload = {
                rason_ras: csdId,
                rason_title: rason.rason_title,
                rason_subtitle: rason.rason_subtitle,
                rason_amount: rason.rason_amount,
            };
            const ssId = rason.id || rason.rason_id;
            const RasOnId = rason.rason_ras;

            try {
                if (
                    ssId &&
                    existingPairs.some(pair => pair.rason_id === parseInt(ssId) && pair.rason_ras === parseInt(RasOnId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAddOnCSD}/${ssId}`, { rasons: rasonPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createAddOnCSD, { rasons: [rasonPayload] });
                    const createdId = res.data?.data?.[0]?.rason_id;
                    if (createdId) {
                        rason.rason_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getStudy);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.std_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.std_id);
            const existingStudys = existingItems.map(slide => slide.std_sec);
            for (const study of studys) {

                const StudyPayload = {
                    std_sec: savedSectionId,
                    std_title: study.std_title,
                    std_subtitle: study.std_subtitle,
                    std_type: parseInt(study.std_type),
                    page_id: savedPageId,
                };

                if (
                    study.std_sec &&
                    existingIds.includes(parseInt(study.std_id)) &&
                    parseInt(study.std_sec) === parseInt(savedSectionId) &&
                    parseInt(study.page_id) === parseInt(savedPageId) &&
                    existingStudys.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateStudy}/${study.std_id}`, { study: StudyPayload });
                    await saveSubStudyDegreeSliders(study.std_id, study.substudys || []);
                } else {
                    if (study.std_sec) {
                        if (!study.std_id || !existingIds.includes(parseInt(study.std_id)) || !existingStudys.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createStudy, { study: [StudyPayload] });
                            const createdId = res.data?.data?.[0]?.std_id;
                            if (createdId) {
                                await saveSubStudyDegreeSliders(study.std_id, study.substudys || []);
                            }
                        }
                    }
                }
            }
        }
        // setLoading(false);
    };
    const saveSubStudyDegreeSliders = async (studyId, sliders) => {
        if (!studyId || !Array.isArray(sliders)) return;

        const res = await axios.get(`${API_ENDPOINTS.getSubStudyDegree}?y_std=${studyId}`);
        const raw = res.data?.data;
        const existingSubservices = Array.isArray(raw) ? raw : raw ? [raw] : [];
        const existingPairs = existingSubservices.map(item => ({
            y_id: parseInt(item.y_id),
            y_std: parseInt(item.y_std)
        }));

        for (const year of sliders) {
            const yearPayload = {
                y_std: studyId,
                y_title: year.y_title,
                y_subtitle: year.y_subtitle,
                y_detail: year.y_detail,
                display: year.display,
            };
            const yId = year.id || year.y_id;
            const yStdId = year.y_std;

            try {
                if (
                    yId &&
                    existingPairs.some(pair => pair.y_id === parseInt(yId) && pair.y_std === parseInt(yStdId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubStudyDegree}/${yId}`, { year: yearPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubStudyDegree, { year: [yearPayload] });
                    const createdId = res.data?.data?.[0]?.y_id;
                    if (createdId) {
                        year.y_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getAvailable);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.apd_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.apd_id);
            const existingAvailables = existingItems.map(slide => slide.apd_sec);
            for (const available of availables) {

                const AvailablePayload = {
                    apd_sec: savedSectionId,
                    apd_title: available.apd_title,
                    page_id: savedPageId,
                };

                if (
                    available.apd_sec &&
                    existingIds.includes(parseInt(available.apd_id)) &&
                    parseInt(available.apd_sec) === parseInt(savedSectionId) &&
                    parseInt(available.page_id) === parseInt(savedPageId) &&
                    existingAvailables.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateAvailable}/${available.apd_id}`, { available: AvailablePayload });
                    await saveSubAvailableSliders(available.apd_id, available.subavailables || []);
                } else {
                    if (available.apd_sec) {
                        if (!available.apd_id || !existingIds.includes(parseInt(available.apd_id)) || !existingAvailables.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createAvailable, { available: [AvailablePayload] });
                            const createdId = res.data?.data?.[0]?.apd_id;
                            if (createdId) {
                                await saveSubAvailableSliders(available.apd_id, available.subavailables || []);
                            }
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
        const existingPairs = existingSubservices.map(item => ({
            sapd_id: parseInt(item.sapd_id),
            sapd_apd: parseInt(item.sapd_apd)
        }));
        for (const subavailable of sliders) {
            const subAvailablePayload = {
                sapd_apd: availableId,
                sapd_title: subavailable.sapd_title,
                sapd_img: subavailable.sapd_image,
                sapd_routepage: subavailable.sapd_routepage,
                display: subavailable.display,
            };
            const sapdId = subavailable.id || subavailable.sapd_id;
            const sapdApd = subavailable.sapd_apd;

            try {
                if (
                    sapdId &&
                    existingPairs.some(pair => pair.sapd_id === parseInt(sapdId) && pair.sapd_apd === parseInt(sapdApd))
                )
                {
                    await axios.post(`${API_ENDPOINTS.updateSubAvailable}/${sapdId}`, { subapd: subAvailablePayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubAvailable, { subapd: [subAvailablePayload] });
                    const createdId = res.data?.data?.[0]?.sapd_id;
                    if (createdId) {
                        subavailable.sapd_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getCriteria);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.gc_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.gc_id);
            const existingCriterias = existingItems.map(slide => slide.gc_sec);
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

                if(
                    requirement.gc_sec &&
                    existingIds.includes(parseInt(requirement.gc_id)) &&
                    parseInt(requirement.gc_sec) === parseInt(savedSectionId) &&
                    parseInt(requirement.page_id) === parseInt(savedPageId) &&
                    existingCriterias.includes(parseInt(savedSectionId))
                ){
                    await axios.post(`${API_ENDPOINTS.updateCriteria}/${requirement.gc_id}`, { criteria: requirementPayload });
                    await saveSubRequirement(requirement.gc_id, requirement.subrequirements || []);
                } else {
                    if (requirement.gc_sec) {
                        if (!requirement.gc_id || !existingIds.includes(parseInt(requirement.gc_id)) || !existingCriterias.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createCriteria, { criteria: [requirementPayload] });
                            const createdId = res.data?.data?.[0]?.gc_id;
                            if (createdId) {
                                await saveSubRequirement(requirement.gc_id, requirement.subrequirements || []);
                            }
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
        const existingPairs = existingSubservices.map(item => ({
            gca_id: parseInt(item.gca_id),
            gca_gc: parseInt(item.gca_gc)
        }));

        for (const subavailable of sliders) {
            const subAvailablePayload = {
                gca_gc: requirementId,
                gca_tag: subavailable.gca_tag,
                gca_btntitle: subavailable.gca_btntitle,
                gca_btnlink: subavailable.gca_btnlink,
            };
            const gcaddonId = subavailable.id || subavailable.gca_id;
            const gcaGC = subavailable.gca_gc;

            try {
                if (
                    gcaddonId &&
                    existingPairs.some(pair => pair.gca_id === parseInt(gcaddonId) && pair.gca_gc === parseInt(gcaGC))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubRequirement}/${gcaddonId}`, { gcaddon: subAvailablePayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubRequirement, { gcaddon: [subAvailablePayload] });
                    const createdId = res.data?.data?.[0]?.gca_id;
                    if (createdId) {
                        subavailable.gca_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getFuture);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.uf_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.uf_id);
            const existingFutures = existingItems.map(slide => slide.uf_sec);
            for (const future of futures) {

                const FuturePayload = {
                    uf_sec: savedSectionId,
                    uf_title: future.uf_title,
                    uf_subtitle: future.uf_subtitle,
                    uf_img: future.uf_img,
                    page_id: savedPageId,
                };

                if (
                    future.uf_sec &&
                    existingIds.includes(parseInt(future.uf_id)) &&
                    parseInt(future.uf_sec) === parseInt(savedSectionId) &&
                    parseInt(future.page_id) === parseInt(savedPageId) &&
                    existingFutures.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateFuture}/${future.uf_id}`, { future: FuturePayload });
                    await saveSubFutureSliders(future.uf_id, future.subfutures || []);
                } else {
                    if (future.uf_sec) {
                        if (!future.uf_id || !existingIds.includes(parseInt(future.uf_id)) || !existingFutures.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createFuture, { future: [FuturePayload] });
                            const createdId = res.data?.data?.[0]?.uf_id;
                            if (createdId) {
                                await saveSubFutureSliders(future.uf_id, future.subfutures || []);
                            }
                        }
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
        const existingPairs = existingSubservices.map(item => ({
            ufa_id: parseInt(item.ufa_id),
            ufa_uf: parseInt(item.ufa_uf)
        }));

        for (const subfuture of sliders) {
            const subFuturePayload = {
                ufa_uf: futureId,
                ufa_title: subfuture.ufa_title,
                ufa_subtitle: subfuture.ufa_subtitle,
                display: subfuture.display,
            };
            const subfutureId = subfuture.id || subfuture.ufa_id;
            const ufaUF = subfuture.ufa_uf;

            try {
                if (
                    subfutureId &&
                    existingPairs.some(pair => pair.ufa_id === parseInt(subfutureId) && pair.ufa_uf === parseInt(ufaUF))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubFuture}/${subfutureId}`, { ufaddon: subFuturePayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubFuture, { ufaddon: [subFuturePayload] });
                    const createdId = res.data?.data?.[0]?.ufa_id;
                    if (createdId) {
                        subfuture.ufa_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getSpecialization);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.ras_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.ras_id);
            const existingPotentials = existingItems.map(slide => slide.ras_sec);
            for (const potential of Potentials) {

                const potentialPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: potential.ras_img1,
                    ras_img2: potential.ras_img2,
                    ras_text: potential.ras_text,
                    page_id: savedPageId,
                };

                if (
                    potential.ras_sec &&
                    existingIds.includes(parseInt(potential.ras_id)) &&
                    parseInt(potential.ras_sec) === parseInt(savedSectionId) &&
                    parseInt(potential.page_id) === parseInt(savedPageId) &&
                    existingPotentials.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${potential.ras_id}`, { specialization: potentialPayload });
                    await savePotentialSliders(potential.ras_id, potential.subservices || []);
                } else {
                    if (potential.ras_sec) {
                        if (!potential.ras_id || !existingIds.includes(parseInt(potential.ras_id)) || !existingPotentials.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [potentialPayload] });
                            const createdId = res.data?.data?.[0]?.ras_id;
                            if (createdId) {
                                await savePotentialSliders(potential.ras_id, potential.subservices || []);
                            }
                        }
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
        const existingPairs = existingSubservices.map(item => ({
            ss_id: parseInt(item.ss_id),
            ss_ras: parseInt(item.ss_ras)
        }));

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
            const ssRAS = ss.ss_ras;

            try {
                if (
                    ssId &&
                    existingPairs.some(pair => pair.ss_id === parseInt(ssId) && pair.ss_ras === parseInt(ssRAS))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceRAS}/${ssId}`, { subservice: ssPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubserviceRAS, { subservice: [ssPayload] });
                    const createdId = res.data?.data?.[0]?.ss_id;
                    if (createdId) {
                        ss.ss_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getSpecialization);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.ras_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.ras_id);
            const existingInnovations = existingItems.map(slide => slide.ras_sec);
            for (const innovation of innovations) {

                const innovationPayload = {
                    ras_sec: savedSectionId,
                    ras_img1: innovation.ras_img1,
                    ras_img2: innovation.ras_img2,
                    ras_text: innovation.ras_text,
                    page_id: savedPageId,
                };

                if (
                    innovation.ras_sec &&
                    existingIds.includes(parseInt(innovation.ras_id)) &&
                    parseInt(innovation.ras_sec) === parseInt(savedSectionId) &&
                    parseInt(innovation.page_id) === parseInt(savedPageId) &&
                    existingInnovations.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSpecialization}/${innovation.ras_id}`, { specialization: innovationPayload });
                    await saveInnovationSliders(innovation.ras_id, innovation.subservices || []);
                } else {
                    if (innovation.ras_sec) {
                        if (!innovation.ras_id || !existingIds.includes(parseInt(innovation.ras_id)) || !existingInnovations.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createSpecialization, { specialization: [innovationPayload] });
                            const createdId = res.data?.data?.[0]?.ras_id;
                            if (createdId) {
                                await saveInnovationSliders(innovation.ras_id, innovation.subservices || []);
                            }
                        }
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
        const existingPairs = existingSubservices.map(item => ({
            ss_id: parseInt(item.ss_id),
            ss_ras: parseInt(item.ss_ras)
        }));

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
            const ssRAS = ss.ss_ras;

            try {
                if (
                    ssId &&
                    existingPairs.some(pair => pair.ss_id === parseInt(ssId) && pair.ss_ras === parseInt(ssRAS))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubserviceRAS}/${ssId}`, { subservice: ssPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubserviceRAS, { subservice: [ssPayload] });
                    const createdId = res.data?.data?.[0]?.ss_id;
                    if (createdId) {
                        ss.ss_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getFAQ);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.faq_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.faq_id);
            const existingFAQs = existingItems.map(slide => slide.faq_sec);
            for (const faq of faqs) {

                const faqPayload = {
                    faq_sec: savedSectionId,
                    faq_title: faq.faq_title,
                    faq_subtitle: faq.faq_subtitle,
                    page_id: savedPageId,
                };

                if (
                    faq.faq_sec &&
                    existingIds.includes(parseInt(faq.faq_id)) &&
                    parseInt(faq.faq_sec) === parseInt(savedSectionId) &&
                    parseInt(faq.page_id) === parseInt(savedPageId) &&
                    existingFAQs.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateFAQ}/${faq.faq_id}`, { faq: faqPayload });
                    await saveFAQSliders(faq.faq_id, faq.subfaqs || []);
                } else {
                    if (faq.faq_sec) {
                        if (!faq.faq_id || !existingIds.includes(parseInt(faq.faq_id)) || !existingFAQs.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createFAQ, { faq: [faqPayload] });
                            const createdId = res.data?.data?.[0]?.faq_id;
                            if (createdId) {
                                await saveFAQSliders(faq.faq_id, faq.subfaqs || []);
                            }
                        }
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
        const existingPairs = existingSubservices.map(item => ({
            fa_id: parseInt(item.fa_id),
            fa_faq: parseInt(item.fa_faq)
        }));

        for (const fa of sliders) {
            const faPayload = {
                fa_faq: faqId,
                fa_question: fa.fa_question,
                fa_answer: fa.fa_answer,
                display: fa.display,
            };
            const faId = fa.id || fa.fa_id;
            const faFAQ = fa.fa_faq;

            try {
                if (
                    faId &&
                    existingPairs.some(pair => pair.fa_id === parseInt(faId) && pair.fa_faq === parseInt(faFAQ))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubFAQ}/${faId}`, { faqaddon: faPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubFAQ, { faqaddon: [faPayload] });
                    const createdId = res.data?.data?.[0]?.fa_id;
                    if (createdId) {
                        fa.fa_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getApply);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.ha_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.ha_id);
            const existingApplys = existingItems.map(slide => slide.ha_sec);
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

                if (
                    apply.ha_sec &&
                    existingIds.includes(parseInt(apply.ha_id)) &&
                    parseInt(apply.ha_sec) === parseInt(savedSectionId) &&
                    parseInt(apply.page_id) === parseInt(savedPageId) &&
                    existingApplys.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateApply}/${apply.ha_id}`, { apply: applyPayload });
                    await saveApplySliders(apply.ha_id, apply.subservices || []);

                } else {
                    if (apply.ha_sec) {
                        if (!apply.ha_id || !existingIds.includes(parseInt(apply.ha_id)) || !existingApplys.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createApply, { apply: [applyPayload] });
                            const createdId = res.data?.data?.[0]?.ha_id;
                            if (createdId) {
                                await saveApplySliders(apply.ha_id, apply.subservices || []);

                            }
                        }
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
        const existingPairs = existingSubservices.map(item => ({
            sha_id: parseInt(item.sha_id),
            sha_ha: parseInt(item.sha_ha)
        }));

        for (const sha of sliders) {
            const subApplyPayload = {
                sha_ha: applyId,
                sha_title: sha.sha_title,
                display: sha.display,
            };
            const shaId = sha.id || sha.sha_id;
            const shaHA = sha.sha_ha;

            try {
                if (
                    shaId &&
                    existingPairs.some(pair => pair.sha_id === parseInt(shaId) && pair.sha_ha === parseInt(shaHA))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubApply}/${shaId}`, { subapply: subApplyPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubApply, { subapply: [subApplyPayload] });
                    const createdId = res.data?.data?.[0]?.sha_id;
                    if (createdId) {
                        sha.sha_id = createdId;
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
            const existingResponse = await axios.get(API_ENDPOINTS.getImportant);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.idd_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.idd_id);
            const existingImportants = existingItems.map(slide => slide.idd_sec);
            for (const important of importants) {

                const importantPayload = {
                    idd_sec: savedSectionId,
                    idd_title: important.idd_title,
                    idd_subtitle: important.idd_subtitle,
                    page_id: savedPageId,
                };

                if (
                    important.idd_sec &&
                    existingIds.includes(parseInt(important.idd_id)) &&
                    parseInt(important.idd_sec) === parseInt(savedSectionId) &&
                    parseInt(important.page_id) === parseInt(savedPageId) &&
                    existingImportants.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateImportant}/${important.idd_id}`, { important: importantPayload });
                    await saveImportantSliders(important.idd_id, important.subservices || []);
                } else {
                    if (important.idd_sec) {
                        if (!important.idd_id || !existingIds.includes(parseInt(important.idd_id)) || !existingImportants.includes(parseInt(savedSectionId))) {
                            const res = await axios.post(API_ENDPOINTS.createImportant, { important: [importantPayload] });
                            const createdId = res.data?.data?.[0]?.idd_id;
                            if (createdId) {
                                await saveImportantSliders(createdId, important.subservices || []);
                            }
                        }
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
        const existingPairs = existingSubservices.map(item => ({
            sidd_id: parseInt(item.sidd_id),
            sidd_idd: parseInt(item.sidd_idd)
        }));

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
            const siddIDD = sidd.sidd_idd;

            try {
                if (
                    siddId &&
                    existingPairs.some(pair => pair.sidd_id === parseInt(siddId) && pair.sidd_idd === parseInt(siddIDD))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSubImportant}/${siddId}`, { subimportant: subApplyPayload });
                } else {
                    const res = await axios.post(API_ENDPOINTS.createSubImportant, { subimportant: [subApplyPayload] });
                    const createdId = res.data?.data?.[0]?.sidd_id;
                    if (createdId) {
                        sidd.sidd_idd = createdId;
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
        const response = await pageRef.current?.getSlideshows?.() || [];
        const slideshows = response?.slideshows;
        const sectionId = response?.sectionId;
        const pageId = response?.pageId;

        if (slideshows.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getSlideshow);
            const existingItems = (existingResponse.data?.data || []).filter(item => {
                const section = item.slider_sec;
                return section && parseInt(section.sec_id) === parseInt(savedSectionId);
            });
            const existingIds = existingItems.map(slide => slide.slider_id);
            const existingSliders = existingItems.map(slide => slide.slider_sec.sec_id);
            for (const item of slideshows) {

                const payload = {
                    ...item,
                    slider_sec: savedSectionId,
                    page_id: savedPageId,
                };

                if (
                    sectionId &&
                    existingIds.includes(parseInt(item.slider_id)) &&
                    parseInt(sectionId) === parseInt(savedSectionId) &&
                    parseInt(pageId) === parseInt(savedPageId) &&
                    existingSliders.includes(parseInt(savedSectionId))
                ) {
                    await axios.post(`${API_ENDPOINTS.updateSlideshow}/${item.slider_id}`, { Slideshow: payload });
                } else {
                    if (!item.slider_id || !existingIds.includes(parseInt(item.slider_id)) || !existingSliders.includes(parseInt(savedSectionId))) {
                        await axios.post(API_ENDPOINTS.createSlideshow, { Slideshow: [payload] });
                    }
                }
            }

            if (slideshows.length > 0) {reorderSlideshow();}
        }
    }
    const saveService = async (savedSectionId, savedPageId) => {
        const response = await pageRef.current?.getServices?.() || [];
        const services = response?.services;
        const sectionId = response?.sectionId;
        const pageId = response?.pageId;

        if (services.length > 0 && savedSectionId) {
            const existingResponse = await axios.get(API_ENDPOINTS.getService);
            const existingItems = (existingResponse.data?.data || []).filter(item => parseInt(item.s_sec) === parseInt(savedSectionId));
            const existingIds = existingItems.map(slide => slide.s_id);
            const existingServices = existingItems.map(slide => slide.s_sec);

            for (const item of services) {

                const payload = {
                    ...item,
                    s_sec: savedSectionId,
                    page_id: savedPageId,
                };

            if (
                sectionId &&
                existingIds.includes(parseInt(item.s_id)) &&
                parseInt(sectionId) === parseInt(savedSectionId) &&
                parseInt(pageId) === parseInt(savedPageId) &&
                existingServices.includes(parseInt(savedSectionId))
            ) {
                    await axios.post(`${API_ENDPOINTS.updateService}/${item.s_id}`, { Service: payload });
                } else {
                    if (!item.s_id || !existingIds.includes(parseInt(item.s_id)) || !existingServices.includes(parseInt(savedSectionId))) {
                        await axios.post(API_ENDPOINTS.createService, { Service: [payload] });
                    }
                }
            }

            if (services.length > 0) { reorderService(); }
        }
    }
    const reorderSlideshow = async () => {
        const response = await pageRef.current?.getSlideshows?.();
        const slideshows = Array.isArray(response?.slideshows) ? response.slideshows : [];
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
        const response = await pageRef.current?.getServices?.();
        const services = Array.isArray(response?.services) ? response.services : [];

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
        Avaialable: saveAvailable,
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

            await syncSection(savedPageId);
            await reorderSection();

        } catch (error) {
            console.error('❌ Failed to save page or sections:', error.response?.data || error.message);
            throw error;
        }
    }

    const handleSave = async () => {
        try {
            Swal.fire({
                title: 'Saving...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await savePage();

            Swal.close();

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Page saved successfully',
                timer: 1500,
                showConfirmButton: false,
                willClose: () => {
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                }
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save the page',
            });
            console.error("Error saving:", err);
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