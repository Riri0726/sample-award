import React, { useState, useEffect } from 'react';
import AwardViewer from './components/AwardViewer';
import AwardCarousel from './components/AwardCarousel';
import './App.css';

function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [autoRotateInterval, setAutoRotateInterval] = useState(4000); // 4 seconds
  
  // Award data - angles will be calculated automatically
  const awardData = [
    {
      id: 0,
      title: "Exemplary Children's Programs and Services",
      description: "Recognizing outstanding commitment to community service and public engagement."
    },
    {
      id: 1,
      title: "Awardee of the 2024 Gawad Pampublikong Aklatan of the National Library of the Philippines",
      description: "For pioneering digital library services and technological advancement."
    },
    {
      id: 2,
      title: "Awardee of the 2023 Gawad Pampublikong Aklatan of the National Library of the Philippines",
      description: "Outstanding efforts in community education and literacy programs."
    },
    {
      id: 3,
      title: "Library Excellence Award",
      description: "Exceptional library management and user satisfaction."
    },
    {
      id: 4,
      title: "Cultural Heritage Preservation",
      description: "Dedication to preserving and promoting local cultural heritage."
    }
  ];

  // Calculate angles automatically based on number of awards
  const awards = awardData.map((award, index) => ({
    ...award,
    angle: (index / awardData.length) * Math.PI * 2
  }));

  // Auto-rotation effect
  useEffect(() => {
    if (!isAutoRotating) return;

    const interval = setInterval(() => {
      setCurrentSlide(prevSlide => {
        const nextSlide = (prevSlide + 1) % awards.length;
        return nextSlide;
      });
    }, autoRotateInterval);

    return () => clearInterval(interval);
  }, [isAutoRotating, autoRotateInterval, awards.length]);

  // Pause auto-rotation when user interacts
  const handleSlideChange = (newSlide) => {
    setCurrentSlide(newSlide);
    setIsAutoRotating(false);
    
    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => {
      setIsAutoRotating(true);
    }, 10000);
  };

  return (
    <div className="app">
    
      
      <div className="main-container">
        {/* Left panel: 3D Trophy */}
        <div className="trophy-container">
          <AwardViewer 
            currentSlide={currentSlide}
            currentAward={awards[currentSlide]}
          />
        </div>
        
        {/* Right panel: Award Content */}
        <div className="content-container">
          <h1>VALENZUELA CITY LIBRARY</h1>
        <h2>AWARDS & RECOGNITION</h2>
        <p>The Valenzuela City Library (ValACE) extends its heartfelt gratitude for the awards and recognition it has received. These honors inspire us to continue our commitment to excellence in public service and lifelong learning.</p>
          <AwardCarousel
            awards={awards}
            currentSlide={currentSlide}
            onSlideChange={handleSlideChange}
            isAutoRotating={isAutoRotating}
            onToggleAutoRotation={() => setIsAutoRotating(!isAutoRotating)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
