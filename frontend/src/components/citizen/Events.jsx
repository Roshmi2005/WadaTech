import React, { useRef } from "react";
import "../../styles/events.css";

const eventCategories = [
  {
    title: "Upcoming Events",
    description: "Events scheduled soon that you can register or plan for.",
    items: ["Ward Health Camp - Sept 5", "Tax Awareness Session - Sept 12"],
  },
  {
    title: "Ongoing Events",
    description: "Events currently running in your ward office.",
    items: ["Citizenship Renewal Drive", "Digital Literacy Workshop"],
  },
  {
    title: "Future Events",
    description: "Planned events for the upcoming months.",
    items: ["Annual Ward Sports Meet", "Community Cleanliness Drive"],
  },
];

const Events = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 320, behavior: "smooth" });
    }
  };

  return (
    <section id="events" className="events-section">
      <p className="events-eyebrow">STAY INVOLVED</p>
      <h2 className="events-heading">Events</h2>

      <div className="events-carousel-wrap">
        <button className="events-arrow" onClick={() => scroll(-1)}>
          &#8249;
        </button>

        <div className="events-carousel" ref={scrollRef}>
          {eventCategories.map((category) => (
            <div className="event-card" key={category.title}>
              <h3>{category.title}</h3>
              <p className="event-card-desc">{category.description}</p>
              <ul className="event-card-list">
                {category.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <a href="#events" className="event-card-link">
                View All &rarr;
              </a>
            </div>
          ))}
        </div>

        <button className="events-arrow" onClick={() => scroll(1)}>
          &#8250;
        </button>
      </div>
    </section>
  );
};

export default Events;