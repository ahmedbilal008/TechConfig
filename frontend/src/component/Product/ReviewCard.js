import { Rating } from "@material-ui/lab";
import React from "react";
import profilePng from "../../images/Profile.png";

const ReviewCard = ({ review }) => {
  const options = {
    value: review.rating,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div className="reviewCard">
      <img src={profilePng} alt="User" />
      <p>{new Date(review.reviewdate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
      <Rating {...options} />
      <span className="reviewCardComment">{review.reviewtext}</span>
    </div>
  );
};

export default ReviewCard;
//ProductID, UserID, Rating, ReviewText, ReviewDate