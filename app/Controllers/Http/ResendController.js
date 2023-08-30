"use strict";
const User = use("App/Models/User");
const Mail = use("Mail");
const Database = use("Database");
const randomString = require("randomstring");

class ResendController {
  // resend verify code for login user
  async resend({ params, response, request }) {
    try {
      // verify if current email matches
      const userInfo = await User.findByOrFail("id", params.id);
      // create new verify code for send eamil
      const new_confirmation_token = randomString.generate({
        length: 6,
        charset: "numeric",
      });
      // send array value for mail send
      let userData = {
        confirmation_token: new_confirmation_token,
        user: userInfo,
      };
      // send password user email
      await Mail.send("emails.verify", userData, (message) => {
        message
          .to(userData.user.email)
          .from("meal-manager@devech.com", "Meal Manager")
          .subject("Please confirm your email address");
      });
      // set user confirmation code in user table
      const affectedRows = await Database.table("users")
        .where("email", userData.user.email)
        .update({
          confirmation_token: new_confirmation_token,
          is_active: false,
        });
      return "New confirmation code sends in your email.";
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Sorry, this email is not recognized",
      });
    }
  }
}

module.exports = ResendController;
