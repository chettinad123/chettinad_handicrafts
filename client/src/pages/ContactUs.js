import React from 'react'
import ContactHero from '../components/ContactUsComponents/ContactHero';
import ContactForm from '../components/ContactUsComponents/ContactForm';
import OurLocation from '../components/ContactUsComponents/OurLocation';
import ServicesCTA from '../components/ServicesComponents/ServicesCTA';
import StatsCard from '../components/ContactUsComponents/StatsCard';

const ContactUs = () => {
  return (
    <div>
      <ContactHero />
      <ContactForm />
      <StatsCard />
      <OurLocation />
      <ServicesCTA 
      title="Have a Custom Project in Mind?"
      description="Share your vision, and let's craft something timeless."
      backgroundColor="bg-[#F7F2E8]" />
    </div>
  )
}

export default ContactUs
