module.exports = class MongooseRepository {
    constructor(model) {
        this.model = model
    }

    async find(filter = {}, options = {}) {
        const results = this.model.find(filter, options);
        return results.exec();
    }

    async findOne(conditions = {}, options = {}) {
        const results = this.model.findOne(conditions, options)
        return results.exec();
    }

    async findById(id) {
        const result = this.model.findById(id);
        return result.exec();

    }

    async aggregate(aggregationPipeline = []) {
        const results = this.model.aggregate(aggregationPipeline);
        return results.exec();
    }

    async create(body) {
        const document = new this.model(body);
        return document.save()
    }
}