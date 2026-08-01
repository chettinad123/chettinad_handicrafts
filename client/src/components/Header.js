import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronRight, ChevronRightIcon } from "lucide-react";
import logo from "../assets/Logo.svg";
import { Helmet } from "react-helmet-async";

// NOTE: This section uses a serif display face for the logo wordmark.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const navLinks = [
  { label: "Home", to: "/" },
  { label: "About us", to: "/about-us" },
  { label: "Products", to: "/products" },
  { label: "Services", to: "/services" },
  { label: "Gallery", to: "/gallery" },
  { label: "Contact Us", to: "/contact-us" },
];

export default function Header() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { pathname } = useLocation();
  const canonicalURL = `${window.location.origin}${pathname}`;

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
          <Helmet>
        <link rel="canonical" href={canonicalURL} />
        <title>Chettinad Handicrafts | Chettinad</title>
      </Helmet>
      {/* Fixed header — sits above everything, including the hero section */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[#0B1A35] py-4">
        <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="Chettinad Handi Crafts" className="h-10 sm:h-12 w-auto" />
            </a>

            {/* Desktop pill nav */}
            <nav className="hidden lg:flex items-center justify-between flex-1 ml-6 bg-white rounded-xl pl-8 pr-2 py-2">
              <ul className="flex items-center gap-12 xl:gap-15">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        `text-sm font-medium transition-colors ${
                          isActive
                            ? "text-[#E29C15]"
                            : "text-[#0B1A35] hover:text-[#E29C15]"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/enquiry")}
                className="inline-flex items-center gap-1 rounded-xl bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-5 py-2.5 text-sm font-semibold text-white flex-shrink-0"
              >
                Enquiry
                <ChevronRight className="w-4 h-4" />
              </button>
            </nav>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white text-[#0B1A35] flex-shrink-0"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Spacer — reserves the header's height so page content (including the
          hero) starts below it instead of being covered by the fixed header.
          Heights are responsive to match the header's actual rendered size:
          logo h-10 (mobile) / h-12 (sm+) plus py-4 (32px) of vertical padding. */}
      <div className="h-[72px] sm:h-[80px]" aria-hidden="true" />

      {/* Mobile backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`lg:hidden fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Mobile side drawer — slides in from the right */}
      <nav
        className={`lg:hidden fixed top-0 right-0 z-[70] h-full w-[78%] max-w-xs bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          {/* <img src={logo} alt="Chettinad Handi Crafts" className="h-9 w-auto" /> */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#0B1A35] text-white flex-shrink-0"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="flex flex-col gap-1 px-6 py-6">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block py-3 text-base font-medium border-b border-gray-50 transition-colors ${
                    isActive
                      ? "text-[#E29C15]"
                      : "text-[#0B1A35] hover:text-[#E29C15]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-6">
          <button
            onClick={() => {
              setMobileOpen(false);
              navigate("/enquiry");
            }}
            className="w-full inline-flex items-center justify-center gap-1 rounded-full bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-5 py-3 text-sm font-semibold text-white"
          >
            Enquiry
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </nav>
    </>
  );
}