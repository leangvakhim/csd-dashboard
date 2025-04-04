const API_BASEURL = "https://54.151.188.108/api";
// const API_BASEURL = "http://127.0.0.1:8000/api";

const API_ENDPOINTS = {
    // text
    // texts: `${API_BASEURL}/text`,

    // images
    getImages: `${API_BASEURL}/images`,
    uploadImage: `${API_BASEURL}/images/create`,
    deleteImage: `${API_BASEURL}/images/delete`,

    // news
    getEvent: `${API_BASEURL}/event`,
    createEvent: `${API_BASEURL}/event/create`,
    updateEvent: `${API_BASEURL}/event/update`,
    deleteEvent: `${API_BASEURL}/event/visibility`,
    duplicateEvent: `${API_BASEURL}/event/duplicate`,
    updateEventOrder: `${API_BASEURL}/event/reorder`,

    // faculty
    getFaculty: `${API_BASEURL}/faculty`,
    createFaculty: `${API_BASEURL}/faculty/create`,
    // updateFaculty: `${API_BASEURL}/faculty/update`,
    // deleteFaculty: `${API_BASEURL}/faculty/visibility`,
    // duplicateFaculty: `${API_BASEURL}/faculty/duplicate`,
    // updateFacultyOrder: `${API_BASEURL}/faculty/reorder`,

    // faculty-contact
    getFaculty: `${API_BASEURL}/faculty-contact`,
    createFacultyContact: `${API_BASEURL}/faculty-contact/create`,
    // updateFacultyContact: `${API_BASEURL}/faculty-contact/update`,
    // deleteFacultyContact: `${API_BASEURL}/faculty-contact/visibility`,
    // updateFacultyContactOrder: `${API_BASEURL}/faculty-contact/reorder`,


    // button
    // buttons: `${API_BASEURL}/button`,

    // addon
    // addons: `${API_BASEURL}/addon`
};

export {API_BASEURL, API_ENDPOINTS};