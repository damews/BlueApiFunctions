export default function createBaseResponse(success, authorized, message, data) {
  const response = {
    success,
    authorized,
    message,
    data,
  };
  return response;
}
