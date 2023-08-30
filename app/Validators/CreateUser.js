"use strict";

class CreateUser {
  // get validateAll() {
  //   return true;
  // }
  get rules() {
    return {
      // validation rules
      username: "required",
      email: "required|unique:users",
      password: "required",
      profile_pic_url: "required",
    };
  }

  get messages() {
    return {
      required: "{{ field }} is required.",
      unique: "This {{ field }} has already been taken.",
      // 'unique': 'Wait a second, the {{ field }} already exists'
    };
  }

  async fails(error) {
    // const emailError = error.find((e) => e.field == "email");
    // console.log(emailError);
    return this.ctx.response.send(error);
  }
}

module.exports = CreateUser;
