"use strict";

const { route } = require("@adonisjs/framework/src/Route/Manager");
const Hostel = require("../../Models/Hostel");
// use for send mail
const Mail = use("Mail");
// use for ceate random string
const randomString = require("randomstring");
// use for Hash password
const Hash = use("Hash");
// use user table
const User = use("App/Models/User");

class UserController {
  // function for register route
  async register({ request, response }) {
    try {
      // get form data
      const { username, email, password, profile_pic_url } = request.all();

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

      // verify mail
      await Mail.send("emails.verify", createUser.toJSON(), (message) => {
        message
          .to(createUser.email)
          .from("meal-manager@devech.com", "Meal Manager")
          .subject("Please confirm your email address");
      });
      //   colsole.log(createUser.email);

      return createUser;
    } catch (error) {
      // console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // function for confirm mail
  async confirm({ request, session, response }) {
    try {
      //  get token value from user
      const { token } = request.all();
      // get user with the confirmation token
      const user = await User.findBy("confirmation_token", token);

      // check verification code match or not
      if (user == null) {
        return "Verification code does not match.";
      }

      // set confirmation to null and is_active to true
      user.confirmation_token = null;
      user.is_active = true;
      await user.save();

      return "Your email address has been confirmed.";
    } catch (error) {
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // function for login route
  async login({ request, auth, response }) {
    try {
      // get form data
      const { email, password } = request.all();

      // check email exist or not
      const userInfo = await User.findBy("email", email);
      if (userInfo == null) {
        return "Sorry, this email is not recognized";
      }

      // check password match or not
      const passwControl = await Hash.verify(password, userInfo.password);
      if (!passwControl) {
        return "Password doesn't match";
      }

      // login user
      const authenticate = await auth.attempt(email, password);
      const user_token = authenticate.token;

      // return user_token;
      // console.log(user_token);
      // return
      const user = await User.query()
        .where("email", email)
        .select("id", "is_active")
        .first();

      // console.log(user);
      // return

      const userId = user.id;
      const userActive = user.is_active;

      return response.json({
        user_token,
        userId,
        userActive,
      });
    } catch (error) {
      // console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  /**
   * Updating Client Password
   * Client is Logged In Client
   */
  async updatepassword({ auth, request, response }) {
    try {
      
      // get user data
      const user = await auth.getUser();
      // console.log(user)
      // return
      // verify if current password matches
      const verifyPassword = await Hash.verify(
        request.input("password"),
        user.password
      );
      // console.log(verifyPassword)
      // return
      // display appropriate message
      if (!verifyPassword) {
        return {
          message: "Current password could not be verified! Please try again.",
        };
      }
      // hash and save new password
      user.password = await request.input("newPassword");
      // const safePassword = await Hash.make(request.input("password"));
      // hostel.merge();
      await user.save();
      return user;
    } catch (error) {
      // console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}

module.exports = UserController;
