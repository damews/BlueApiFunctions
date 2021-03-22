exports.verifyGameToken = async (token, mongoose) => {
    require('../shared/UserAccount');
    const UserAccountModel = mongoose.model('UserAccount');
    const user = await UserAccountModel.findOne({ "gameToken.token": token });
    if (!user) return false;
    return true;
}
