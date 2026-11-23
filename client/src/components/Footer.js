import React, { useEffect, useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import logo from "../assets/Logo.svg";
import api from "../../src/common/apiClient"; // adjust path to your apiClient.js
import SummaryApi from "../../src/common/SummaryApi"; // adjust path to your summaryApi.js

// NOTE: This section uses a serif display face for the logo wordmark and column headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const MAX_VISIBLE_CATEGORIES = 5;

const socialLinks = [
  { icon: FaFacebook, href: "https://www.facebook.com/chettinadhandicrafts07", label: "Facebook" },
  { icon: FaInstagram, href: "https://www.instagram.com/chettinadhandicrafts07/", label: "Instagram" },
  { icon: FaYoutube, href: "https://www.youtube.com/@ChettinadHandiCrafts", label: "YouTube" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
];

// Custom Orders + Enquiry now live here instead of Products
const companyLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Services", href: "/services" },
  { label: "FAQ", href: "/faqs" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Custom Orders", href: "/orders" },
  { label: "Enquiry", href: "/enquiry" },
];

const contactInfo = [
  {
    icon: MapPin,
    lines: ["No. 7, Old Municipal Street,", "Idayar Street, Karaikudi,", "Sivagangai District – 630001,", "Tamil Nadu, India."],
  },
  {
    icon: Phone,
    lines: ["+91 70107 39928"],
    type: "phone",
    value: "+91701073928",
  },
  {
    icon: Mail,
    lines: ["Chettinadhandicrafts07@gmail.com"],
    type: "email",
    value: "Chettinadhandicrafts07@gmail.com",
  },
  {
    icon: Clock,
    lines: ["Mon - Sat: 9:00 AM - 6:30 PM"],
  },
];

export default function Footer() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const response = await api({
          url: SummaryApi.getCategory.url,
          method: SummaryApi.getCategory.method,
        });

        // Adjust this line if your API wraps data differently
        const data = response?.data?.data || response?.data?.categories || [];

        if (isMounted) setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        if (isMounted) setLoadingCategories(false);
      }
    };

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  const visibleCategories = categories.slice(0, MAX_VISIBLE_CATEGORIES);
  const hasMoreCategories = categories.length > MAX_VISIBLE_CATEGORIES;

  return (
    <footer className="w-full bg-[#0B1A35] pt-10 sm:pt-14 lg:pt-16 pb-6 sm:pb-8">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 lg:px-4 xl:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8 text-left">
          {/* Logo + description + socials - Row 1 Column 1 on tablet */}
          <div className="sm:col-span-1 lg:col-span-1">
            <img src={logo} alt="Chettinad Handi Crafts" className="h-10 sm:h-12 w-auto" />
            <p className="mt-4 sm:mt-5 text-sm text-white/80 max-w-xs">
              Crafting timeless wood, stone and art works inspired by the rich
              heritage of chettinad tradition since 1995.
            </p>
            <div className="mt-4 sm:mt-5 flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded text-white hover:text-[#E29C15] transition-colors"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Products - dynamic categories from DB */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#E29C15]">Products</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {loadingCategories && (
                <li className="text-xs sm:text-sm text-white/50">Loading...</li>
              )}

              {!loadingCategories && categories.length === 0 && (
                <li className="text-xs sm:text-sm text-white/50">No categories found</li>
              )}

              {!loadingCategories &&
                visibleCategories.map((category) => (
                  <li key={category._id}>
                    <a
                      href={`/products?category=${category.slug || category._id}`}
                      className="text-xs sm:text-sm text-white/80 hover:text-[#E29C15] transition-colors"
                    >
                      {category.name}
                    </a>
                  </li>
                ))}

              {!loadingCategories && hasMoreCategories && (
                <li>
                  <a
                    href="/products"
                    className="text-xs sm:text-sm font-semibold text-[#E29C15] hover:underline transition-colors"
                  >
                    See More &rarr;
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Company - now includes Custom Orders + Enquiry */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#E29C15]">Company</h3>
            <ul className="mt-3 sm:mt-4 space-y-2 sm:space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-xs sm:text-sm text-white/80 hover:text-[#E29C15] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sm:col-span-1 lg:col-span-1">
            <h3 className="font-serif text-base sm:text-lg font-semibold text-[#E29C15]">Contact</h3>
            <ul className="mt-3 sm:mt-4 space-y-3 sm:space-y-4">
              {contactInfo.map(({ icon: Icon, lines, type, value }, i) => {
                const isClickable = type === "phone" || type === "email";

                return (
                  <li key={i} className="flex items-start gap-3">
                    <Icon className="w-4 h-4 text-[#E29C15] flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      {lines.map((line, li) => {
                        if (isClickable && li === 0 && type === "phone") {
                          return (
                            <a
                              key={li}
                              href={`tel:${value}`}
                              className="text-xs sm:text-sm text-white/80 hover:text-[#E29C15] hover:underline transition-colors block"
                            >
                              {line}
                            </a>
                          );
                        }

                        if (isClickable && li === 0 && type === "email") {
                          return (
                            <a
                              key={li}
                              href={`mailto:${value}`}
                              className="text-xs sm:text-sm text-white/80 hover:text-[#E29C15] hover:underline transition-colors block break-all"
                            >
                              {line}
                            </a>
                          );
                        }

                        return (
                          <p key={li} className="text-xs sm:text-sm text-white/80">
                            {line}
                          </p>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-white/60 text-center sm:text-left">
            &copy; {new Date().getFullYear()} Chettinad Handi Crafts. All Rights Reserved. | Developed by{" "}
            <a
              href="https://digida.in"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-white/80 hover:text-[#E29C15] transition-colors hover:underline"
            >
              Digida
            </a>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs sm:text-sm font-semibold text-white hover:text-[#E29C15] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}