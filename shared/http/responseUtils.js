 exports.createResponse = function (success, authorized, message, data) {
    let response = {
        success: success,
        authorized: authorized,
        message: message,
        data: data
    }
    return response;
}