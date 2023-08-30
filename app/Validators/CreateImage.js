"use strict";

class CreateDeposit {
  get rules() {
    return {
      // validation rules
      image_url: "required",
      user_id: "required",
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

module.exports = CreateDeposit;
