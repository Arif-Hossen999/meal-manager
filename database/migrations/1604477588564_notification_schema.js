"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class NotificationSchema extends Schema {
  up() {
    this.create("notifications", (table) => {
      table.increments();
      table.string("notification", 254).notNullable();
      table.boolean("is_seen").defaultTo(false);
      table.integer("status", 60);
      table.integer("hostel_user_id", 60);
      table.string("notification_date", 60);
      table.timestamps();
    });
  }

  down() {
    this.drop("notifications");
  }
}

module.exports = NotificationSchema;
