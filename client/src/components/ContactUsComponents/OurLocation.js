import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
// Use a fallback image or remove the import if the file doesn't exist
import Img from "../../assets/ContactImages/ShowRoom.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const leftVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const rightVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.1 },
  },
};

// Fallback image in case the import fails
const FALLBACK_IMAGE = "https://via.placeholder.com/800x600/0B1A35/E29C15?text=Showroom";

/**
 * "Our Location" section — map on the left, "Visit our Showroom" panel
 * with a background image on the right.
 *
 * Props:
 * - mapEmbedUrl: string     Google Maps embed src (iframe)
 * - locationName: string    e.g. "Chettinad Handi Crafts"
 * - locationAddress: string[] address lines shown in the pin card
 * - showroomImage: string   background image for the right panel
 * - showroomTitle: string   default "Visit our Showroom"
 * - showroomDescription: string
 * - directionsUrl: string   link for the "Directions" button
 */
export default function OurLocation({
  mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15713.21468330649!2d78.73234033584595!3d10.074185043655955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b00675309066273%3A0x8170132dd13c9cdd!2sOld%20Chettinad%20Crafters%20Ware%20House!5e0!3m2!1sen!2sin!4v1783841205947!5m2!1sen!2sin",
  locationName = "Chettinad Handi Crafts",
  locationAddress = ["No.7, Old Municipal Street, Idayar Street,", "Karaikudi, Sivagangai District - 630001"],
  showroomImage = `${Img}`,
  showroomTitle = "Visit Our Workshop",
  showroomDescription = "Experience the beauty of authentic Chettinad craftsmanship in person. Explore our handcrafted wooden works, original granite stone creations, and traditional Tanjore paintings at our workshop in Karaikudi.",
  directionsUrl = "https://www.google.com/maps/search/chettinad+hadicrafts+No.+7,+Old+Municipal+Street,+Idayar+Street,+Karaikudi,+Sivagangai+District+%E2%80%93+630001,+Tamil+Nadu,+India./@10.0776964,78.7473943,15z/data=!3m1!4b1?authuser=0&entry=ttu&g_ep=EgoyMDI2MDcwOC4wIKXMDSoASAFQAw%3D%3D",
}) {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  
  // State to handle image loading errors
  const [imageError, setImageError] = useState(false);
  
  // Use fallback image if the imported image fails or is undefined
  const imageSrc = imageError || !showroomImage ? FALLBACK_IMAGE : showroomImage;

  return (
    <section ref={sectionRef} className="w-full bg-[#F7F2E8] pb-14 sm:pb-20">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={leftVariants}
            className="rounded-xl border border-[#E29C15] bg-[#F7F2E8] p-4 sm:p-5"
          >
            <h3 className="font-serif text-lg sm:text-xl font-regular text-[#5B2D07] text-center">
              Our Location
            </h3>

            <div className="relative mt-4 w-full h-56 sm:h-64 md:h-72 rounded overflow-hidden">
              <iframe
                src={mapEmbedUrl}
                title="Our Location"
                loading="lazy"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />

              <div className="absolute left-4 bottom-4 flex items-start gap-2 rounded-lg bg-white px-3 py-2 shadow-md max-w-[70%]">
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-[#000000D0]">
                    {locationName}
                  </p>
                  {locationAddress.map((line, i) => (
                    <p key={i} className="text-[10px] sm:text-xs text-[#000000]">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visit our Showroom panel */}
          <motion.div
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={rightVariants}
            className="relative overflow-hidden rounded-xl border border-[#E29C15] min-h-[280px] sm:min-h-0 flex flex-col justify-center px-6 sm:px-8 py-8"
          >
            <img
              src={imageSrc}
              alt={showroomTitle}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
            <div className="absolute inset-0 bg-black/20" />

            <div className="relative z-10">
              <h3 className="font-serif text-xl sm:text-2xl font-regular text-[#FFFFFF]">
                {showroomTitle}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-white max-w-sm">
                {showroomDescription}
              </p>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1 rounded border border-[#E29C15] transition-colors px-5 py-2.5 text-sm font-semibold text-[#E29C15] hover:bg-[#E29C15] hover:text-white"
              >
                Directions
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}