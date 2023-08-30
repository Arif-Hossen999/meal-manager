'use strict'
const Meal = use('App/Models/Meal');
const Database = use('Database');

const AuthorizationService = use('App/Services/AuthorizationService');

class MealController {

     // view bazar lists
     async view({ auth, request, response }){

        try {

            // get user data
            const user = await auth.getUser();
            // return user

            const { monthStart, monthEnd } = request.all();

            const managerData = await Database.table('hostel_user')
            .where('user_id', user.id)
            .select('hostel_id')
            .first();
            // console.log(userData);

            const  managerHostelId  = managerData.hostel_id;
            //console.log(userHostelId);

            // problem username show korbo
            const userMeal = await Database.table('meals')
            // .query()
            .join('hostel_user','hostel_user.id','meals.hostel_user_id')
            .join('users','users.id','hostel_user.user_id')
            .join('hostels','hostels.id','hostel_user.hostel_id')
            
            // problem user name show korbo
            .where('hostel_user.hostel_id', managerHostelId)
            .where('users.status', 1)
            .where('meals.status', 1)
            .where('meals.date','>=', monthStart)
            .where('meals.date','<=', monthEnd)
            .select(
                'hostels.name',
                'hostel_user.user_id',
                'users.username',
                'meals.created_at',
                'meals.date',
                'meals.breakfast',
                'meals.lunch',
                'meals.dinner',
                'meals.id',

            )
            // .fetch();
            return userMeal;  
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }           
        
    }

     // create bazar list
     async create({ request, auth, response }){

        try {

            // get user data
            const user = await auth.getUser();

            const userdata = await Database.table('hostel_user')
            .where('user_id', user.id)
            .select('type','hostel_id')
            .first();

            //get form data
            const { breakfast, lunch, dinner, user_id, date } = request.all();

            const hosteldata = await Database.table('hostel_user')
            .where('user_id', user_id)
            .select('id','hostel_id')
            .first();
            //console.log(userId);

            const  id  = hosteldata.id;
            //console.log(id);

            // Authorization Permission
            AuthorizationService.verifyPermission( userdata , hosteldata );


            const meal = new Meal();
            // insert data into meal table
            meal.fill({
                breakfast,
                lunch,
                dinner,
                status:1,
                hostel_user_id: id,
                date,
            });
        
            await meal.save();
            return meal;
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }

    }

     // update bazar list
     async update({ auth, request, params, response }){

        try {

            const user = await auth.getUser();

            // check if authenticated user is a manager
            const userdata = await Database.table('hostel_user')
            .where('user_id', user.id)
            .select('type','hostel_id')
            .first();
            //console.log(userdata);

            // get id for update
            const { id } = params;

            // find data from Meal table for update
            const userUpdate = await Meal.find(id);

            // check hostel_id for update data
            const hosteldata = await Database.table('hostel_user')
            .where('id', userUpdate.hostel_user_id)
            .select('hostel_id')
            .first();
            //console.log(hosteldata);


            const { breakfast, lunch, dinner } = request.all();

            // Authorization Permission
            AuthorizationService.verifyPermission( userdata , hosteldata );

            const updateBazarList = await Database.table('meals')
            .where('meals.id', userUpdate.id)
            .update({ 
                'breakfast': breakfast, 
                'lunch': lunch,
                'dinner': dinner
            })

            // return updateUser;
            return "success update";
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }

    }

    // destroy bazar list
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

            const userDestroy = await Meal.find(id);

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

module.exports = MealController
