import React from 'react'
import GalleryHero from '../components/GalleryComponents/GalleryHero';
import OurWorks from '../components/GalleryComponents/OurWorks';
import HaveProjectCard from '../components/GalleryComponents/HaveProjectCard';
import FeaturedProject from '../components/GalleryComponents/FeaturedProject';
import ServicesCTA from '../components/ServicesComponents/ServicesCTA';

const Gallery = () => {
  return (
    <div>
      {/* <h1>Gallery page</h1> */}
      <GalleryHero />
      <OurWorks />
      <HaveProjectCard />
      <FeaturedProject />
      <ServicesCTA
       title="Stay Inspired"
       description="Experience the beauty of authentic Chettinad craftsmanship in every creation."
       backgroundColor="bg-[#F7F2E8]" />
    </div>
  )
}

export default Gallery
