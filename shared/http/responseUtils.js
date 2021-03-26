module.exports.createBaseResponse = (success, authorized, message, data) => {
  const response = {
    success,
    authorized,
    message,
    data,
  };
  return response;
};
