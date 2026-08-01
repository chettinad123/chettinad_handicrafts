import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "../App";
import Layout from "../components/Layout";
import Login from "../pages/Login";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
// import Unauthorized from "../pages/UnAuthorized";
import GalleryDashboard from "../pages/GalleryDashboard";
import ContactList from "../pages/ContactList";
import AddGallery from "../pages/AddGallery";
import OrdersDashboard from "../pages/OrdersDashboard";
import OrderDetails from "../pages/OrderDetails";
import EnquiryDashboard from "../pages/EnquiryDashboard";
import BlogDashboard from "../pages/BolgDashboard";
import BlogForm from "../pages/BlogForm";
import EnquiryDetails from "../pages/EnquiryDetails";
import ContactDetails from "../pages/ContactDetails";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        // Redirect root → login
        index: true,
        element: <Navigate to="login" replace />,
      },

      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },

      // {
      //   path: "unauthorized",
      //   element: <Unauthorized />
      // },

      // ── Admin panel (with Layout) ──
      {
        path: "admin-panel",
        element: <Layout />,
        children: [
          {
            index: true,
            element: <Navigate to="gallery" replace />,
          },
          {
            path: "gallery",
            element: <GalleryDashboard />,
          },
          {
            path: "gallery/add",
            element: <AddGallery />,
          },
          { path: "gallery/edit/:id", element: <AddGallery /> }, 
          {
            path: "contacts",
            element: <ContactList />,
          },
          {
            path: "orders",
            element: <OrdersDashboard />,
          },
          {
            path: "orders/:id",
            element: <OrderDetails />,
          },
          {
            path: "enquiries",
            element: <EnquiryDashboard />,
          },
          {
            path: "enquiries/:id",
             element: <EnquiryDetails />,
           },
          {
            path: "blogs",
            element: <BlogDashboard />,
          },
          {
            path: "blogs/add-blog",
            element: <BlogForm />,
          },
          {
            path: "contact-us/:id",
            element: <ContactDetails />,
},
        ],
      },

      // Global fallback — send unknown paths to login instead of a
      // non-existent "/unauthorized" route (that would otherwise loop
      // forever, since "*" would keep matching it).
      {
        path: "*",
        element: <Navigate to="/login" replace />,
      },
    ],
  },
]);

export default router;
