// const API = "https://52.221.196.157";
const API = "http://127.0.0.1:8000";
const API_BASEURL = `${API}/api`;

const API_ENDPOINTS = {
    // text
    // texts: `${API_BASEURL}/text`,

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

    // section
    getSection: `${API_BASEURL}/section`,
    getSectionByPage: `${API_BASEURL}/section/by-page`,
    createSection: `${API_BASEURL}/section/create`,
    updateSection: `${API_BASEURL}/section/update`,
    deleteSection: `${API_BASEURL}/section/visibility`,
    updateSectionOrder: `${API_BASEURL}/section/reorder`,

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