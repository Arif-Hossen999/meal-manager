'use strict'

class LoginUser {
  get rules () {
    return {
      // validation rules
      'email': 'required|email',
      'password': 'required'
    }
  }

  
  get messages() {
    return {
      'required': '{{ field }} is required.',
    }
  }

  async fails(error) {      
      return this.ctx.response.send(error); 	
  }

}

module.exports = LoginUser
