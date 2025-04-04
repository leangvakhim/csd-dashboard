const API_BASEURL = "https://54.151.188.108/api";
// const API_BASEURL = "http://127.0.0.1:8000/api";

const API_ENDPOINTS = {
    // text
    // texts: `${API_BASEURL}/text`,

    // images
    getImages: `${API_BASEURL}/images`,
    uploadImage: `${API_BASEURL}/images/create`,
    deleteImage: `${API_BASEURL}/images/delete`,

    // events
    getEvent: `${API_BASEURL}/event`,
    createEvent: `${API_BASEURL}/event/create`,
    updateEvent: `${API_BASEURL}/event/update`,
    deleteEvent: `${API_BASEURL}/event/visibility`,
    duplicateEvent: `${API_BASEURL}/event/duplicate`,
    updateEventOrder: `${API_BASEURL}/event/reorder`,

    // faculty
    getFaculty: `${API_BASEURL}/faculty`,
    createFaculty: `${API_BASEURL}/faculty/create`,
    updateFaculty: `${API_BASEURL}/faculty/update`,
    deleteFaculty: `${API_BASEURL}/faculty/visibility`,
    // duplicateEvent: `${API_BASEURL}/event/duplicate`,
    // updateEventOrder: `${API_BASEURL}/event/reorder`,


    // news
    getNews: `${API_BASEURL}/news`,
    createNews: `${API_BASEURL}/news/create`,
    updateNews: `${API_BASEURL}/news/update`,
    deleteNews: `${API_BASEURL}/news/visibility`,
    duplicateNews: `${API_BASEURL}/news/duplicate`,
    updateNewsOrder: `${API_BASEURL}/news/reorder`,


    
    // button
    // buttons: `${API_BASEURL}/button`,

    // addon
    // addons: `${API_BASEURL}/addon`
};

export {API_BASEURL, API_ENDPOINTS};