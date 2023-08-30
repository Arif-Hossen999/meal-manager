"use strict";

class CreateDeposit {
  get rules() {
    return {
      // validation rules
      deposit: "required",
      user_id: "required",
      date: "required",
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
