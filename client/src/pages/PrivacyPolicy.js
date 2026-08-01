import React from "react";
import { motion } from "framer-motion";

// NOTE: Uses the same serif display face as the rest of the site for headings:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

// Each section renders, in order: paragraphs -> intro line -> bullet list -> footer line
const sections = [
  {
    heading: "Information We Collect",
    paragraphs: [
      "When you submit an enquiry, request a quotation, contact us, or place a custom order through our website, we may collect personal information including your name, phone number, email address, location, project requirements, and any additional details you voluntarily provide.",
      "If you upload reference images, architectural drawings, sketches, or design inspirations for custom wood works, original granite stone works, furniture, or Tanjore paintings, those files will be collected solely for project consultation and execution.",
    ],
  },
  {
    heading: "How We Use Your Information",
    intro: "The information we collect is used to:",
    list: [
      "Respond to your enquiries and quotation requests.",
      "Understand your project requirements.",
      "Provide customized solutions and recommendations.",
      "Process and manage custom orders.",
      "Communicate project updates and delivery information.",
      "Improve our website, products, and customer experience.",
      "Maintain internal business records and customer support.",
    ],
  },
  {
    heading: "Information Sharing",
    paragraphs: [
      "Chettinad Handicrafts respects the confidentiality of your personal information.",
      "We do not sell, rent, trade, or share your personal information with third parties for marketing purposes.",
    ],
    intro: "Your information may only be shared when:",
    list: [
      "Required by applicable laws or legal authorities.",
      "Necessary to protect our legal rights or business interests.",
      "Required to facilitate delivery, logistics, or other business operations related to your order.",
    ],
  },
  {
    heading: "Customer Designs & Uploaded Files",
    paragraphs: [
      "We understand the importance of originality and confidentiality.",
      "Any reference images, architectural drawings, custom designs, or project files submitted through our website remain confidential and are used only for project evaluation, quotation preparation, communication, and execution.",
      "We will never reproduce, publish, or share your submitted materials without your prior consent.",
    ],
  },
  {
    heading: "Cookies",
    paragraphs: [
      "Our website may use cookies and similar technologies to improve functionality and analyze visitor interactions.",
    ],
    intro: "Cookies help us:",
    list: [
      "Improve website performance.",
      "Understand visitor behaviour.",
      "Enhance user experience.",
      "Monitor website traffic and performance.",
    ],
    footer:
      "You may disable cookies through your browser settings; however, certain features of the website may function differently.",
  },
  {
    heading: "Data Security",
    paragraphs: [
      "We implement reasonable administrative, technical, and security measures to protect your personal information from unauthorized access, misuse, loss, or disclosure.",
      "While we strive to maintain secure systems, no method of internet transmission or electronic storage is completely secure. Therefore, users acknowledge that sharing information online carries certain inherent risks.",
    ],
  },
  {
    heading: "Third-Party Links",
    intro: "Our website may contain links to third-party platforms including:",
    list: ["WhatsApp", "Google Maps", "Facebook", "Instagram", "YouTube"],
    footer:
      "These websites operate under their own privacy policies. Once you leave our website, Chettinad Handicrafts is not responsible for the privacy practices or content of third-party platforms.",
  },
  {
    heading: "Your Rights",
    intro: "You may request to:",
    list: [
      "Access the personal information you have shared with us.",
      "Correct inaccurate or outdated information.",
      "Request deletion of your personal data where legally applicable.",
      "Withdraw your enquiry information, subject to applicable business and legal requirements.",
    ],
    footer: "Requests may be submitted through the contact details available on our Contact Us page.",
  },
  {
    heading: "Changes to this Privacy Policy",
    paragraphs: [
      "Chettinad Handicrafts reserves the right to update or modify this Privacy Policy at any time to reflect changes in our services, business practices, legal requirements, or website functionality.",
      "Any changes will be published on this page. Continued use of our website after updates constitutes acceptance of the revised Privacy Policy.",
    ],
  },
  {
    heading: "Contact Us",
    paragraphs: [
      "If you have any questions regarding this Privacy Policy or how your personal information is handled, please contact us using the details provided on our Contact Us page.",
      "We are committed to protecting your privacy and responding to all privacy-related enquiries responsibly and promptly.",
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

export default function PrivacyPolicy({ lastUpdated = "[DD Month YYYY]" }) {
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
            Privacy Policy
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-2 text-sm font-medium text-[#E29C15]">
            Last Updated: {lastUpdated}
          </motion.p>

          <motion.p variants={itemVariants} className="mt-6 text-sm sm:text-base text-[#2A190C] leading-relaxed">
            At Chettinad Handi crafts, we value your privacy and are committed to protecting the
            personal information you share with us. This Privacy Policy explains how we collect,
            use, store, and safeguard your information when you visit our website or interact
            with our services. By accessing and using our website, you agree to the terms
            outlined in this Privacy Policy.
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