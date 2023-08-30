'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UserSchema extends Schema {
  up () {
    this.create('users', (table) => {
      table.increments()
      table.string('username', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.string('password', 60).notNullable()
      table.integer('status', 60)
      table.string('confirmation_token', 60)
      table.boolean('is_active').defaultTo(false)
      table.string('profile_pic_url', 254).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('users')
  }
}

module.exports = UserSchema
