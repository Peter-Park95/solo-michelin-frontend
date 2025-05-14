// StarRating.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fullStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import './StarRating.css';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);

  const getStarIcon = (index) => {
    const score = hover || rating;
    if (score >= index + 1) return fullStar;
    if (score >= index + 0.5) return faStarHalfAlt;
    return fullStar;
  };

  const getColor = (index) => {
    const score = hover || rating;
    return score >= index + 0.5 ? 'gold' : '#ccc';
  };

  const handleClick = (e, index) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const clickedValue = x < width / 2 ? index + 0.5 : index + 1;
    setRating(clickedValue);
  };

  return (
    <div className="star-rating-container">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="star-icon-wrapper"
          onClick={(e) => handleClick(e, index)}
          onMouseMove={(e) => handleClick(e, index)}
          onMouseLeave={() => setHover(0)}
        >
          <FontAwesomeIcon
            icon={getStarIcon(index)}
            color={getColor(index)}
            size="lg"
          />
        </div>
      ))}
      <span className="rating-value">{(hover || rating).toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
