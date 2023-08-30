'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ExtraCostSchema extends Schema {
  up () {
    this.create('extra_costs', (table) => {
      table.increments()
      table.string("description", 255);
      table.decimal("total_amount", [8], [2]).notNullable();
      table.integer("status", 60);
      table.integer("hostel_user_id", 60);
      table.string("date", 60);
      table.timestamps()
    })
  }

  down () {
    this.drop('extra_costs')
  }
}

module.exports = ExtraCostSchema
