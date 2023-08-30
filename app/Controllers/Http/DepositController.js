'use strict'
const Deposit = use('App/Models/Deposit');

const HostelUser = use('App/Models/HostelUser');

const Database = use('Database');

const AuthorizationService = use('App/Services/AuthorizationService');

class DepositController {

    // view deposit
    async view({ auth,request, response }){

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

            const userDeposit = await Database.table('deposits')
            // .query()
            .join('hostel_user','hostel_user.id','deposits.hostel_user_id')
            .join('users','users.id','hostel_user.user_id')
            .join('hostels','hostels.id','hostel_user.hostel_id')
            
            .where('hostel_user.hostel_id', managerHostelId)
            .where('users.status', 1)
            .where('deposits.status', 1)
            .where('deposits.date','>=', monthStart)
            .where('deposits.date','<=', monthEnd)
            .select(
                'hostels.name',
                'users.username',
                'users.id',
                'deposits.created_at',
                'deposits.date',
                'deposits.deposit',
                'deposits.id as deposit_ID'
            )
            // .fetch();
            return userDeposit;
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }
                    
        
    }

    // create deposit
    async create({ request, auth, response }){
    
        try {

            // get user data
            const user = await auth.getUser();

            const userdata = await Database.table('hostel_user')
            .where('user_id', user.id)
            .select('type','hostel_id')
            .first();

            //get form data
            const { deposit, user_id , date} = request.all();

            const hosteldata = await Database.table('hostel_user')
            .where('user_id', user_id)
            .select('id','hostel_id')
            .first();
            // console.log(userId);

            const  id  = hosteldata.id;
            //console.log(id);

            // Authorization Permission
            AuthorizationService.verifyPermission( userdata , hosteldata );

            const deposit_data = new Deposit();

            deposit_data.fill({
                deposit,
                status:1,
                hostel_user_id: id,
                date,
            });

            await deposit_data.save();
            // console.log(hostel.toJSON());

            return deposit_data;
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }

        

    }

    // update deposit
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

            // find data from deposit table for update
            const userUpdate = await Deposit.find(id);

            // check hostel_id for update data
            const hosteldata = await Database.table('hostel_user')
            .where('id', userUpdate.hostel_user_id)
            .select('hostel_id')
            .first();
            //console.log(hosteldata);


            const { deposit } = request.all();

            // Authorization Permission
            AuthorizationService.verifyPermission( userdata , hosteldata );

            const updateUser = await Database.table('deposits')
            .where('deposits.id', userUpdate.id)
            .update('deposit', deposit)

            // return updateUser;
            return "success update";
            
        } catch (error) {
            //console.log(error)
            return response.status(500).send({
                error: 'Something went wrong',
            })
        }

    }

    // destroy deposit
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

            const userDestroy = await Deposit.find(id);

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

module.exports = DepositController
