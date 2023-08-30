"use strict";

const User = use("App/Models/User");
const Database = use("Database");
const HostelUser = use("App/Models/HostelUser");
const AuthorizationService = use("App/Services/AuthorizationService");
// use for ceate random string
const randomString = require("randomstring");
const Mail = use("Mail");
// use for Hash password
const Hash = use("Hash");
class MemberController {
  // view member
  async view({ auth, response }) {
    try {
      // get user data
      const user = await auth.getUser();

      const managerData = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("hostel_id", "type")
        .first();
      // console.log(userData);

      const managerHostelId = managerData.hostel_id;
      //console.log(userHostelId);

      const hostelUser = await Database.table("hostel_user")
        // .query()
        .join("hostels", "hostels.id", "hostel_user.hostel_id")
        .join("users", "users.id", "hostel_user.user_id")

        .where("hostel_user.hostel_id", managerHostelId)
        .where("users.status", 1)
        .select(
          "hostel_user.type",
          "users.username",
          "users.email",
          "hostels.name",
          "hostels.description",
          "hostel_user.user_id",
          "hostel_user.type",
          "hostel_user.hostel_id"
        );
      // .fetch();
      return hostelUser;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // create member
  async create({ request, auth, response, message }) {
    try {
      // get user data
      const user = await auth.getUser();
      // console.log(user);
      // return;
      //get form data
      const { username, email, password, profile_pic_url, hostel_id } =
        request.all();

      // console.log(request.all());
      // return;
      // store password for send member email
      const memberPassword = password;

      // Find member details
      const existUserEmail = await Database.table("users")
        .where("email", email)
        .select("username", "email", "status", "id")
        .first();
        // console.log(existUserEmail);
        // return;
        if(existUserEmail){
          // Check member email and status
      if (existUserEmail.email == email && existUserEmail.status == 1) {
        // find member hostel id
        const memberHostelId = await Database.table("hostel_user")
          .where("user_id", existUserEmail.id)
          .select("hostel_id")
          .first();
        // find member hostel name
        const memberHostelName = await Database.table("hostels")
        .where("id", memberHostelId.hostel_id)
        .select("name")
        .first();
        // return membar details
        return response.json({
          existUserEmail,
          memberHostelId,
          memberHostelName,
          message: "This email has already been taken.",
        });
      }
      // Check member status 0 or 1
      else if (existUserEmail.email == email && existUserEmail.status != 1) {
        // find manager hostel id
        const managerHostelId = await Database.table("hostel_user")
          .where("user_id", user.id)
          .select("hostel_id")
          .first();
        const hostelIdMember = managerHostelId.hostel_id;
        // console.log("manager", managerHostelId)
        // return;
        // find member hostel id
        const memberHostelId = await Database.table("hostel_user")
          .where("user_id", existUserEmail.id)
          .select("hostel_id")
          .first();
        // console.log("member", memberHostelId)
        // return;
        // member added same hostel
        if (managerHostelId.hostel_id == memberHostelId.hostel_id) {
          const newPassword = await Hash.make(password);
          // update member status
          const updateMemberStatus = await Database.table("users")
            .where("id", existUserEmail.id)
            .update({
              username: username,
              password: newPassword,
              status: 1,
            });
          // store information for send member email
          let memberInfo = {
            memberPassword,
            existUserEmail,
          };
          // send password in member email
          await Mail.send(
            "emails.existMemberPassword",
            memberInfo,
            (message) => {
              message
                .to(existUserEmail.email)
                .from("meal-manager@devech.com", "Meal Manager")
                .subject("Welcome to Meal Manager");
            }
          );
          return response.json({
            existUserEmail,
            hostelIdMember,
            message:
              "Member added successfully and password send in your email",
          });
        }
        // member added new hostel
        if (managerHostelId.hostel_id != memberHostelId.hostel_id) {
          // console.log("not same");
          // return;
          // insert data into hostel_user table
          const updateHostelUser = await Database.table("hostel_user")
          .where("user_id", existUserEmail.id)
          .update("hostel_id", managerHostelId.hostel_id);
          const newPassword = await Hash.make(password);
          // update member status
          const updateMemberStatus = await Database.table("users")
            .where("id", existUserEmail.id)
            .update({
              username: username,
              password: newPassword,
              status: 1,
            });
          // store information for send member email
          let memberInfo = {
            memberPassword,
            existUserEmail,
          };
          // send password in member email
          await Mail.send(
            "emails.existMemberPassword",
            memberInfo,
            (message) => {
              message
                .to(existUserEmail.email)
                .from("meal-manager@devech.com", "Meal Manager")
                .subject("Welcome to Meal Manager");
            }
          );
          // return response
          return response.json({
            existUserEmail,
            hostelIdMember,
            message:
              "Member added successfully and password send in your email",
          });
        }
      }
        }
        else{    
        // console.log("test");
        // return;
        // insert data into users table
        const createUser = await User.create({
          username,
          email,
          password,
          status: 1,
          confirmation_token: randomString.generate({
            length: 6,
            charset: "numeric",
          }),
          profile_pic_url,
        });

        // store information for send member email
        let memberInfo = {
          memberPassword,
          createUser,
        };
        // send password and verification code for member
        await Mail.send("emails.verifyMember", memberInfo, (message) => {
          message
            .to(createUser.email)
            .from("meal-manager@devech.com", "Meal Manager")
            .subject("Please confirm your email address");
        });

        // insert data into hostel_user table
        const hostelUser = await Database.table("hostel_user").insert({
          user_id: createUser.id,
          hostel_id: hostel_id,
          type: 0,
          status: 1,
        });

        // return hostelUser;
        return response.json({
          createUser,
          hostelUser,
        });
        }
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // update member
  async update({ auth, request, params, response }) {
    try {
      const user = await auth.getUser();
      // console.log(user.toJSON())
      // return
      //console.log(user.id);

      // check if authenticated user is a manager
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("type", "id")
        .first();
      // console.log(userdata);

      // get id for update
      const { id } = params;

      // check hostel_id for update data
      const hosteldata = await Database.table("hostel_user")
        .where("user_id", id)
        .select("id")
        .first();
      // console.log(hosteldata);

      // find data from Hostel table for update
      const userUpdate = await User.find(id);

      const { username, email, profile_pic_url } = request.all();

      // Authorization Permission
      AuthorizationService.verifyPermissionMember(userdata, hosteldata);

      const updateUser = await Database.table("users")
        .where("users.id", userUpdate.id)
        .update({
          username: username,
          email: email,
          profile_pic_url: profile_pic_url,
        });

      // return updateUser;
      return "success update";
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // destroy member
  async destroy({ auth, params, response }) {
    try {
      const user = await auth.getUser();

      // check if authenticated user is a manager
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("type", "hostel_id")
        .first();

      // get id for destroy
      const { id } = params;

      // check hostel_id for update data
      const hosteldata = await Database.table("hostel_user")
        .where("user_id", id)
        .select("hostel_id")
        .first();

      const userDestroy = await User.find(id);

      AuthorizationService.verifyPermission(userdata, hosteldata);

      // update status value
      userDestroy.status = 0;
      await userDestroy.save();
      return userDestroy;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}

module.exports = MemberController;
