"use strict";

const Hostel = use("App/Models/Hostel");
const User = use("App/Models/User");
const HostelUser = use("App/Models/HostelUser");
const AuthorizationService = use("App/Services/AuthorizationService");
const Database = use("Database");

class HostelController {
  // view hostel
  async view({ auth, response }) {
    try {
      // get user data
      const user = await auth.getUser();
      // return user

      // const userWithHostels = await User
      //     .query()
      //     .with('hostels', (builder) => {
      //         builder.where('status', 1)
      //         // .where('created_at','>=','2020-07-12 20:06:00')
      //         .select('user_id','name','description')
      //     })
      //     .where('id', user.id)
      //     .select('id','username', 'email')
      //     .fetch();
      // return userWithHostels;

      const hostelUser = await Database.table("hostel_user")
        // .query()
        .join("hostels", "hostels.id", "hostel_user.hostel_id")
        .join("users", "users.id", "hostel_user.user_id")

        .where("hostel_user.user_id", user.id)
        .where("hostels.status", 1)
        .select(
          "hostel_user.type",
          "users.username",
          "hostels.name",
          "hostels.description",
          "hostel_user.id"
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

  // create hostel
  async create({ request, auth, response }) {
    try {
      // get user data
      const user = await auth.getUser();

      //get form data
      const { name, description } = request.all();

      // access Hostel table
      const hostel = new Hostel();

      // insert data into Hostel table
      hostel.fill({
        name,
        description,
        status: 1,
      });

      await hostel.save();
      // console.log(hostel.toJSON());

      const hostelUser = await Database.table("hostel_user").insert({
        user_id: user.id,
        hostel_id: hostel.id,
        type: 1,
        status: 1,
      });

      // return hostelUser;
      return response.json({
        hostel,
        hostelUser,
      });
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // update hostel
  async update({ auth, request, params, response }) {
    try {
      const user = await auth.getUser();

      // check if authenticated user is a manager
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .where("id", params.id)
        .select("type", "hostel_id")
        .first();
      //console.log(userdata);

      // get id for update
      const { id } = params;

      // check hostel id for update data
      const hosteldata = await Database.table("hostel_user")
        .where("id", id)
        .select("type", "hostel_id")
        .first();
      //console.log(hosteldata);

      // find data from Hostel table for update
      const hostel = await Hostel.find(hosteldata.hostel_id);
      //console.log(hostel);

      // Authorization Permission
      AuthorizationService.verify(userdata, hosteldata);

      hostel.merge(request.only(["name", "description"]));

      await hostel.save();
      return hostel;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // destroy hostel
  async destroy({ auth, params, response }) {
    try {
      const user = await auth.getUser();

      // check if authenticated user is a manager
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .where("id", params.id)
        .select("type", "hostel_id")
        .first();
      // console.log(userdata);

      const { id } = params;

      // check hostel id for update data
      const hosteldata = await Database.table("hostel_user")
        .where("id", id)
        .select("type", "hostel_id")
        .first();
      //console.log(hosteldata);

      const hostel = await Hostel.find(hosteldata.hostel_id);

      AuthorizationService.verify(userdata, hosteldata);

      // update status value
      hostel.status = 0;
      await hostel.save();
      return hostel;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}

module.exports = HostelController;
