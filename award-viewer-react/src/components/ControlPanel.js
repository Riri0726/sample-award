import React, { useEffect } from 'react';
import './ControlPanel.css';

function ControlPanel({
  currentSlide,
  totalSlides,
  isAutoRotating,
  onSlideChange,
  onPrevious,
  onNext,
  onAutoRotateToggle
}) {
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && currentSlide > 0) {
        onPrevious();
      } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
        onNext();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, totalSlides, onPrevious, onNext]);
  
  return (
    <div className="controls-panel">
      <h2>Award Viewer</h2>
      
      <div className="control-group">
        <label htmlFor="angle-slider">View Angle:</label>
        <input
          type="range"
          id="angle-slider"
          min="0"
          max={totalSlides - 1}
          value={currentSlide}
          step="1"
          onChange={(e) => onSlideChange(parseInt(e.target.value))}
          aria-label="Award rotation angle"
        />
        <div className="slide-indicator">
          Slide {currentSlide + 1} of {totalSlides}
        </div>
      </div>
      
      <div className="control-group">
        <button 
          onClick={onPrevious}
          disabled={currentSlide === 0}
          aria-label="Previous angle"
        >
          ← Previous
        </button>
        <button 
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          aria-label="Next angle"
        >
          Next →
        </button>
      </div>
      
      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={isAutoRotating}
            onChange={(e) => onAutoRotateToggle(e.target.checked)}
          />
          Auto-rotate
        </label>
      </div>
      
      <div className="info">
        <p>Use the slider or arrow keys to rotate the award.</p>
        <p><strong>Controls:</strong></p>
        <ul>
          <li>Mouse: Orbit camera</li>
          <li>Wheel: Zoom</li>
          <li>← → keys: Previous/Next slide</li>
        </ul>
      </div>
    </div>
  );
}

export default ControlPanel;
