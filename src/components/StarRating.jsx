import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fullStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import './StarRating.css';

const StarRating = ({ rating, setRating }) => {
  const [hover, setHover] = useState(0);
  const [isClicked, setIsClicked] = useState(false);

  const getStarIcon = (index) => {
    const score = isClicked ? rating : hover;
    if (score >= index + 1) return fullStar;
    if (score >= index + 0.5) return faStarHalfAlt;
    return fullStar;
  };

  const getColor = (index) => {
    const score = isClicked ? rating : hover;
    return score >= index + 0.5 ? 'gold' : '#ccc';
  };

  const handleClick = (e, index) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const clickedValue = x < width / 2 ? index + 0.5 : index + 1;
    setRating(clickedValue);
    setIsClicked(true);
  };

  const handleMouseMove = (e, index) => {
    if (isClicked) return;
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - left;
    const hoverValue = x < width / 2 ? index + 0.5 : index + 1;
    setHover(hoverValue);
  };

  const handleMouseLeave = () => {
    if (!isClicked) setHover(0);
  };

  return (
    <div className="star-rating-container">
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className="star-icon-wrapper"
          onClick={(e) => handleClick(e, index)}
          onMouseMove={(e) => handleMouseMove(e, index)}
          onMouseLeave={handleMouseLeave}
        >
          <FontAwesomeIcon
            icon={getStarIcon(index)}
            color={getColor(index)}
            size="lg"
          />
        </div>
      ))}
      <span className="rating-value">{(isClicked ? rating : hover).toFixed(1)}</span>
    </div>
  );
};

export default StarRating;
