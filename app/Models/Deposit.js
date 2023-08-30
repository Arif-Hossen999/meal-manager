'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Deposit extends Model {

    // relation with HostelUser
    hosteluser () {
        return this.belongsTo('App/Models/Deposit')
      }
}

module.exports = Deposit
