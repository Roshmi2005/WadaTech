const STORAGE_KEY = "wadatech_complaints";

export const getAllComplaints = () => {
  try {
    const savedComplaints = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedComplaints) ? savedComplaints : [];
  } catch {
    return [];
  }
};

export const addComplaint = (formData) => {
  const complaints = getAllComplaints();

  const newComplaint = {
    id: Date.now(),
    type: formData.type || "Inquiry",
    category: formData.category || "Administrative",
    fullName: formData.fullName || "",
    phone: formData.phone || "",
    email: formData.email || "",
    wardNo: formData.wardNo || "",
    subject: formData.subject || "",
    description: formData.description || "",
    status: "Pending",
    submittedAt: new Date().toISOString().split("T")[0],
  };

  complaints.unshift(newComplaint);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));

  return newComplaint;
};

export const updateComplaintStatus = (id, status) => {
  const complaints = getAllComplaints().map((complaint) =>
    complaint.id === id ? { ...complaint, status } : complaint
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(complaints));
  return complaints;
};
