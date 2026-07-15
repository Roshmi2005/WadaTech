import * as yup from "yup";
import { APPLICATION_TYPES } from "../models/Application.js";
import { COMPLAINT_CATEGORIES } from "../models/Complaint.js";

const passwordRules = yup
  .string()
  .required("Password is required")
  .min(8, "Password must be at least 8 characters")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(
    /[!@#$%^&*(),.?":{}|<>]/,
    "Password must contain at least one special character"
  );

export const registerSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email")
    .lowercase()
    .trim(),
  password: passwordRules,
});

export const loginSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email")
    .lowercase()
    .trim(),
  password: yup.string().required("Password is required"),
});

export const forgotPasswordSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email")
    .lowercase()
    .trim(),
});

export const resetPasswordSchema = yup.object({
  password: passwordRules,
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const editProfileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),
  email: yup.string().email("Please provide a valid email").lowercase().trim(),
});

export const changePasswordSchema = yup.object({
  oldPassword: yup.string().required("Current password is required"),
  newPassword: passwordRules,
  confirmPassword: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("newPassword")], "Passwords must match"),
});

/** Allow details as object or JSON string (multipart form-data). */
const detailsField = yup
  .mixed()
  .required("Application details are required")
  .transform((value) => {
    if (typeof value === "string") {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  .test("is-object", "Details must be a valid object", (value) => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  });

export const applicationSchema = yup.object({
  applicationType: yup
    .string()
    .required("Application type is required")
    .oneOf(APPLICATION_TYPES, `Application type must be one of: ${APPLICATION_TYPES.join(", ")}`),
  details: detailsField,
});

export const editApplicationSchema = yup.object({
  details: yup
    .mixed()
    .optional()
    .transform((value) => {
      if (value === undefined) return value;
      if (typeof value === "string") {
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
      return value;
    })
    .test("is-object", "Details must be a valid object", (value) => {
      if (value === undefined) return true;
      return value !== null && typeof value === "object" && !Array.isArray(value);
    }),
  applicationType: yup
    .string()
    .optional()
    .oneOf(APPLICATION_TYPES, `Application type must be one of: ${APPLICATION_TYPES.join(", ")}`),
});

export const complaintSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: yup
    .string()
    .required("Description is required")
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      COMPLAINT_CATEGORIES,
      `Category must be one of: ${COMPLAINT_CATEGORIES.join(", ")}`
    ),
});

export const editComplaintSchema = yup.object({
  title: yup
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: yup
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  category: yup
    .string()
    .oneOf(
      COMPLAINT_CATEGORIES,
      `Category must be one of: ${COMPLAINT_CATEGORIES.join(", ")}`
    ),
});

export const feedbackSchema = yup.object({
  subject: yup
    .string()
    .required("Subject is required")
    .trim()
    .min(3, "Subject must be at least 3 characters")
    .max(150, "Subject cannot exceed 150 characters"),
  rating: yup
    .number()
    .transform((value, original) =>
      original === "" || original === null || original === undefined
        ? undefined
        : Number(original)
    )
    .required("Rating is required")
    .integer("Rating must be an integer")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5"),
  message: yup
    .string()
    .required("Message is required")
    .trim()
    .min(5, "Message must be at least 5 characters")
    .max(2000, "Message cannot exceed 2000 characters"),
});

export const mongoIdParamSchema = yup.object({
  id: yup
    .string()
    .required("ID is required")
    .matches(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});
