import React, { useRef, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ChevronRight, ShieldCheck } from "lucide-react";
import api from "../../common/apiClient";
import summaryApi from "../../common/SummaryApi";

// NOTE: This section uses a serif display face for headings.
// Add to tailwind.config.js:
//   theme.extend.fontFamily.serif = ['"Playfair Display"', "serif"]
// and import the font (e.g. in index.html or index.css):
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

const leftVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const rightVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut", delay: 0.1 } },
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// Must exactly match the Mongoose enum: ["Phone", "Email", "WhatsApp"]
const contactMethods = ["Phone", "Email", "WhatsApp"];

// Default contact info cards — used only if no `infoCards` prop is passed.
const defaultInfoCards = [
  {
    icon: MapPin,
    iconBg: "bg-[#0B1A35]",
    title: "Visit Our Showroom",
    lines: [
      "No. 7, Old Municipal Street,",
      "Idayar Street, Karaikudi,",
      "Sivagangai District, Tamil Nadu, India 630001."
    ],
  },
  {
    icon: Phone,
    iconBg: "bg-[#E29C15]",
    title: "Call Us",
    lines: ["+91 70107 39928"],
    type: "phone",
    value: "+917010739928",
  },
  {
    icon: Mail,
    iconBg: "bg-[#0B1A35]",
    title: "Email Us",
    lines: ["chettinadhandicrafts07@gmail.com"],
    type: "email",
    value: "chettinadhandicrafts07@gmail.com",
  },
  {
    icon: Clock,
    iconBg: "bg-[#E29C15]",
    title: "Business Hours",
    lines: ["Mon - Sat 9:00 AM - 6:30 PM", "Sunday : Closed"],
  },
];

// Small reusable labeled field, matching the enquiry form design
function Field({ label, required, children }) {
  return (
    <div>
      <label className="block font-serif text-sm sm:text-base text-[#5B2D07] mb-1.5">
        {label}
        {required && <span className="text-[#E29C15] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClasses =
  "w-full rounded-lg border border-[#E29C15] bg-[#F7F2E8] px-4 py-3 text-sm text-[#2A190C] placeholder:text-[#2A190C]/50 focus:outline-none focus:ring-2 focus:ring-[#E29C15]";

/**
 * Contact/Enquiry form + "We Are Here To Help" info panel.
 *
 * Props:
 * - formHeading, formDescription: strings for the left column copy
 * - infoEyebrow, infoHeading: strings for the right column copy
 * - infoCards: Array<{ icon, iconBg, title, lines: string[], type?: string, value?: string }>
 * - onSubmit: (formData) => void   called after a successful save
 */
export default function EnquiryForm({
  formHeading = "Send Us Your Enquiry",
  formDescription = "Please provide your details below and we will get back to you shortly.",
  infoEyebrow = "Get in Touch",
  infoHeading = "We're Here to Bring Your Vision to Life",
  infoCards = defaultInfoCards,
  onSubmit,
}) {
  const location = useLocation();
  const formSectionRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    cityState: "",
    contactMethod: "",
    subject: location.state?.subject || "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const leftRef = useRef(null);
  const leftInView = useInView(leftRef, { once: true, amount: 0.1 });

  const rightRef = useRef(null);
  const rightInView = useInView(rightRef, { once: true, amount: 0.1 });

  // If a subject arrives via navigation state (even after this page is already mounted),
  // update the field and scroll the form into view.
  useEffect(() => {
    if (location.state?.subject) {
      setFormData((prev) => ({ ...prev, subject: location.state.subject }));
    }
    if (location.hash === "#enquiry-form" || location.state?.subject) {
      formSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state, location.hash]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage("");

    try {
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phone,
        emailAddress: formData.email,
        cityState: formData.cityState,
        preferredContactMethod: formData.contactMethod,
        subject: formData.subject,
        enquiryMessage: formData.message,
      };

      await api({
        url: summaryApi.createEnquiry.url,
        method: summaryApi.createEnquiry.method,
        data: payload,
      });

      setSubmitStatus("success");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        cityState: "",
        contactMethod: "",
        subject: "",
        message: "",
      });
      onSubmit?.(formData);
    } catch (err) {
      console.error("Failed to submit enquiry:", err);
      setErrorMessage(err?.response?.data?.message || "Something went wrong. Please try again.");
      setSubmitStatus("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleContactClick = (type, value) => {
    if (type === "phone") {
      window.location.href = `tel:${value}`;
    } else if (type === "email") {
      window.location.href = `mailto:${value}`;
    }
  };

  return (
    <section id="enquiry-form" ref={formSectionRef} className="w-full bg-[#F7F2E8] py-16">
      <div className="max-w-[1500px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1220px] 2xl:max-w-[1500px] mx-auto px-6 sm:px-10 lg:px-4 xl:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: enquiry form */}
          <motion.div
            ref={leftRef}
            initial="hidden"
            animate={leftInView ? "visible" : "hidden"}
            variants={leftVariants}
            className="text-left"
          >
            <h2 className="font-serif text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-regular text-[#5B2D07] leading-tight">
              {formHeading}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#2A190C]">
              {formDescription}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${inputClasses} disabled:opacity-60`}
                  />
                </Field>

                <Field label="Phone Number" required>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${inputClasses} disabled:opacity-60`}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Email Address" required>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${inputClasses} disabled:opacity-60`}
                  />
                </Field>

                <Field label="City / State" required>
                  <input
                    type="text"
                    name="cityState"
                    required
                    placeholder="Enter your city / state"
                    value={formData.cityState}
                    onChange={handleChange}
                    disabled={submitting}
                    className={`${inputClasses} disabled:opacity-60`}
                  />
                </Field>
              </div>

              <Field label="Preferred Contact Method" required>
                <select
                  name="contactMethod"
                  required
                  value={formData.contactMethod}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`${inputClasses} appearance-none disabled:opacity-60`}
                >
                  <option value="" disabled>
                    Select an option
                  </option>
                  {contactMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Subject" required>
                <input
                  type="text"
                  name="subject"
                  required
                  placeholder="Enter the subject of your enquiry"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`${inputClasses} disabled:opacity-60`}
                />
              </Field>

              <Field label="Your Enquiry / Message" required>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="Please tell us your requirements or questions in details..."
                  value={formData.message}
                  onChange={handleChange}
                  disabled={submitting}
                  className={`${inputClasses} resize-none disabled:opacity-60`}
                />
              </Field>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-[#E29C15] hover:bg-[#C98B24] transition-colors px-6 py-3.5 text-sm font-semibold text-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Enquiry"}
                {!submitting && <ChevronRight className="w-4 h-4" />}
              </button>

              {submitStatus === "success" && (
                <p className="text-sm text-green-700">
                  Thank you! Your enquiry has been submitted — we'll get back to you shortly.
                </p>
              )}
              {submitStatus === "error" && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              <p className="flex items-center gap-2 text-xs sm:text-sm text-[#2A190C]">
                <ShieldCheck className="w-4 h-4 text-[#E29C15] flex-shrink-0" />
                We respect your privacy. Your information is safe with us.
              </p>
            </form>
          </motion.div>

          {/* Right: info cards */}
          <motion.div
            ref={rightRef}
            initial="hidden"
            animate={rightInView ? "visible" : "hidden"}
            variants={rightVariants}
            className="text-left"
          >
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#E29C15]">
              {infoEyebrow}
            </span>
            <h2 className="mt-2 font-serif text-3xl sm:text-3xl md:text-4xl lg:text-5xl font-regular text-[#5B2D07]">
              {infoHeading}
            </h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={rightInView ? "visible" : "hidden"}
              className="mt-6 space-y-4"
            >
              {infoCards.map((card, i) => {
                const Icon = card.icon;
                const isClickable = card.type === "phone" || card.type === "email";

                return (
                  <motion.div
                    key={card.title + i}
                    variants={cardVariants}
                    className={`flex items-start gap-4 rounded border border-[#E29C15] bg-[#F7F2E8] px-5 py-4 ${
                      isClickable ? "cursor-pointer hover:bg-[#F0E8D8] transition-colors" : ""
                    }`}
                    onClick={() => isClickable && handleContactClick(card.type, card.value)}
                  >
                    <span
                      className={`flex items-center justify-center w-11 h-11 rounded-full text-white flex-shrink-0 ${card.iconBg}`}
                    >
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-serif text-sm sm:text-base font-regular text-[#5B2D07]">
                        {card.title}
                      </p>
                      {card.lines.map((line, li) => (
                        <p
                          key={li}
                          className={`text-xs sm:text-sm ${
                            isClickable
                              ? "text-[#0B1A35] hover:text-[#E29C15] transition-colors underline decoration-[#E29C15]/30 hover:decoration-[#E29C15] underline-offset-2"
                              : "text-[#2A190C]"
                          }`}
                        >
                          {line}
                        </p>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}