import React from "react";
import Header from "../components/customer/Header.jsx";
import Footer from "../components/customer/Footer.jsx";
import HeroSection from "../components/customer/sections/HeroSection.jsx";
import AboutSection from "../components/customer/sections/AboutSection.jsx";
import TestimonialSection from "../components/customer/sections/TestimonialSection.jsx";
import RoomsSection from "../components/customer/sections/RoomsSection.jsx";
import ReservationSection from "../components/customer/sections/ReservationSection.jsx";
import FacilitiesSection from "../components/customer/sections/FacilitiesSection.jsx";
import VideoSection from "../components/customer/sections/VideoSection.jsx";
import GallerySection from "../components/customer/sections/GallerySection.jsx";

export default function HomePage() {
  return (
    <div id="wrapper">
      <a href="#top" id="back-to-top" aria-label="Back to top" />
      <div id="de-loader" aria-hidden="true" />
      <Header />
      <div id="content" className="no-bottom no-top">
        <div id="top" />
        <HeroSection />
        <AboutSection />
        <TestimonialSection />
        <RoomsSection />
        <ReservationSection />
        <FacilitiesSection />
        <VideoSection />
        <GallerySection />
      </div>
      <Footer />
    </div>
  );
}
