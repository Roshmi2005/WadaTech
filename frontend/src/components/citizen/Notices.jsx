import React from "react";

import "../../styles/notices.css";

const notices = [
  {
    title: "Public Notices",
    items: [
      "Office closed on Sept 3 for maintenance",
      "New document submission process from Sept 10",
    ],
  },
  {
    title: "Announcements",
    items: [
      "Online payment now available for certificates",
      "Extended office hours during festival season",
    ],
  },
];

const Notices = () => {
  return (
    <section id="notices" className="notices-section">
      <p className="notices-eyebrow">STAY UPDATED</p>
      <h2 className="notices-heading">Notices</h2>

      <div className="notices-grid">
        {notices.map((notice) => (
          <div className="notice-card" key={notice.title}>
            <h3>{notice.title}</h3>
            <ul>
              {notice.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Notices;