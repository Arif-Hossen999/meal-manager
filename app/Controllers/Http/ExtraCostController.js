"use strict";
const ExtraCost = use("App/Models/ExtraCost");
const Database = use("Database");
const AuthorizationService = use("App/Services/AuthorizationService");
class ExtraCostController {
  // view bazar lists
  async view({ auth, request, response }) {
    try {
      // get user data
      const user = await auth.getUser();
      // Get input for show extra cost
      const { monthStart, monthEnd } = request.all();

      // Get user hostel id
      const managerData = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("hostel_id")
        .first();
      // console.log(userData);

      const managerHostelId = managerData.hostel_id;
      //console.log(userHostelId);

      const userExtraCost = await Database.table("extra_costs")
        // .query()
        .join("hostel_user", "hostel_user.id", "extra_costs.hostel_user_id")
        .join("users", "users.id", "hostel_user.user_id")
        .join("hostels", "hostels.id", "hostel_user.hostel_id")

        .where("hostel_user.hostel_id", managerHostelId)
        .where("users.status", 1)
        .where("extra_costs.status", 1)
        .where("extra_costs.date", ">=", monthStart)
        .where("extra_costs.date", "<=", monthEnd)
        .select(
          "hostels.name",
          "users.username",
          "hostel_user.user_id",
          "extra_costs.date",
          "extra_costs.description",
          "extra_costs.total_amount",
          "extra_costs.id"
        );
      // .fetch();
      return userExtraCost;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // create bazar list
  async create({ request, auth, response }) {
    try {
      // get user data
      const user = await auth.getUser();

      // Check user type and hostel id
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("type", "hostel_id")
        .first();

      //get form data
      const { description, total_amount, user_id, date } = request.all();

      const hosteldata = await Database.table("hostel_user")
        .where("user_id", user_id)
        .select("id", "hostel_id")
        .first();
      //console.log(userId);

      const id = hosteldata.id;
      //console.log(id);

      // Authorization Permission
      AuthorizationService.verifyPermission(userdata, hosteldata);

      // Use ExtraCost model
      const extraCost = new ExtraCost();
      // insert data into extra_costs table
      extraCost.fill({
        description,
        total_amount,
        status: 1,
        hostel_user_id: id,
        date,
      });

      await extraCost.save();
      // console.log(extraCost.toJSON());
      return extraCost;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // update extra cost
  async update({ auth, request, params, response }) {
    try {
      const user = await auth.getUser();

      // check if authenticated user is a manager
      const userdata = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("type", "hostel_id")
        .first();
      //console.log(userdata);

      // get id for update
      const { id } = params;

      // find data from Hostel table for update
      const userUpdate = await ExtraCost.find(id);

      // check hostel_id for update data
      const hosteldata = await Database.table("hostel_user")
        .where("id", userUpdate.hostel_user_id)
        .select("hostel_id")
        .first();
      //console.log(hosteldata);

      const { description, total_amount } = request.all();

      // Authorization Permission
      AuthorizationService.verifyPermission(userdata, hosteldata);

      const updateExtraCost = await Database.table("extra_costs")
        .where("extra_costs.id", userUpdate.id)
        .update({
          description: description,
          total_amount: total_amount,
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
    
     // destroy Extra Cost
     async destroy({ auth, params, response }){

        try {

            const user = await auth.getUser();

            // check if authenticated user is a manager
            const userdata = await Database.table('hostel_user')
            .where('user_id', user.id)
            .select('type','hostel_id')
            .first();
            //console.log(userdata);

            const { id } = params;

            const userDestroy = await ExtraCost.find(id);

            // check hostel_id for update data
            const hosteldata = await Database.table('hostel_user')
            .where('id', userDestroy.hostel_user_id)
            .select('hostel_id')
            .first();
            //console.log(hosteldata);

            AuthorizationService.verifyPermission( userdata , hosteldata );

            // update status value
            userDestroy.status = 0;
            await userDestroy.save();
            return userDestroy;
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }

        
    }
}

module.exports = ExtraCostController;
