const verifyGameToken = async (token, mongoose) => {
    require('../shared/GameToken');
    const GameTokenModel = mongoose.model('GameToken');

    const gameTokenDocument = await GameTokenModel.findOne({token: token})

    if(Object.entries(gameTokenDocument).length === 0)
        return false;
        
    return true;
}

exports.verifyGameToken = verifyGameToken;