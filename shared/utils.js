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

    if(Object.entries(result).length > 0){
        context.res = {
            status: 400,
            body: result
        }
        context.done();
        return;
    }
}

exports.verifyGameToken = verifyGameToken;
exports.validateHeaders = validateHeaders;