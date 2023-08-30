'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class BazarListImageSchema extends Schema {
  up () {
    this.create('bazar_list_images', (table) => {
      table.increments()
      table.string('image_url', 254).notNullable()
      table.integer('status', 60)
      table.integer('bazar_list_id',60)
      table.timestamps()
    })
  }

  down () {
    this.drop('bazar_list_images')
  }
}

module.exports = BazarListImageSchema
