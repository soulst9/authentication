class Components {
  constructor() {
    this.components = {};
  }

  push(component) {
    this.components[component.constructor.name] = component;
  }

  getServiceByRouterName(name) {
    if (!name) {
      throw new Error("component name parameter need!");
    }

    if (!this.components[name]) {
      throw new Error("component not found");
    }

    return this.components[name].controller.service;
  }
}

module.exports = new Components();
