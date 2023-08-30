'use strict'
const Database = use('Database');

class ProfileController {

    // view bazar lists
    async myProfile({ auth, params, response }){

        try {

            // get user data
            const user = await auth.getUser();
            // return user

            const { id } = params;

            const managerData = await Database.table('hostel_user')
            .where('user_id', user.id)
            .select('hostel_id')
            .first();
            // console.log(userData);

            const  managerHostelId  = managerData.hostel_id;

            const userData = await Database.table('hostel_user')
            .where('user_id', id)
            .select('hostel_id')
            .first();
            const userHostelId = userData.hostel_id;
            //console.log(userId);

            const userProfileData = await Database.table('hostel_user')
            // .query()
            .join('users','users.id','hostel_user.user_id')
            .join('hostels','hostels.id','hostel_user.hostel_id')
            .join('deposits','deposits.hostel_user_id','hostel_user.id')
            //.join('bazar_lists','bazar_lists.hostel_user_id','hostel_user.id')
            
            .where(userHostelId, managerHostelId)
            .where('users.id', id)
            .where('users.status', 1)
            .where('hostels.status', 1)
            .where('deposits.status', 1)
            .select(
                'hostels.name',
                'users.username',
                'users.id',
                'users.email',
                'users.profile_pic_url',
                'hostel_user.hostel_id'
            )
            .sum('deposits.deposit')
            // .fetch();

            return userProfileData;
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }
        
    }

}

module.exports = ProfileController
