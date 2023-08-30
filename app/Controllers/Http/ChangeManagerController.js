"use strict";
const HostelUser = use("App/Models/HostelUser");
const AuthorizationService = use("App/Services/AuthorizationService");
const Database = use("Database");
class ChangeManagerController {
  // change manager
  async update({ auth, params, response }) {
    try {
      // get login user data
      const user = await auth.getUser();
      // check if authenticated user is a manager
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("id", "type", "hostel_id")
        .first();
      // console.log(userdata)
      // return
      // get id for update manager
      const { id } = params;
      // find data from hostel_user table for update manager
      const hosteldata = await Database.table("hostel_user")
        .where("user_id", id)
        .select("id", "type", "hostel_id")
        .first();
      
      AuthorizationService.verifyPermission(userdata, hosteldata);
      //   console.log(memberId);
      //   return;
      const updateMember = await Database.table("hostel_user")
        .where("hostel_user.id", hosteldata.id)
        .update("type", 1);

      const updateManager = await Database.table("hostel_user")
        .where("hostel_user.id", userdata.id)
        .update("type", 0);
      // console.log(updateManager);
      // return;
      // return updateUser;
      return "success update";
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "The manager has not changed",
      });
    }
  }
}

module.exports = ChangeManagerController;
