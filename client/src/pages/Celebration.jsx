import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';

const Celebration = ({ name, points, onClose }) => {
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);

    // Automatically close the overlay after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 30000);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer); // Clear timer on component unmount
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90"
      style={{ fontFamily: 'Arial, sans-serif', zIndex: 9999 }} // High custom z-index to ensure it's above all
    >
      <Confetti width={dimensions.width} height={dimensions.height} />
      <h1 className="font-bold" style={{ fontSize: '2.5em', color: '#ffc400' }}>Congratulations {name}!</h1>
      <p style={{ fontSize: '1.5em', color: 'white' }}>The Employee of the Week with {points} points! 🎉</p>
      
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          padding: '10px 20px',
          fontSize: '1em',
          cursor: 'pointer',
          marginTop: '20px',
          backgroundColor: '#ffc400',
          color: 'black',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        Close
      </button>
    </div>
  );
};

export default Celebration;
