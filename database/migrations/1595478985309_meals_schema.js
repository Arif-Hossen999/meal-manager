"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class MealsSchema extends Schema {
  up() {
    this.create("meals", (table) => {
      table.increments();
      table.decimal("breakfast", [8], [2]).notNullable();
      table.integer("lunch", 60);
      table.integer("dinner", 60);
      table.integer("status", 60);
      table.integer("hostel_user_id", 60);
      table.string("date", 60);
      table.timestamps();
    });
  }

  down() {
    this.drop("meals");
  }
}

module.exports = MealsSchema;
