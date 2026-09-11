// Minimal local storage "database" for citizen applications.
// Swap these functions for real API calls once your backend is ready -
// the rest of the app only calls these four functions, so that's the only file to change.

const STORAGE_KEY = "wadatech_applications";

export const getAllApplications = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const getApplicationsByService = (serviceId) =>
  getAllApplications().filter((app) => app.serviceId === serviceId);

export const addApplication = (serviceId, formData) => {
  const applications = getAllApplications();
  const newApplication = {
    id: Date.now(),
    serviceId,
    formData,
    status: "Submitted",
    paymentStatus: "Unpaid",
    submittedAt: new Date().toISOString().split("T")[0],
  };
  applications.push(newApplication);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  return newApplication;
};

export const markApplicationPaid = (id) => {
  const applications = getAllApplications().map((app) =>
    app.id === id ? { ...app, paymentStatus: "Paid" } : app
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
};