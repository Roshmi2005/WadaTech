import "../../styles/contact.css";

function Contact() {
  return (
    <section className="contact-section" id="contact">
      <div className="contact-container">

        <div className="contact-header">
          <span className="contact-label">CONTACT</span>
          <h2>Get in Touch</h2>
          <p>
            Have a question or need assistance with a ward service?
            Reach out to us through the available channels.
          </p>
        </div>

        <div className="contact-cards">

          <div className="contact-card">
            <div className="contact-icon">☎</div>
            <div>
              <h3>Phone</h3>
              <p>01-XXXXXXX</p>
              <span>Available during office hours</span>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">✉</div>
            <div>
              <h3>Email</h3>
              <p>info@wadatech.com</p>
              <span>For general enquiries</span>
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-icon">⌖</div>
            <div>
              <h3>Location</h3>
              <p>Local Municipality</p>
              <span>Visit during office hours</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;