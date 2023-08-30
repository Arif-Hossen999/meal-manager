"use strict";
const Database = use("Database");

class TotalCostController {
  // total bazar cost
  async totalBazar({ auth, request, response }) {
    try {
      // get user data
      const user = await auth.getUser();
      // return user

      const { monthStart, monthEnd } = request.all();

      const managerData = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("hostel_id")
        .first();
      // console.log(userData);

      const managerHostelId = managerData.hostel_id;
      //console.log(userHostelId);

      const totalBazar = await Database.table("bazar_lists")
        .join("hostel_user", "hostel_user.id", "bazar_lists.hostel_user_id")
        .where("hostel_user.hostel_id", managerHostelId)
        .where("bazar_lists.status", 1)
        .where("bazar_lists.date", ">=", monthStart)
        .where("bazar_lists.date", "<=", monthEnd)
        // .sum('bazar_lists.total_amount')
        .select(Database.raw("sum(total_amount) as sum"));
      // .fetch();

      // console.log(totalBazar);
      return totalBazar;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // total meal
  async totalMeal({ auth, request, response }) {
    try {
      // get user data
      const user = await auth.getUser();
      // return user

      const { monthStart, monthEnd } = request.all();

      const managerData = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("hostel_id")
        .first();
      // console.log(userData);

      const managerHostelId = managerData.hostel_id;
      //console.log(userHostelId);

      const totalMeal = await Database.table("meals")
        .join("hostel_user", "hostel_user.id", "meals.hostel_user_id")
        .where("hostel_user.hostel_id", managerHostelId)
        .where("meals.status", 1)
        .where("meals.date", ">=", monthStart)
        .where("meals.date", "<=", monthEnd)
        // .select(Database.raw('sum(breakfast + lunch + dinner)'))
        .select(Database.raw("sum(breakfast + lunch + dinner) as sum"));

      return totalMeal;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }

  // total extra cost
  async totalExtraCost({ auth, request, response }) {
    try {
      // get user data
      const user = await auth.getUser();
      // return user

      const { monthStart, monthEnd } = request.all();

      const managerData = await Database.table("hostel_user")
        .where("user_id", user.id)
        .select("hostel_id")
        .first();
      // console.log(userData);

      const managerHostelId = managerData.hostel_id;
      //console.log(userHostelId);

      const totalExtraCost = await Database.table("extra_costs")
        .join("hostel_user", "hostel_user.id", "extra_costs.hostel_user_id")
        .where("hostel_user.hostel_id", managerHostelId)
        .where("extra_costs.status", 1)
        .where("extra_costs.date", ">=", monthStart)
        .where("extra_costs.date", "<=", monthEnd)
        // .sum('ExttotalExtraCost_lists.total_amount')
        .select(Database.raw("sum(total_amount) as sum"));
      // .fetch();

      // console.log(totalBazar);
      return totalExtraCost;
    } catch (error) {
      //console.log(error)
      return response.status(500).send({
        error: "Something went wrong",
      });
    }
  }
}

module.exports = TotalCostController;
