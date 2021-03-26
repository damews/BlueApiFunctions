module.exports = class MongooseRepository {
  constructor(Model) {
    this.Model = Model;
  }

  async find(filter = {}, options = {}) {
    const results = this.Model.find(filter, null, options);
    return results.exec();
  }

  async findOne(conditions = {}, options = {}) {
    const results = this.Model.findOne(conditions, null, options);
    return results.exec();
  }

  async findById(id) {
    const result = this.Model.findById(id);
    return result.exec();
  }

  async aggregate(aggregationPipeline = []) {
    const results = this.Model.aggregate(aggregationPipeline);
    return results.exec();
  }

  getAggregate() {
    return this.Model.aggregate();
  }

  async create(body) {
    const document = new this.Model(body);
    return document.save();
  }

  async deleteMany(filter = {}) {
    const result = this.Model.deleteMany(filter);
    return result.exec();
  }
};
