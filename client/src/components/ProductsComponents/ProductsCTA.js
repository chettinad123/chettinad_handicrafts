import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import api from "../../common/apiClient"; // adjust path
import summaryApi from "../../common/SummaryApi"; // adjust path
import Image1 from "../../assets/ProductsImages/Before.webp";
import Image2 from "../../assets/ProductsImages/After.webp";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const thumbVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

/**
 * CTA section: Before & After comparison + client testimonial carousel,
 * plus a project gallery preview grid (first 6 active images from backend).
 */
export default function CTASection() {
  const navigate = useNavigate();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);

  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const beforeImage = `${Image1}`;
  const afterImage = `${Image2}`;
  const galleryPath = "/gallery";
  const autoPlayMs = 5000;

  const testimonials = [
    {
      text: "The craftsmanship is truly exceptional. The handcrafted wooden door and original granite pillars completely transformed the entrance of our home. The quality and detailing exceeded our expectations.",
      rating: 5,
      name: "Ramesh Kumar",
      location: "Chennai",
    },
    {
      text: "The craftsmanship is truly exceptional. The handcrafted wooden door and original granite pillars completely transformed the entrance of our home. The quality and detailing exceeded our expectations.",
      rating: 4,
      name: "Suresh Menon",
      location: "Bangalore",
    },
  ];

  useEffect(() => {
    if (!autoPlayMs || testimonials.length <= 1) return;
    const id = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, autoPlayMs);
    return () => clearInterval(id);
  }, [autoPlayMs, testimonials.length]);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setGalleryLoading(true);
        const res = await api({
          url: summaryApi.getGallery.url,
          method: summaryApi.getGallery.method,
          params: { paginate: false },
        });

        const raw = res.data?.data?.images ?? [];
        const activeImages = raw
          .filter((item) => item.status === "active")
          .map((item) => item.imageUrl)
          .slice(0, 6);

        if (isMounted) setGalleryImages(activeImages);
      } catch (err) {
        console.error("Failed to load gallery preview:", err);
        if (isMounted) setGalleryImages([]);
      } finally {
        if (isMounted) setGalleryLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const testimonial = testimonials[activeTestimonial];

  return (
    <section ref={sectionRef} className="w-full bg-[#F7F2E8] py-10 sm:py-14">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        {/* Top row: Before & After + Testimonial */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Before & After */}
          <motion.div
            variants={fadeUp}
            className="rounded-2xl border border-[#E29C15] bg-[#F7F2E8] p-5 sm:p-6 flex flex-col items-center"
          >
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5B2D07]">
              Before &amp; After
            </h3>

            <div className="relative mt-4 w-full max-w-md flex overflow-hidden border border-[#EAD9AE]">
              <img
                src={beforeImage}
                alt="Before"
                className="w-1/2 h-40 sm:h-48 object-cover"
              />
              <img
                src={afterImage}
                alt="After"
                className="w-1/2 h-40 sm:h-48 object-cover"
              />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-[#E29C15] flex items-center justify-center text-xs font-bold text-[#5B2D07] shadow">
                V/S
              </div>
            </div>

            <button
              onClick={() => navigate(galleryPath)}
              className="mt-5 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-2.5 text-sm font-semibold text-white"
            >
              View Gallery
            </button>
          </motion.div>

          {/* Testimonial */}
          {testimonial && (
            <motion.div
              variants={fadeUp}
              className="rounded-2xl border border-[#E29C15] bg-[#F7F2E8] p-5 sm:p-6 flex flex-col"
            >
              <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5B2D07] text-center">
                What Our Client Says
              </h3>

              <div className="mt-4 flex-1 rounded-xl border border-[#E29C15] bg-[#F5E6CA] p-5 sm:p-6 flex flex-col">
                <Quote className="w-6 h-6 text-[#E29C15]" fill="currentColor" />
                <p className="mt-3 text-sm sm:text-base text-[#2A190C] flex-1">
                  {testimonial.text}
                </p>

                <div className="mt-3 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? "text-[#E29C15] fill-[#E29C15]"
                          : "text-[#E0CFA0]"
                      }`}
                    />
                  ))}
                </div>

                <p className="mt-3 font-serif font-medium text-[#5B2D07]">
                  {testimonial.name}
                </p>
                <p className="text-xs sm:text-sm text-[#2A190C]">
                  {testimonial.location}
                </p>
              </div>

              {/* Pagination dots */}
              {testimonials.length > 1 && (
                <div className="mt-4 flex justify-center gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Show testimonial ${i + 1}`}
                      onClick={() => setActiveTestimonial(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === activeTestimonial
                          ? "w-5 bg-[#E29C15]"
                          : "w-2 bg-[#E0CFA0]"
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Project Gallery */}
        <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={fadeUp}
          className="mt-6 rounded-2xl border border-[#E29C15] p-5 sm:p-6 flex flex-col items-center lg:max-w-[80%] lg:mx-auto"
        >
          <h3 className="font-serif text-lg sm:text-xl font-semibold text-[#5B2D07]">
            Project Gallery
          </h3>

          {galleryLoading ? (
            <p className="mt-5 text-sm text-[#2A190C]">Loading gallery…</p>
          ) : galleryImages.length === 0 ? (
            <p className="mt-5 text-sm text-[#2A190C]">No gallery images yet.</p>
          ) : (
            <motion.div
              variants={containerVariants}
              className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full"
            >
              {galleryImages.map((img, i) => (
                <motion.img
                  key={i}
                  variants={thumbVariants}
                  src={img}
                  alt={`Project ${i + 1}`}
                  className="w-full h-24 sm:h-32 lg:h-48 xl:h-56 2xl:h-64 object-cover rounded"
                />
              ))}
            </motion.div>
          )}

          <button
            onClick={() => navigate(galleryPath)}
            className="mt-6 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-2.5 text-sm font-semibold text-white"
          >
            View Gallery
          </button>
        </motion.div>
      </div>
    </section>
  );
}