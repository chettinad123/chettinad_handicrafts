import React from "react";
import { createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import AboutUs from "../pages/AboutUs";
import Products from "../pages/Products";
import Services from "../pages/Services";
import Gallery from "../pages/Gallery";
import ContactUs from "../pages/ContactUs";
import Orders from "../pages/Orders";
import FaqPage from "../pages/FaqPage";
import Enquiry from "../pages/Enquiry";
import BlogPage from "../pages/BlogPage";
import BlogView from "../pages/BlogView";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path:'about-us',
        element: <AboutUs />
      },
      {
        path:'products',
        element: <Products />
      },
      {
        path:'services',
        element: <Services />
      },
      {
        path:'gallery',
        element: <Gallery />
      },
      {
        path:'contact-us',
        element: <ContactUs />
      },
      {
        path:'orders',
        element: <Orders />
      },
      {
        path:'faqs',
        element: <FaqPage />
      },
      {
        path:'enquiry',
        element: <Enquiry />
      },
      {
        path:'blog',
        element: <BlogPage />
      },
      {
        path:'blog-view/:id',
        element: <BlogView />
      },
      {
        path:'privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path:'terms-and-conditions',
        element: <TermsAndConditions />
      },
    ],
  },
]);

export default router;
