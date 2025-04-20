const API = "https://52.221.196.157";
// const API = "http://127.0.0.1:8000";
const API_BASEURL = `${API}/api`;

const API_ENDPOINTS = {

    // images
    getImages: `${API_BASEURL}/images`,
    uploadImage: `${API_BASEURL}/images/create`,
    deleteImage: `${API_BASEURL}/images/delete`,

    // event
    getEvent: `${API_BASEURL}/event`,
    createEvent: `${API_BASEURL}/event/create`,
    updateEvent: `${API_BASEURL}/event/update`,
    deleteEvent: `${API_BASEURL}/event/visibility`,
    duplicateEvent: `${API_BASEURL}/event/duplicate`,
    updateEventOrder: `${API_BASEURL}/event/reorder`,

    // menu
    getMenu: `${API_BASEURL}/menu`,
    createMenu: `${API_BASEURL}/menu/create`,
    updateMenu: `${API_BASEURL}/menu/update`,
    deleteMenu: `${API_BASEURL}/menu/visibility`,
    duplicateMenu: `${API_BASEURL}/menu/duplicate`,
    updateMenuOrder: `${API_BASEURL}/menu/reorder`,

    // page
    getPage: `${API_BASEURL}/page`,
    createPage: `${API_BASEURL}/page/create`,
    updatePage: `${API_BASEURL}/page/update`,
    deletePage: `${API_BASEURL}/page/visibility`,
    duplicatePage: `${API_BASEURL}/page/duplicate`,
    updatePageByMenu: `${API_BASEURL}/page/updatepagemenu`,

    // news
    getNews: `${API_BASEURL}/news`,
    createNews: `${API_BASEURL}/news/create`,
    updateNews: `${API_BASEURL}/news/update`,
    deleteNews: `${API_BASEURL}/news/visibility`,
    duplicateNews: `${API_BASEURL}/news/duplicate`,
    updateNewsOrder: `${API_BASEURL}/news/reorder`,

    // banner
    getBanner: `${API_BASEURL}/banner`,
    createBanner: `${API_BASEURL}/banner/create`,
    updateBanner: `${API_BASEURL}/banner/update`,

    // academic
    getAcademic: `${API_BASEURL}/academic`,
    createAcademic: `${API_BASEURL}/academic/create`,
    updateAcademic: `${API_BASEURL}/academic/update`,

    // headersection
    getHeaderSection: `${API_BASEURL}/headersection`,
    createHeaderSection: `${API_BASEURL}/headersection/create`,
    updateHeaderSection: `${API_BASEURL}/headersection/update`,

    // intro (introduction)
    getIntroduction: `${API_BASEURL}/intro`,
    createIntroduction: `${API_BASEURL}/intro/create`,
    updateIntroduction: `${API_BASEURL}/intro/update`,

    // idd (important)
    getImportant: `${API_BASEURL}/idd`,
    createImportant: `${API_BASEURL}/idd/create`,
    updateImportant: `${API_BASEURL}/idd/update`,

    // department
    getDepartment: `${API_BASEURL}/department`,
    createDepartment: `${API_BASEURL}/department/create`,
    updateDepartment: `${API_BASEURL}/department/update`,

    // faq
    getFAQ: `${API_BASEURL}/faq`,
    createFAQ: `${API_BASEURL}/faq/create`,
    updateFAQ: `${API_BASEURL}/faq/update`,

    // apd (available)
    getAvailable: `${API_BASEURL}/apd`,
    createAvailable: `${API_BASEURL}/apd/create`,
    updateAvailable: `${API_BASEURL}/apd/update`,

    // ha (apply)
    getApply: `${API_BASEURL}/ha`,
    createApply: `${API_BASEURL}/ha/create`,
    updateApply: `${API_BASEURL}/ha/update`,

    // ufcsd (future)
    getFuture: `${API_BASEURL}/ufcsd`,
    createFuture: `${API_BASEURL}/ufcsd/create`,
    updateFuture: `${API_BASEURL}/ufcsd/update`,

    // umd (unlock)
    getUnlock: `${API_BASEURL}/umd`,
    createUnlock: `${API_BASEURL}/umd/create`,
    updateUnlock: `${API_BASEURL}/umd/update`,

    // fee
    getFee: `${API_BASEURL}/fee`,
    createFee: `${API_BASEURL}/fee/create`,
    updateFee: `${API_BASEURL}/fee/update`,

    // study-degree (study)
    getStudy: `${API_BASEURL}/study-degree`,
    createStudy: `${API_BASEURL}/study-degree/create`,
    updateStudy: `${API_BASEURL}/study-degree/update`,

    // gc(criteria)
    getCriteria: `${API_BASEURL}/gc`,
    createCriteria: `${API_BASEURL}/gc/create`,
    updateCriteria: `${API_BASEURL}/gc/update`,

    // rason(Add On of CSD)
    getAddOnCSD: `${API_BASEURL}/rason`,
    createAddOnCSD: `${API_BASEURL}/rason/create`,
    updateAddOnCSD: `${API_BASEURL}/rason/update`,

    // information
    getText: `${API_BASEURL}/text`,
    createText: `${API_BASEURL}/text/create`,
    updateText: `${API_BASEURL}/text/update`,

    // testimonial
    getTestimonial: `${API_BASEURL}/testimonial`,
    createTestimonial: `${API_BASEURL}/testimonial/create`,
    updateTestimonial: `${API_BASEURL}/testimonial/update`,

    // gallery
    getGallery: `${API_BASEURL}/gallery`,
    createGallery: `${API_BASEURL}/gallery/create`,
    updateGallery: `${API_BASEURL}/gallery/update`,

    // gcaddon (subrequirement)
    getSubRequirement: `${API_BASEURL}/gcaddon`,
    createSubRequirement: `${API_BASEURL}/gcaddon/create`,
    updateSubRequirement: `${API_BASEURL}/gcaddon/update`,

    // acad-facilities(facilities)
    getAcadFacilities: `${API_BASEURL}/acad-facilities`,
    createAcadFacilities: `${API_BASEURL}/acad-facilities/create`,
    updateAcadFacilities: `${API_BASEURL}/acad-facilities/update`,

    // ras(specialization)
    getSpecialization: `${API_BASEURL}/ras`,
    createSpecialization: `${API_BASEURL}/ras/create`,
    updateSpecialization: `${API_BASEURL}/ras/update`,

    // tse(type)
    getType: `${API_BASEURL}/tse`,
    createType: `${API_BASEURL}/tse/create`,
    updateType: `${API_BASEURL}/tse/update`,

    // subtse(subtype)
    getSubType: `${API_BASEURL}/subtse`,
    createSubType: `${API_BASEURL}/subtse/create`,
    updateSubType: `${API_BASEURL}/subtse/update`,
    deleteSubType: `${API_BASEURL}/subtse/visibility`,
    updateSubTypeOrder: `${API_BASEURL}/subtse/reorder`,

    // subidd(subimportant)
    getSubImportant: `${API_BASEURL}/subidd`,
    createSubImportant: `${API_BASEURL}/subidd/create`,
    updateSubImportant: `${API_BASEURL}/subidd/update`,
    deleteSubImportant: `${API_BASEURL}/subidd/visibility`,
    updateSubImportantOrder: `${API_BASEURL}/subidd/reorder`,

    // subha(subapply)
    getSubApply: `${API_BASEURL}/subha`,
    createSubApply: `${API_BASEURL}/subha/create`,
    updateSubApply: `${API_BASEURL}/subha/update`,
    deleteSubApply: `${API_BASEURL}/subha/visibility`,
    updateSubApplyOrder: `${API_BASEURL}/subha/reorder`,

    // faqaddon(subFAQ)
    getSubFAQ: `${API_BASEURL}/faqaddon`,
    createSubFAQ: `${API_BASEURL}/faqaddon/create`,
    updateSubFAQ: `${API_BASEURL}/faqaddon/update`,
    deleteSubFAQ: `${API_BASEURL}/faqaddon/visibility`,
    updateSubFAQOrder: `${API_BASEURL}/faqaddon/reorder`,

    // ufaddon(subfuture)
    getSubFuture: `${API_BASEURL}/ufaddon`,
    createSubFuture: `${API_BASEURL}/ufaddon/create`,
    updateSubFuture: `${API_BASEURL}/ufaddon/update`,
    deleteSubFuture: `${API_BASEURL}/ufaddon/visibility`,
    updateSubFutureOrder: `${API_BASEURL}/ufaddon/reorder`,

    // subapd(subavailable)
    getSubAvailable: `${API_BASEURL}/subapd`,
    createSubAvailable: `${API_BASEURL}/subapd/create`,
    updateSubAvailable: `${API_BASEURL}/subapd/update`,
    deleteSubAvailable: `${API_BASEURL}/subapd/visibility`,
    updateSubAvailableOrder: `${API_BASEURL}/subapd/reorder`,

    // year(sub studydegree)
    getSubStudyDegree: `${API_BASEURL}/year`,
    createSubStudyDegree: `${API_BASEURL}/year/create`,
    updateSubStudyDegree: `${API_BASEURL}/year/update`,
    deleteSubStudyDegree: `${API_BASEURL}/year/visibility`,
    updateSubStudyDegreeOrder: `${API_BASEURL}/year/reorder`,

    // subservice
    getSubserviceAF: `${API_BASEURL}/subservice`,
    createSubserviceAF: `${API_BASEURL}/subservice/create-af`,
    updateSubserviceAF: `${API_BASEURL}/subservice/update-af`,
    deleteSubserviceAF: `${API_BASEURL}/subservice/visibility-af`,
    updateSubserviceAFOrder: `${API_BASEURL}/subservice/reorder-af`,
    createSubserviceRAS: `${API_BASEURL}/subservice/create-ras`,
    updateSubserviceRAS: `${API_BASEURL}/subservice/update-ras`,
    deleteSubserviceRAS: `${API_BASEURL}/subservice/visibility-ras`,
    updateSubserviceRASOrder: `${API_BASEURL}/subservice/reorder-ras`,

    // slideshow
    getSlideshow: `${API_BASEURL}/slideshow`,
    createSlideshow: `${API_BASEURL}/slideshow/create`,
    updateSlideshow: `${API_BASEURL}/slideshow/update`,
    deleteSlideshow: `${API_BASEURL}/slideshow/visibility`,
    updateSlideshowOrder: `${API_BASEURL}/slideshow/reorder`,

    // service
    getService: `${API_BASEURL}/service`,
    createService: `${API_BASEURL}/service/create`,
    updateService: `${API_BASEURL}/service/update`,
    deleteService: `${API_BASEURL}/service/visibility`,
    updateServiceOrder: `${API_BASEURL}/service/reorder`,

    // btnss
    getBtnss: `${API_BASEURL}/btnss`,
    createBtnss: `${API_BASEURL}/btnss/create`,
    updateBtnss: `${API_BASEURL}/btnss/update`,
    deleteBtnss: `${API_BASEURL}/btnss/visibility`,

    // section
    getSection: `${API_BASEURL}/section`,
    getSectionByPage: `${API_BASEURL}/section/by-page`,
    createSection: `${API_BASEURL}/section/create`,
    updateSection: `${API_BASEURL}/section/update`,
    deleteSection: `${API_BASEURL}/section/visibility`,
    updateSectionOrder: `${API_BASEURL}/section/reorder`,
    syncSection: `${API_BASEURL}/section/sync-section`,

    // faculty
    getFaculty: `${API_BASEURL}/faculty`,
    createFaculty: `${API_BASEURL}/faculty/create`,
    updateFaculty: `${API_BASEURL}/faculty/update`,
    deleteFaculty: `${API_BASEURL}/faculty/visibility`,
    duplicateFaculty: `${API_BASEURL}/faculty/duplicate`,
    updateFacultyOrder: `${API_BASEURL}/faculty/reorder`,

    // faculty-contact
    getFacultyContact: `${API_BASEURL}/faculty-contact`,
    getFacultyContactByFaculty: `${API_BASEURL}/faculty-contact/by-faculty`,
    createFacultyContact: `${API_BASEURL}/faculty-contact/create`,
    updateFacultyContact: `${API_BASEURL}/faculty-contact/update`,
    deleteFacultyContact: `${API_BASEURL}/faculty-contact/visibility`,
    updateFacultyContactOrder: `${API_BASEURL}/faculty-contact/reorder`,

    // faculty-bg
    getFacultyBG: `${API_BASEURL}/faculty-bg`,
    getFacultyBGByFaculty: `${API_BASEURL}/faculty-bg/by-faculty`,
    createFacultyBG: `${API_BASEURL}/faculty-bg/create`,
    updateFacultyBG: `${API_BASEURL}/faculty-bg/update`,
    deleteFacultyBG: `${API_BASEURL}/faculty-bg/visibility`,
    updateFacultyBGOrder: `${API_BASEURL}/faculty-bg/reorder`,

    // faculty-info
    getFacultyInfo: `${API_BASEURL}/faculty-info`,
    getFacultyInfoByFaculty: `${API_BASEURL}/faculty-info/by-faculty`,
    createFacultyInfo: `${API_BASEURL}/faculty-info/create`,
    updateFacultyInfo: `${API_BASEURL}/faculty-info/update`,
    deleteFacultyInfo: `${API_BASEURL}/faculty-info/visibility`,
    updateFacultyInfoOrder: `${API_BASEURL}/faculty-info/reorder`,

    // social
    getSocial: `${API_BASEURL}/social`,
    getSocialByFaculty: `${API_BASEURL}/social/by-faculty`,
    createSocial: `${API_BASEURL}/social/create`,
    updateSocial: `${API_BASEURL}/social/update`,
    deleteSocial: `${API_BASEURL}/social/visibility`,
    updateSocialOrder: `${API_BASEURL}/social/reorder`,

    // career
    getCareer: `${API_BASEURL}/career`,
    createCareer: `${API_BASEURL}/career/create`,
    updateCareer: `${API_BASEURL}/career/update`,
    deleteCareer: `${API_BASEURL}/career/visibility`,
    duplicateCareer: `${API_BASEURL}/career/duplicate`,
    updateCareerOrder: `${API_BASEURL}/career/reorder`,

    // feedback
    getScholarship: `${API_BASEURL}/scholarship`,
    createScholarship: `${API_BASEURL}/scholarship/create`,
    updateScholarship: `${API_BASEURL}/scholarship/update`,
    deleteScholarship: `${API_BASEURL}/scholarship/visibility`,
    duplicateScholarship: `${API_BASEURL}/scholarship/duplicate`,
    updateScholarshipOrder: `${API_BASEURL}/scholarship/reorder`,


    getResearch: `${API_BASEURL}/rsd`,
    createResearch: `${API_BASEURL}/rsd/create`,
    updateResearch: `${API_BASEURL}/rsd/update`,
    deleteResearch: `${API_BASEURL}/rsd/visibility`,
    duplicateResearch: `${API_BASEURL}/rsd/duplicate`,
    updateResearchOrder: `${API_BASEURL}/rsd/reorder`,

    // researchlab
    getResearchlab: `${API_BASEURL}/rsdl`,
    createResearchlab: `${API_BASEURL}/rsdl/create`,
    updateResearchlab: `${API_BASEURL}/rsdl/update`,
    deleteResearchlab: `${API_BASEURL}/rsdl/visibility`,
    duplicateResearchlab: `${API_BASEURL}/rsdl/duplicate`,
    updateResearchlabOrder: `${API_BASEURL}/rsdl/reorder`,

    //rsdltag
    getResearchlabTag: `${API_BASEURL}/rsdltag`,
    createResearchlabTag: `${API_BASEURL}/rsdltag/create`,
    updateResearchlabTag: `${API_BASEURL}/rsdltag/update`,
    deleteResearchlabTag: `${API_BASEURL}/rsdltag/visibility`,
    duplicateResearchlabTag: `${API_BASEURL}/rsdltag/duplicate`,
    updateResearchlabTagOrder: `${API_BASEURL}/rsdltag/reorder`,

    // feedback
    getFeedback: `${API_BASEURL}/feedback`,
    createFeedback: `${API_BASEURL}/feedback/create`,
    updateFeedback: `${API_BASEURL}/feedback/update`,
    deleteFeedback: `${API_BASEURL}/feedback/visibility`,
    duplicateFeedback: `${API_BASEURL}/feedback/duplicate`,
    updateFeedbackOrder: `${API_BASEURL}/feedback/reorder`,

    // partnership
    getPartnership: `${API_BASEURL}/partnership`,
    createPartnership: `${API_BASEURL}/partnership/create`,
    updatePartnership: `${API_BASEURL}/partnership/update`,
    deletePartnership: `${API_BASEURL}/partnership/visibility`,
    duplicatePartnership: `${API_BASEURL}/partnership/duplicate`,
    updatePartnershipOrder: `${API_BASEURL}/partnership/reorder`,

    // button
    // buttons: `${API_BASEURL}/button`,

    // addon
    // addons: `${API_BASEURL}/addon`
};

export {API_BASEURL, API_ENDPOINTS, API};