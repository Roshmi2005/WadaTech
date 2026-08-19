import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "../../styles/faq.css";

const faqData = [
  {
    question: "What is WadaTech and who can use it?",
    answer:
      "WadaTech is a digital platform that connects citizens with local ward and municipality offices. Residents, ward office staff, and authorized municipal officers can use it to submit applications, review requests, and manage public services online.",
  },
  {
    question: "How do I create an account?",
    answer:
      "You can create an account by clicking the Register button and providing your basic personal information. After completing registration, you can log in and access available ward services.",
  },
  {
    question: "What services can I apply for through WadaTech?",
    answer:
      "WadaTech provides access to important ward services such as marriage certificates, birth certificates, death certificates, citizenship services, NID services, home tax, complaints, and other local government services.",
  },
  {
    question: "How can I track the status of my application?",
    answer:
      "After submitting an application, you can log in to your account and check the current status of your request from your application dashboard.",
  },
  {
    question: "What should I do if I forget my password?",
    answer:
      "Click on the Forgot Password option on the login page and follow the instructions to reset your password.",
  },
  {
    question: "Is my personal information secure on WadaTech?",
    answer:
      "Yes. WadaTech is designed to keep your personal information secure and accessible only to authorized users and relevant ward or municipal officials.",
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      <div className="faq-heading">
        <h2>FAQ</h2>
        <p>All your questions answered!</p>
      </div>

      <div className="faq-container">
        {faqData.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              className={`faq-item ${isOpen ? "open" : ""}`}
              key={index}
            >
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.question}</span>

                {isOpen ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {isOpen && (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FAQ;