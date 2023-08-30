"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class HostelSchema extends Schema {
  up() {
    this.create("hostels", (table) => {
      table.increments();
      table.string("name", 60).notNullable();
      table.string("description", 255);
      table.integer("status", 60);
      table.timestamps();
    });
  }

  down() {
    this.drop("hostels");
  }
}

module.exports = HostelSchema;
