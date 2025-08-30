import React from 'react';
import './AwardCarousel.css';

function AwardCarousel({ awards, currentSlide, onSlideChange, isAutoRotating, onToggleAutoRotation }) {
  
  const handlePrevious = () => {
    if (currentSlide > 0) {
      onSlideChange(currentSlide - 1);
    } else {
      // Loop to last slide
      onSlideChange(awards.length - 1);
    }
  };
  
  const handleNext = () => {
    if (currentSlide < awards.length - 1) {
      onSlideChange(currentSlide + 1);
    } else {
      // Loop to first slide
      onSlideChange(0);
    }
  };
  
  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, awards.length]);
  
  return (
    <div className="award-content">
      {/* Navigation arrows */}
      <button 
        className="nav-arrow nav-arrow-left"
        onClick={handlePrevious}
        aria-label="Previous award"
      >
        ‹
      </button>
      
      <button 
        className="nav-arrow nav-arrow-right"
        onClick={handleNext}
        aria-label="Next award"
      >
        ›
      </button>
      
      {/* Main content area - centered */}
      <div className="content-main">
        <div className="award-title-centered">
          {awards[currentSlide].title}
        </div>
      </div>
      
      {/* Bottom navigation dots */}
      <div className="carousel-dots">
        {awards.map((_, index) => (
          <button
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => onSlideChange(index)}
            aria-label={`Go to award ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Auto-rotation control */}
      <div className="auto-rotation-control">
        <button 
          className={`auto-btn ${isAutoRotating ? 'active' : ''}`}
          onClick={onToggleAutoRotation}
          aria-label={isAutoRotating ? 'Pause auto-rotation' : 'Start auto-rotation'}
        >
          {isAutoRotating ? '⏸️' : '▶️'} {isAutoRotating ? 'Auto' : 'Manual'}
        </button>
      </div>
    </div>
  );
}

export default AwardCarousel;
