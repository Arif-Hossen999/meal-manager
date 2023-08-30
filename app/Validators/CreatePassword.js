"use strict";

class CreateMember {
  get rules() {
    return {
      // validation rules
      email: "required",
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

module.exports = CreateMember;
