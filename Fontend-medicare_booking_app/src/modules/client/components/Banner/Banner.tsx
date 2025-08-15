import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Banner.css";

// Define the type for a single slide object
interface SlideItem {
  id: number;
  img: string;
}

// Define the main App component
const Banner = () => {
  const slides: SlideItem[] = [
    {
      id: 1,
      img: "/src/assets/Banner/doctor-banner-1.jpg",
    },
    {
      id: 2,
      img: "/src/assets/Banner/doctor-banner-2.jpg",
    },
    {
      id: 3,
      img: "/src/assets/Banner/doctor-banner-3.jpg",
    },
  ];

  const AUTOCHANGE_TIME = 4000;
  const [activeSlide, setActiveSlide] = useState(0);

  // useEffect to handle the auto-change timer
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, AUTOCHANGE_TIME);

    // Clean up timer on component unmount
    return () => clearInterval(timer);
  }, [slides.length]);

  // Function to change slides manually
  const changeSlides = (change: number) => {
    setActiveSlide(
      (currentSlide) => (currentSlide + change + slides.length) % slides.length
    );
  };

  return (
    <>
      <div className="banner-container relative w-full h-[40vh] sm:h-[45vh] md:h-[50vh] lg:h-[55vh] xl:h-[60vh] overflow-hidden text-white font-inter mt-16 z-10">
        {/* Slides Container */}
        <div className="relative h-full w-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out slide-${index} ${
                activeSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {/* Background Image with animated overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={slide.img}
                  alt={slide.id.toString()}
                  className={`object-cover w-full h-full transition-transform duration-[1000ms] ease-in-out hover:scale-[1.02] ${
                    activeSlide === index ? "scale-105" : "scale-100"
                  }`}
                />
              </div>
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>

              {/* Slide Content */}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="absolute top-1/2 -translate-y-1/2 left-2 sm:left-4 md:left-8 lg:left-12 z-30">
          <button
            onClick={() => changeSlides(-1)}
            className="p-2 sm:p-3 bg-white/30 hover:bg-white/50 transition-colors duration-300 rounded-full"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
          </button>
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-2 sm:right-4 md:right-8 lg:right-12 z-30">
          <button
            onClick={() => changeSlides(1)}
            className="p-2 sm:p-3 bg-white/30 hover:bg-white/50 transition-colors duration-300 rounded-full"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Banner;
