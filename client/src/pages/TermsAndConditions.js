import React from "react";
import { motion } from "framer-motion";

// NOTE: Uses the same serif display face as the rest of the site for headings:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

// Each section renders, in order: paragraphs -> intro line -> bullet list -> footer line
const sections = [
  {
    heading: "About Our Services",
    paragraphs: [
      "Chettinad Handicrafts specializes in handcrafted wood works, original granite stone works, traditional Tanjore paintings, painting restoration, custom furniture, architectural elements, and bespoke heritage-inspired creations.",
      "The information provided on this website is intended for general informational purposes. We reserve the right to modify, update, or discontinue any product, service, or website content without prior notice.",
    ],
  },
  {
    heading: "Custom Orders & Quotations",
    paragraphs: [
      "Every project we undertake is unique.",
      "All quotations are prepared based on the information provided by the customer and may change after design discussions, site visits, material selection, measurements, or project requirements are finalized.",
      "Production will begin only after order confirmation and receipt of the agreed advance payment.",
    ],
  },
  {
    heading: "Customer Responsibilities",
    paragraphs: [
      "Customers are requested to provide accurate measurements, design references, photographs, project specifications, and other relevant information.",
      "Chettinad Handicrafts shall not be responsible for delays, revisions, or additional costs arising from incomplete or inaccurate information provided by the customer.",
    ],
  },
  {
    heading: "Handcrafted Products",
    paragraphs: ["Every product is handcrafted by skilled artisans using natural materials."],
    intro: "As a result, slight variations in:",
    list: ["Wood grain", "Stone texture", "Natural colour", "Hand carvings", "Dimensions", "Surface finish"],
    footer:
      "may occur. These variations are natural characteristics of handcrafted products and should not be considered manufacturing defects.",
  },
  {
    heading: "Materials",
    paragraphs: [
      "We use premium-quality wood and original granite stone for our handcrafted creations.",
      "Since natural materials vary in colour, grain, and texture, each finished product will have its own unique appearance.",
    ],
  },
  {
    heading: "Design Ownership",
    paragraphs: [
      "All photographs, videos, logos, product designs, content, artwork, graphics, and website materials are the intellectual property of Chettinad Handicrafts unless otherwise stated.",
      "No content from this website may be copied, reproduced, modified, distributed, or used for commercial purposes without prior written permission.",
    ],
  },
  {
    heading: "Customer Design Files",
    paragraphs: [
      "Reference images, sketches, architectural drawings, or custom designs submitted by customers remain their property.",
      "By submitting these materials, customers authorize Chettinad Handicrafts to use them solely for quotation preparation, design consultation, production planning, and project execution.",
    ],
  },
  {
    heading: "Payments",
    paragraphs: [
      "Payment terms will be communicated during the quotation process.",
      "Production work will commence only after receiving the agreed advance payment.",
      "Any delay in payment may result in revised delivery schedules or temporary suspension of production until payment is received.",
    ],
  },
  {
    heading: "Delivery",
    intro: "Delivery timelines are estimates and may vary depending on:",
    list: [
      "Project complexity",
      "Material availability",
      "Customization requirements",
      "Transportation",
      "Weather conditions",
      "Other unforeseen circumstances",
    ],
    footer:
      "While we make every effort to deliver projects on time, Chettinad Handicrafts shall not be held responsible for delays beyond our reasonable control.",
  },
  {
    heading: "Third-Party Links",
    paragraphs: [
      "Our website may contain links to third-party platforms such as WhatsApp, Google Maps, Facebook, Instagram, YouTube, or other external websites.",
      "We are not responsible for the content, privacy practices, or policies of these third-party platforms.",
    ],
  },
  {
    heading: "Limitation of Liability",
    paragraphs: [
      "Chettinad Handicrafts shall not be liable for any indirect, incidental, consequential, or special damages resulting from the use of this website, reliance on its content, or engagement with our products or services, to the maximum extent permitted by applicable law.",
    ],
  },
  {
    heading: "Changes to These Terms",
    paragraphs: [
      "We reserve the right to modify or update these Terms & Conditions at any time without prior notice.",
      "Any revisions will be published on this page. Continued use of the website after such updates constitutes acceptance of the revised Terms & Conditions.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      "If you have any questions regarding these Terms & Conditions, our products, or our services, please contact us using the information available on our Contact Us page.",
      "We appreciate your trust in Chettinad Handicrafts and look forward to creating timeless handcrafted masterpieces for your space.",
    ],
  },
];

// Optimized animation variants for mobile
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 15 
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function TermsAndConditions({ lastUpdated = "[DD Month YYYY]" }) {
  return (
    <section className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.05 }}
          variants={containerVariants}
          className="rounded-2xl border border-[#E29C15] bg-[#F5E6CA] px-6 sm:px-10 lg:px-14 py-10 sm:py-14 text-left"
        >
          <motion.h1 variants={itemVariants} className="font-serif text-3xl sm:text-4xl text-[#5B2D07]">
            Terms &amp; Conditions
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-2 text-sm font-semibold text-[#E29C15]">
            Last Updated: {lastUpdated}
          </motion.p>

          <motion.p variants={itemVariants} className="mt-6 text-sm sm:text-base text-[#2A190C] leading-relaxed">
            Welcome to Chettinad Handi crafts. By accessing and using this website, you agree to
            comply with these Terms &amp; Conditions. Please read them carefully before using our
            website or requesting our products and services.
          </motion.p>

          {sections.map((section) => (
            <motion.div 
              key={section.heading} 
              variants={itemVariants}
              className="mt-8"
            >
              <h2 className="font-serif text-lg sm:text-xl text-[#5B2D07] mb-2">
                {section.heading}
              </h2>

              {section.paragraphs?.map((para, i) => (
                <p
                  key={i}
                  className="text-sm sm:text-base text-[#2A190C] leading-relaxed mt-2 first:mt-0"
                >
                  {para}
                </p>
              ))}

              {section.intro && (
                <p className="text-sm sm:text-base text-[#2A190C] leading-relaxed mt-3">
                  {section.intro}
                </p>
              )}

              {section.list && (
                <ul className="mt-2 space-y-1.5 list-disc pl-5">
                  {section.list.map((item) => (
                    <li
                      key={item}
                      className="text-sm sm:text-base text-[#2A190C] leading-relaxed"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-sm sm:text-base text-[#2A190C] leading-relaxed mt-3">
                  {section.footer}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}