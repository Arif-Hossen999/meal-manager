'use strict'

class CreateMember {
  get rules () {
    return {
      // validation rules
      'username': 'required',
      // 'email': 'required|unique:users',
      'email': 'required',
      'password': 'required',
      'profile_pic_url': 'required',
      'hostel_id':'required'
    }
  }

  get messages() {
    return {
      required: "{{ field }} is required.",
      unique: "This {{ field }} has already been taken.",
    }
  }

  async fails(error) {
    return this.ctx.response.send(error); 
  }

}

module.exports = CreateMember
