import React, { useState, useEffect } from 'react';
import { gsap } from 'gsap';

const testimonials = [
  {
    id: 1,
    name: 'Анна Смирнова',
    role: 'Backend разработчик в Яндекс',
    text: 'Курс по алгоритмам дал мне фундамент, который помог пройти сложные технические собеседования. Теперь работаю над высоконагруженными системами!',
    avatar: '',
    company: 'Яндекс'
  },
  {
    id: 2,
    name: 'Иван Петров',
    role: '3D-дизайнер в Playrix',
    text: 'После курса по Blender собрал портфолио, которое впечатлило рекрутеров Playrix. Теперь создаю окружение для мобильных игр с многомиллионной аудиторией.',
    avatar: '',
    company: 'Playrix'
  },
  {
    id: 3,
    name: 'Елена Ковалева',
    role: 'Data Scientist в Сбербанк',
    text: 'Курс по машинному обучению научил не только теории, но и практическому применению моделей. Через 3 месяца после окончания получила оффер от Сбера.',
    avatar: '',
    company: 'Сбербанк'
  }
];

const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = React.useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      gsap.to(carouselRef.current.children, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        stagger: 0.1,
        onComplete: () => {
          gsap.to(carouselRef.current.children, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1
          });
        }
      });
    }
  }, [currentIndex]);

  const testimonial = testimonials[currentIndex];

  return (
    <div className="testimonial-carousel" ref={carouselRef}>
      <div className="testimonial-content">
        <div className="testimonial-text">
          <div className="quote-icon">“</div>
          <p>{testimonial.text}</p>
        </div>
        <div className="testimonial-author">
          <div className="author-info">
            <h3 className="author-name">{testimonial.name}</h3>
            <p className="author-role">{testimonial.role}</p>
          </div>
          <div className="company-logo">
            {testimonial.company}
          </div>
        </div>
      </div>
      <div className="carousel-indicators">
        {testimonials.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel;