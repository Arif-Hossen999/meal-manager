'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class HostelUserSchema extends Schema {
  up () {
    this.create('hostel_user', (table) => {
      table.increments()
      table.integer('type', 60)
      table.integer('status', 60)
      table.integer('hostel_id').unsigned().references('id').inTable('hostels')
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.timestamps()
    })
  }

  down () {
    this.drop('hostel_user')
  }
}

module.exports = HostelUserSchema
