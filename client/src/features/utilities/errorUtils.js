// normalize errors coming from backend for further storage in state.error
export function normalizeErrorResponse (error) {
  let normalizedError = {
    message: "Server Error",
    status: 0,
    errors: null,
  };

  if (error.response) {
    normalizedError.message = error.response.data.message || normalizedError.message;
    normalizedError.status = error.response.status;
    normalizedError.errors = error.response.statusText || null;
  } else if (error.message) {
    normalizedError.message = error.message;
  }
  return normalizedError;
};
