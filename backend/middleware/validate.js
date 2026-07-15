/**
 * Reusable Yup validation middleware.
 * Usage: validate(schema) or validate(schema, "body" | "params" | "query")
 */
const validate = (schema, source = "body") => {
  return async (req, res, next) => {
    try {
      const data = req[source];
      const validated = await schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
      req[source] = validated;
      next();
    } catch (error) {
      if (error.name === "ValidationError" && error.inner) {
        const errors = error.inner.map((err) => ({
          field: err.path,
          message: err.message,
        }));
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      return res.status(400).json({
        success: false,
        message: error.message || "Validation failed",
      });
    }
  };
};

export default validate;
