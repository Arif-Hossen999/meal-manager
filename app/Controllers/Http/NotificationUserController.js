"use strict";
const Notification = use("App/Models/Notification");
const Database = use("Database");
const AuthorizationService = use("App/Services/AuthorizationService");

class NotificationUserController {
  // view notification
  async view({ auth, request, response }) {
    try {
      // get user data
      const user = await auth.getUser();

      const { monthStart, monthEnd, user_id } = request.all();
      // get manager info
      const managerData = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("hostel_id")
        .first();
      const managerHostelId = managerData.hostel_id;
      // console.log(managerHostelId)
      // return
      // get member info
      const memberData = await Database.table("hostel_user")
        .where("user_id", user_id)
        .select("id")
        .first();
      const memberHostelId = memberData.id;
      //   console.log(memberHostelId)
      //   return

      const userNotification = await Database.table("notifications")
        // .query()
        .join("hostel_user", "hostel_user.id", "notifications.hostel_user_id")
        .where("hostel_user.hostel_id", managerHostelId)
        .where("notifications.hostel_user_id", memberHostelId)
        .where("notifications.status", 1)
        .where("notifications.notification_date", ">=", monthStart)
        .where("notifications.notification_date", "<=", monthEnd)
        .select(
          "notifications.notification",
          "notifications.is_seen",
          "notifications.notification_date as date",
          "notifications.hostel_user_id",
          "notifications.id"
        );
      // .fetch();
      return userNotification;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // create notification
  async create({ auth, request, response }) {
    try {
      // get user data
      const user = await auth.getUser();

      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("type", "hostel_id")
        .first();

      //get form data
      const { notification, user_id, notification_date } = request.all();

      const hosteldata = await Database.table("hostel_user")
        .where("user_id", user_id)
        .select("id", "hostel_id")
        .first();
      //   console.log(hosteldata);
      //   return;

      const id = hosteldata.id;
      //   console.log(id);
      //   return

      // Authorization Permission
      AuthorizationService.verifyPermission(userdata, hosteldata);

      const notificationInsert = new Notification();
      //   console.log(notificationData);
      //   return;

      notificationInsert.fill({
        notification,
        status: 1,
        hostel_user_id: id,
        notification_date,
      });

      await notificationInsert.save();
      //   console.log(notificationInsert.toJSON());
      //   return;
      return notificationInsert;
    } catch (error) {
      return response.status(500).send({
        error: "Notification not created",
      });
    }
  }
  // destroy notification
  async destroy({ auth, params, response }) {
    try {
      // get user data
      const user = await auth.getUser();
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("type", "user_id")
        .first();
      // get id for update
      const { id } = params;
      // find data from Hostel table for update
      const userDestroy = await Notification.find(id);
      // check hostel_id for update data
      const hosteldata = await Database.table("hostel_user")
        .where("id", userDestroy.hostel_user_id)
        .select("user_id")
        .first();
      // console.log(hosteldata)
      // return
      // Authorization Permission
      AuthorizationService.verifyPermissionUser(userdata, hosteldata);

      // update status value
      userDestroy.status = 0;
      await userDestroy.save();
      return userDestroy;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "destroy failed",
      });
    }
  }

  // confirm user notification
  async confirm({ request, session, response }) {
    try {
      //  get id for confirm notification
      const { id } = request.all();
      // get user notification
      const notification = await Notification.findBy("id", id);
      // console.log(user)
      // return
      // set notification is_seen true
      notification.is_seen = true;
      await notification.save();

      return "Your notification has been seen.";
    } catch (error) {
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}

module.exports = NotificationUserController;
