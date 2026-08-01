const isLocalNetwork =
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1";

const backendDomain =
  process.env.NODE_ENV === "development"
    ? isLocalNetwork
      ? `http://${window.location.hostname}:5000`
      : "http://localhost:5000"
    : process.env.NODE_ENV === "production"
      ? // ? "https://naach-boutique.onrender.com"   // Use the production API in production environment
        "https://dnbs.onrender.com"
      : "http://192.168.0.1:5000";

const SummaryApi = {
  // ===================== ENQUIRY ROUTES =====================
  // createEnquiry: {
  //     url: `${backendDomain}/api/enquiries/create`,
  //     method: "post"
  // },

  // ===================== LOGIN ROUTES =====================
  createLogin: {
    url: `${backendDomain}/api/auth/login`,
    method: "post",
  },

  
  // ===================== BLOG ROUTES =====================

  createBlog: {
    url: `${backendDomain}/api/blogs/create`,
    method: "post",
  },
  getBlogs: {
    url: `${backendDomain}/api/blogs/getall`,
    method: "get",
  },
  getBlogsById: {
    url: `${backendDomain}/api/blogs/get/:id`,
    method: "get",
  },
  updateBlogsById: {
    url: `${backendDomain}/api/blogs/update/:id`,
    method: "put",
  },
  deleteBlogsById: {
    url: `${backendDomain}/api/blogs/delete/:id`,
    method: "delete",
  },


// ===================== GALLERY ROUTES =====================

createGallery: {
  url: `${backendDomain}/api/gallery/create`,
  method: "post",
},
getGallery: {
  url: `${backendDomain}/api/gallery/get`, // public
  method: "get",
},
getAllGalleryAdmin: {
  url: `${backendDomain}/api/gallery/getall`, // protected, use in dashboard
  method: "get",
},
getGalleryById: {
  url: `${backendDomain}/api/gallery/get/id/:id`,
  method: "get",
},
editGallery: {
  url: `${backendDomain}/api/gallery/update/:id`, // fixed: was /edit/:id
  method: "put",
},
deleteGallery: {
  url: `${backendDomain}/api/gallery/delete/:id`, // fixed: was /api/auth/delete/:id
  method: "delete",
},
getGalleryBySlug: {
  url: `${backendDomain}/api/gallery/slug/:slug`, // public
  method: "get",
},
createCategory: {
  url: `${backendDomain}/api/category/create`,
  method: "post",
},
getAllCategories: {
  url: `${backendDomain}/api/category/getall`,
  method: "get",
},

//custom-order
   getOrders: {
  url: `${backendDomain}/api/custom-order/getall`,
  method: "get",
},
getOrdersById: {
  url: `${backendDomain}/api/custom-order/get/:id`,
  method: "get",
},
editOrdersStatus: {
  url: `${backendDomain}/api/custom-order/update/:id/status`,
  method: "put",
},
createNotesById: {
  url: `${backendDomain}/api/custom-order/notes/:id`,
  method: "post",
},
getNotesById: {
  url: `${backendDomain}/api/custom-order/notes/:id`,
  method: "get",
},
updateNotesById: {
  url: `${backendDomain}/api/custom-order/notes/:id`,
  method: "put",
},
deleteNotesById: {
  url: `${backendDomain}/api/custom-order/notes/:id`,
  method: "delete",
},
deleteOrderById: {
  url: `${backendDomain}/api/custom-order/delete/:id`,
  method: "delete",
},

//enquiry api

getAllEnquiries: {
  url: `${backendDomain}/api/enquiry/getall`,
  method: "get",
},
getEnquiryById: {
  url: `${backendDomain}/api/enquiry/get/:id`,
  method: "get",
},
deleteEnquiryById: {
  url: `${backendDomain}/api/enquiry/delete/:id`,
  method: "delete",
},


editEnquiryStatus: {
  url: `${backendDomain}/api/enquiry/update/:id/status`,
  method: "put",
},

//contact api

getAllContacts: {
  url: `${backendDomain}/api/contacts/getall`,
  method: "get",
},
getContactById: {
  url: `${backendDomain}/api/contacts/get/:id`,
  method: "get",
},
editContactStatus: {
  url: `${backendDomain}/api/contacts/update/:id/status`,
  method: "put",
},
deleteContactById: {
  url: `${backendDomain}/api/contacts/delete/:id`,
  method: "delete",
},


};





export default SummaryApi;
