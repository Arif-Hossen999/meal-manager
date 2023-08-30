'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ImageSchema extends Schema {
  up () {
    this.create('images', (table) => {
      table.increments()
      table.string('image_url', 254).notNullable()
      table.integer('status', 60)
      table.integer("user_id", 60);
      table.timestamps()
    })
  }

  down () {
    this.drop('images')
  }
}

module.exports = ImageSchema
