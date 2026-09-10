import { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "../../styles/services.css";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/slugify";

function Services() {
  const servicesRef = useRef(null);

  const services = [
    {
      title: "Marriage Certificate",
      description:
        "Apply for and manage your marriage certificate through your ward office online.",
    },
    {
      title: "Birth Certificate",
      description:
        "Register a birth and request your official birth certificate easily.",
    },
    {
      title: "Death Certificate",
      description:
        "Submit details and apply for an official death certificate through your ward.",
    },
    {
      title: "Complaints",
      description:
        "Submit complaints and concerns to your ward and track their progress.",
    },
    {
      title: "Home Tax",
      description:
        "View your home tax information and make your ward tax payments online.",
    },
    {
      title: "Nagarita",
      description:
        "Get information and assistance for citizenship registration and related ward services.",
    },
    {
      title: "NID",
      description:
        "Access information and assistance for your National Identity Card services.",
    },
  ];

  const scrollServices = (direction) => {
    if (servicesRef.current) {
      const scrollAmount = 350;

      servicesRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="services" id="services">
      <div className="services-container">

        <div className="services-header">
          <span>OUR SERVICES</span>
          <h2>Ward Services</h2>
        </div>

        <div className="services-wrapper">

          <button
            className="service-arrow service-arrow-left"
            onClick={() => scrollServices("left")}
            aria-label="Previous services"
          >
            <FaChevronLeft />
          </button>

          <div className="services-scroll" ref={servicesRef}>
            {services.map((service, index) => (
              <div className="service-item" key={index}>

                <h3>{service.title}</h3>

                <p>{service.description}</p>

              <Link to={`/citizen/services/${slugify(service.title)}`}>
  View Service →
</Link>

              </div>
            ))}
          </div>

          <button
            className="service-arrow service-arrow-right"
            onClick={() => scrollServices("right")}
            aria-label="Next services"
          >
            <FaChevronRight />
          </button>

        </div>

      </div>
    </section>
  );
}

export default Services;