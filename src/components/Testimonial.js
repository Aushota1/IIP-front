import React from 'react';
import './Testimonial.css';

const Testimonial = ({ name, role, text, avatar }) => {
  return (
    <div className="testimonial">
      <div className="testimonial-text">
        <p>"{text}"</p>
      </div>
      <div className="testimonial-author">
        <div className="author-avatar">
          <img src={avatar} alt={name} />
        </div>
        <div className="author-info">
          <h4>{name}</h4>
          <span>{role}</span>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;