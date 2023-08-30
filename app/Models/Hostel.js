'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Hostel extends Model {

    // relation with User models
    // user(){
    //     return this.belongsTo('App/Models/User')
    // }

}

module.exports = Hostel
