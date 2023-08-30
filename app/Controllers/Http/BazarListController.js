'use strict'
const BazarList = use('App/Models/BazarList');
const BazarListImage = use('App/Models/BazarListImage');
const Database = use('Database');

const AuthorizationService = use('App/Services/AuthorizationService');

class BazarListController {

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

            const userBazarList = await Database.table('bazar_lists')
            // .query()
            .join('hostel_user','hostel_user.id','bazar_lists.hostel_user_id')
            .join('bazar_list_images','bazar_list_images.bazar_list_id','bazar_lists.id')
            .join('users','users.id','hostel_user.user_id')
            .join('hostels','hostels.id','hostel_user.hostel_id')
            
            .where('hostel_user.hostel_id', managerHostelId)
            .where('users.status', 1)
            .where('bazar_lists.status', 1)
            .where('bazar_lists.date','>=', monthStart)
            .where('bazar_lists.date','<=', monthEnd)
            .select(
                'hostels.name',
                'users.username',
                'hostel_user.user_id',
                'bazar_lists.created_at',
                'bazar_lists.date',
                'bazar_lists.description',
                'bazar_lists.total_amount',
                'bazar_list_images.image_url',
                'bazar_lists.id'
            )
            // .fetch();
            return userBazarList;   
            
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
            const { description, total_amount, image_url, user_id , date} = request.all();

            const hosteldata = await Database.table('hostel_user')
            .where('user_id', user_id)
            .select('id','hostel_id')
            .first();
            //console.log(userId);

            const  id  = hosteldata.id;
            //console.log(id);

            // Authorization Permission
            AuthorizationService.verifyPermission( userdata , hosteldata );

            const bazarlist = new BazarList();
            // insert data into bazarlist table
            bazarlist.fill({
                description,
                total_amount,
                status:1,
                hostel_user_id: id,
                date,
            });
            
            await bazarlist.save();
            // console.log(hostel.toJSON());

            const bazarlistimage = new BazarListImage();
            // insert data into bazarlistimage table
            bazarlistimage.fill({
                image_url,
                status:1,
                bazar_list_id: bazarlist.id
            });
            
            await bazarlistimage.save();

            return response.json({
                bazarlist,
                bazarlistimage
            });
            
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

            // find data from Hostel table for update
            const userUpdate = await BazarList.find(id);

            // check hostel_id for update data
            const hosteldata = await Database.table('hostel_user')
            .where('id', userUpdate.hostel_user_id)
            .select('hostel_id')
            .first();
            //console.log(hosteldata);


            const { description, total_amount, image_url } = request.all();

            // Authorization Permission
            AuthorizationService.verifyPermission( userdata , hosteldata );

            const updateBazarList = await Database.table('bazar_lists')
            .where('bazar_lists.id', userUpdate.id)
            .update({ 
                'description': description, 
                'total_amount': total_amount
            })

            const updateBazarListImage = await Database.table('bazar_list_images')
            .where('bazar_list_images.id', userUpdate.id)
            .update('image_url', image_url)

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

            const userDestroy = await BazarList.find(id);

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

module.exports = BazarListController
