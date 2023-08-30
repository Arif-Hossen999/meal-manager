'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class HostelUser extends Model {

    // relation with Hostel models
  hostels(){
    return this.hasMany('App/Models/Hostel')
  }

  // relation with User models
  users(){
    return this.hasMany('App/Models/User')
  }

  // relation with Deposit models
  deposits(){
    return this.hasMany('App/Models/Deposit')
  }

}

module.exports = HostelUser
