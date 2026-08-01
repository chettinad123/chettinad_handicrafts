import React from "react";
import ServicesHero from "../components/ServicesComponents/ServicesHero";
import OurServices from "../components/ServicesComponents/OurServices";
import ServicesCTA from "../components/ServicesComponents/ServicesCTA";
import WhyChoose from "../components/HomeComponents/WhyChoose";
import { Award, Gem, Ruler, Truck, Users } from "lucide-react";

const servicesWhyChooseItems = [
  {
    icon: Award,
    title: "40+ Years Experience",
    desc: "Preserving the legacy of Chettinad craftsmanship since 1986 with decades of expertise.",
  },
  {
    icon: Users,
    title: "Skilled Artisans",
    desc: "Every creation is handcrafted by experienced artisans using time-honoured techniques.",
  },
  {
    icon: Gem,
    title: "Premium Materials",
    desc: "We use original granite stone and carefully selected premium-quality wood for every project.",
  },
  {
    icon: Ruler,
    title: "100% Custom-Made",
    desc: "Every design is tailored to your requirements, ensuring a truly unique creation.",
  },
  {
    icon: Truck,
    title: "Pan India Service",
    desc: "Serving homes, villas, temples, and commercial projects across India with reliable delivery and support.",
  },
];

const Services = () => {
  return (
    <div>
      <ServicesHero />
      <OurServices />
      <WhyChoose
        eyebrow="Why Choose Us"
        heading="Quality. Trust. Tradition."
        items={servicesWhyChooseItems}
      />
      <ServicesCTA />
    </div>
  );
};

export default Services;
