import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import img from "../../assets/ServicesImages/CtaImage.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const barVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

export default function ServicesCTA({
  // Text content props
  title = "Have a Project in Mind?",
  description = "Share Your Requirements with Us and we Will bring Your vision to life.",
  buttonLabel = "Enquiry",
  
  // Navigation props
  enquiryPath = "/enquiry",
  
  // Styling props
  backgroundColor = "bg-[#0B1A35]",
  borderColor = "border-[#E29C15]",
  buttonColor = "bg-[#E29C15]",
  buttonHoverColor = "hover:bg-[#C98B24]",
  textColor = "text-[#5B2D07]",
  descriptionColor = "text-[#2A190C]",
  
  // Image props
  backgroundImage = img,
  imageAlt = "Background image",
  
  // Animation props
  animationAmount = 0.3,
  
  // Additional className for customization
  className = "",
  buttonClassName = "",
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: animationAmount });

  return (
    <section ref={sectionRef} className={`w-full ${backgroundColor} pb-14 sm:pb-20 ${className}`}>
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={barVariants}
          className={`relative overflow-hidden flex flex-col sm:block items-center gap-4 rounded border-2 ${borderColor} px-6 sm:px-8 py-12 sm:py-16`}
        >
          <img
            src={backgroundImage}
            alt={imageAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0" />

          <div className="relative z-10 text-center">
            <h3 className={`font-serif text-lg sm:text-xl md:text-2xl font-medium ${textColor}`}>
              {title}
            </h3>
            <p className={`mt-1 text-sm sm:text-base ${descriptionColor}`}>
              {description}
            </p>
          </div>

          <button
            onClick={() => navigate(enquiryPath)}
            className={`relative z-10 w-full sm:w-auto sm:absolute sm:right-8 sm:top-1/2 sm:-translate-y-1/2 inline-flex items-center justify-center gap-1 rounded-lg ${buttonColor} ${buttonHoverColor} transition-colors px-6 py-3.5 text-sm font-semibold text-white flex-shrink-0 ${buttonClassName}`}
          >
            {buttonLabel}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}