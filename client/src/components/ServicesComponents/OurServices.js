import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { CheckCircle2, ArrowRight, Hammer, Gem, Wrench, Truck } from "lucide-react";
import Img1 from "../../assets/ServicesImages/ServicesBanner.webp";
import Img2 from "../../assets/ServicesImages/Stone.webp";
import Img3 from "../../assets/ServicesImages/Installation.webp";
import Img4 from "../../assets/ServicesImages/Delivery.webp";
import IconImg from "../../assets/ServicesImages/IconImage.webp";

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/**
 * One alternating image / content row.
 *
 * imageOnLeft flips the layout order on lg+ screens; on mobile the image
 * always stacks above the content.
 */
function ServiceRow({ service, index, enquiryPath, navigate }) {
  const rowRef = useRef(null);
  const isInView = useInView(rowRef, { once: true, amount: 0.2 });
  const imageOnLeft = index % 2 === 0;
  //   const Icon = service.icon;

  return (
    <motion.div
      ref={rowRef}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={rowVariants}
      className={`flex flex-col ${
        imageOnLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      } items-center gap-8 lg:gap-14`}
    >
      {/* Image */}
      <div className="w-full lg:w-1/2">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover rounded-lg"
        />
      </div>

      {/* Content */}
      <div className="w-full lg:w-1/2 text-left">
        {/* Title with image on left side */}
        <div className="flex items-center gap-4 mb-4">
          <img
            src={service.titleImage}
            alt={service.title}
            className="w-16 h-16 object-cover rounded-full"
          />
          <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-medium text-[#5B2D07]">
            {service.title}
          </h3>
        </div>

        <p className="mt-3 text-sm sm:text-base text-[#2A190C]">
          {service.description}
        </p>

        {service.features?.length > 0 && (
          <ul className="mt-4 space-y-2">
            {service.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#FFFFFF] flex-shrink-0" fill="#fdae04" />
                <span className="text-sm sm:text-base text-[#000000]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={() =>
            navigate(`${enquiryPath}#contact-form`, {
              state: { subject: service.title },
            })
          }
          className="mt-4 inline-flex items-center gap-1 text-sm sm:text-base font-semibold text-[#E29C15] hover:text-[#C98B24] transition-colors"
        >
          Contact Us
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Our Services section - Self-contained with embedded data
 */
export default function OurServices() {
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.3 });

  // Embedded services data
  const services = [
    {
      icon: Hammer,
      image: `${Img1}`,
      titleImage: `${IconImg}`,
      title: "Custom Wood Works",
      description:
        "From handcrafted wooden doors and pillars to furniture and bespoke interior woodwork, we create timeless pieces using premium-quality wood and traditional Chettinad craftsmanship. Every project is custom-made to match your style, space, and requirements.",
      features: [
        "Doors, Pillars, Furniture & Swings",
        "Traditional & Contemporary Designs",
        "Teak, Rose, Satin, Jack, Vengai & Vembu Wood",
      ],
    },
    {
      icon: Gem,
      image: `${Img2}`,
      titleImage: `${IconImg}`,
      title: "Stone Craftsmanship",
      description:
        "We specialize in original granite stone works that combine traditional artistry with lasting strength. Every stone creation is handcrafted with precision by skilled artisans to enhance homes, villas, temples, and commercial spaces.",
      features: [
        "Original Granite Stone Pillars",
        "Traditional Stone Carvings",
        "Granite, Old Stone & Polished Stone Works",
      ],
    },
    {
      icon: Wrench,
      image: `${Img3}`,
      titleImage: `${IconImg}`,
      title: "Tanjore Painting Services",
      description:
        "Celebrate India's rich artistic heritage with authentic handcrafted Tanjore paintings. We also provide restoration and dull-finish rework services to bring old paintings back to life while preserving their original beauty.",
      features: [
        "New Tanjore Paintings",
        "Tanjore Painting Restoration",
        "Customized Traditional Artworks",
      ],
    },
    {
      icon: Truck,
      image: `${Img4}`,
      titleImage: `${IconImg}`,
      title: "Pan India Delivery & Support",
      description:
        "From our workshop in Karaikudi to your location anywhere in India, we ensure safe transportation, timely delivery, and complete guidance for installation and handling of every handcrafted creation.",
      features: [
        "Safe & Secure Packaging",
        "Reliable Pan India Delivery",
        "Installation Guidance & Support",
      ],
    },
  ];

  const eyebrow = "Our Expertise";
  const heading = "Services We Offer";
  const enquiryPath = "/contact-us";

  return (
    <section className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        {/* Section header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={headingVariants}
          className="text-center"
        >
          <span className="text-xs sm:text-sm font-medium tracking-wide text-[#E29C15]">
            {eyebrow}
          </span>
          <h2 className="mt-2 font-serif text-2xl sm:text-3xl md:text-4xl font-regular text-[#5B2D07]">
            {heading}
          </h2>
        </motion.div>

        {/* Alternating rows */}
        <div className="mt-12 flex flex-col gap-16 sm:gap-20">
          {services.map((service, i) => (
            <ServiceRow
              key={service.title + i}
              service={service}
              index={i}
              enquiryPath={enquiryPath}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </section>
  );
}