"use strict";

class CreateHostel {
  get rules() {
    return {
      // validation rules
      name: "required",
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required.",
    };
  }

  async fails(error) {
    return this.ctx.response.send(error);
  }
}

module.exports = CreateHostel;
