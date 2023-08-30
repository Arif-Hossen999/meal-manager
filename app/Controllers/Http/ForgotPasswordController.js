"use strict";

const { truncate } = require("../../Models/Hostel");

// use for ceate random string
const randomString = require("randomstring");
const User = use("App/Models/User");
const Mail = use("Mail");
const Database = use("Database");
const Hash = use("Hash");

class ForgotPasswordController {
  // send password in user email
  async forgotpassword({ request, response }) {
    try {
      // get eamil for send password
      const { email } = request.all();
      // verify if current email matches
      const userInfo = await User.findBy("email", email);
      if (userInfo == null) {
        return "Sorry, this email is not recognized";
      }
      // create password for send eamil
      const newPassword = randomString.generate({
        length: 6,
        charset: "numeric",
      });
      // send array value for mail send
      let userData = {
        password: newPassword,
        user: userInfo,
      };
      // send password user email
      await Mail.send("emails.password", userData, (message) => {
        message
          .to(userData.user.email)
          .from("meal-manager@devech.com", "Meal Manager")
          .subject("Check your password");
      });
      // hash new password
      const savePassword = await Hash.make(newPassword);
      // set user password
      const affectedRows = await Database.table("users")
        .where("email", userData.user.email)
        .update("password", savePassword);
      return "Password send in your email";
    } catch (error) {
      // console.log(error)
      return response.status(500).send({
        error: "Sorry, there is no user with this email address.",
      });
    }
  }
}

module.exports = ForgotPasswordController;
