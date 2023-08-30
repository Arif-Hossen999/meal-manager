"use strict";

class CreateMeal {
  get rules() {
    return {
      // validation rules
      breakfast: "required",
      lunch: "required",
      dinner: "required",
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

module.exports = CreateMeal;
