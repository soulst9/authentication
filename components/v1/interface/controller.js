class ControllerInterface {
  constructor(componentModel, service) {
    this.componentModel = componentModel;
    this._service = service;
  }

  get service() {
    return this._service;
  }

  async createController(req, res, next) {
    try {
      console.log("createController");
      const result = await this._service.createService(req.body, req.decoded);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async readController(req, res, next) {
    try {
      console.log("readController");
      const result = await this._service.readService({
        ...req.params,
        ...req.query,
      });
      res.json(result.dataValues);
    } catch (error) {
      next(error);
    }
  }

  async readAllController(req, res, next) {
    try {
      const result = await this._service.readAllService(req.query);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async updateController(req, res, next) {
    try {
      console.log("updateController");
      const result = await this._service.updateService(req.params, req.body);
      res.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteController(req, res, next) {
    try {
      console.log("deleteController");
      const Service = this.service;
      const result = await this._service.deleteService(req);
      res.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }

  async duplicateController(req, res, next) {
    try {
      console.log("duplicateController");
      const result = await this._service.duplicateService({ ...req.params });
      res.status(204).json(result);
    } catch (error) {
      next(error);
    }
  }

  async countController(req, res, next) {
    try {
      console.log("countController");
      const result = await this._service.countService(req);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ControllerInterface;
