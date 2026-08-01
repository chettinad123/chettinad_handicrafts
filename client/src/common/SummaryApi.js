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
  
  // ===================== BLOG ROUTES =====================

  getBlogs: {
    url: `${backendDomain}/api/blogs/getall`,
    method: "get",
  },
  getBlogsById: {
    url: `${backendDomain}/api/blogs/get/:id`,
    method: "get",
  },

// ===================== PRODUCTS & GALLERY ROUTES =====================

getGallery: {
  url: `${backendDomain}/api/gallery/get`, // public
  method: "get",
},

getGalleryById: {
  url: `${backendDomain}/api/gallery/get/id/:id`,
  method: "get",
},

getGalleryBySlug: {
  url: `${backendDomain}/api/gallery/slug/:slug`, // public
  method: "get",
},


// ===================== PRODUCTS & GALLERY ROUTES =====================

getCategory: {
  url: `${backendDomain}/api/category/getall`, // public
  method: "get",
},

getGalleryImagesByCategory: {
  url: `${backendDomain}/api/gallery/get`, // ⚠️ confirm this matches your app.use(...) mount path
  method: "get",
},


//custom-order
  createOrders: {
  url: `${backendDomain}/api/custom-order/create`,
  method: "post",
},


//enquiry api

createEnquiry: {
  url: `${backendDomain}/api/enquiry/create`,
  method: "post",
},


//contact api

createContact: {
  url: `${backendDomain}/api/contacts/create`,
  method: "post",
},

};





export default SummaryApi;
