const verifyGameToken = async (token, mongoose) => {
    require('../shared/GameToken');
    const GameTokenModel = mongoose.model('GameToken');

    const gameTokenDocument = await GameTokenModel.findOne({ token: token })

    if (Object.entries(gameTokenDocument).length === 0)
        return false;

    return true;
}

const validateHeaders = async (headers, context) => {

    var result = {};

    if (headers.gametoken === undefined || headers.gametoken == null)
        result = { message: "Valor inválido!", header: "GameToken" }

    if (Object.entries(result).length > 0) {
        context.res = {
            status: 400,
            body: result
        }
        context.done();
        return;
    }
}

/**
 * @param {Boolean} success Successefull request?
 * @param {Boolean} authorized Authorized Request?
 * @param {String} message Error message
 * @param {Object} data Data object
 * @param {Number} errors Array of error codes
 */
const createResponse = function (success, authorized, message, data, errorCode) {
    let response = {
        success: success,
        authorized: authorized,
        message: message,
        data: data,
        errors: errorCodes[errorCode]
    }
    return response;
}

const errorCodes = {
    1: "Esta chave de acesso é inválida. Por favor, verifique-a novamente. Se o erro persistir, entre em contato com a equipe de suporte",
    2: "É necessário o envio dos dados para realizar esta operação.",
    00: "Erro interno ao buscar/salvar a informação. Por favor, entre em contato com a equipe de suporte.",
    300: "O ID do registro é necessário para realizar esta consulta/atualização."
}

exports.verifyGameToken = verifyGameToken;
exports.validateHeaders = validateHeaders;
exports.createResponse = createResponse;