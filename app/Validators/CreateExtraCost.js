'use strict'

class CreateExtraCost {
  get rules () {
    return {
      // validation rules
      total_amount: "required",
      user_id: "required",
      date: "required",
    }
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

module.exports = CreateExtraCost
