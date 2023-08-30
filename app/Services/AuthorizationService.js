
const InvalidAccessException = use('App/Exceptions/InvalidAccessException');
const ResourceNotExistException = use('App/Exceptions/ResourceNotExistException');
class AuthorizationService {
    // Authorization for manager
    verifyPermission( resource, hosteldata){
        if(!resource){
            throw new ResourceNotExistException();
        }

        if(resource.hostel_id != hosteldata.hostel_id || resource.type != 1){
                throw new InvalidAccessException();
        }
    }
    // Authorization for member update
    verifyPermissionMember( resource, hosteldata){
        if(!resource){
            throw new ResourceNotExistException();
        }

        if(resource.id != hosteldata.id){
                throw new InvalidAccessException();
        }
    }
    // Authorization for manager update and delete hostel
    verify(resource, hosteldata){
        if(resource.hostel_id != hosteldata.hostel_id || resource.type != hosteldata.type){
            throw new InvalidAccessException();
        }
    }
    // Authorization for user update and profile
    verifyPermissionUser( resource, hosteldata){
        if(!resource){
            throw new ResourceNotExistException();
        }

        if(resource.user_id != hosteldata.user_id){
                throw new InvalidAccessException();
        }
    }
}

module.exports = new AuthorizationService();