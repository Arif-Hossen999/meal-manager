"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class DepositSchema extends Schema {
  up() {
    this.create("deposits", (table) => {
      table.increments();
      table.decimal("deposit", [8], [2]);
      table.integer("status", 60);
      table.integer("hostel_user_id", 60);
      table.string("date", 60);
      // table.integer('hostel_user_id').unsigned().references('id').inTable('hostel_user')
      table.timestamps();
    });
  }

  down() {
    this.drop("deposits");
  }
}

module.exports = DepositSchema;
