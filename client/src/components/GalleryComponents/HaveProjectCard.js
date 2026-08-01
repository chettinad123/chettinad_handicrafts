import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Img from "../../assets/GalleryImages/ProjectCardImg.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

/**
 * "Have a Project in Mind?" navy CTA card.
 *
 * Props:
 * - image: string           image source URL (required)
 * - imageAlt: string        image alt text (default "Project icon")
 * - title: string           default "Have a Project in Mind?"
 * - description: string     default "Share your ideas and let our artisans bring them to life."
 * - buttonLabel: string     default "Enquiry"
 * - enquiryPath: string     route the button navigates to (default "/enquiry-form")
 */
export default function HaveProjectCard({
  image = `${Img}`,
  imageAlt = "Project icon",
  title = "Have a Project in Mind?",
  description = "Share your vision, and let our skilled artisans transform it into a timeless masterpiece.",
  buttonLabel = "Enquiry",
  enquiryPath = "/enquiry",
}) {
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

  return (
    <section ref={sectionRef} className="w-full bg-[#F7F2E8] py-4 sm:py-6">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={cardVariants}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 rounded-2xl bg-[#0B1A35] px-6 sm:px-8 py-6 sm:py-7"
        >
          <div className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 overflow-hidden">
            <img 
              src={image} 
              alt={imageAlt}
              className="w-full h-full"
            />
          </div>

          <div className="flex-1 text-center sm:text-center">
            <h3 className="font-serif text-lg sm:text-xl md:text-2xl font-sem text-white">
              {title}
            </h3>
            <p className="mt-1 text-sm sm:text-base text-white">
              {description}
            </p>
          </div>

          <button
            onClick={() => navigate(enquiryPath)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-3.5 text-sm font-semibold text-white flex-shrink-0"
          >
            {buttonLabel}
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}