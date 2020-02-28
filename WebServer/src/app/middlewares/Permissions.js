const contents = require('../../contents')









module.exports = (arr, send) => {

    // contents.PERMISSIONS
    // contents.PERMISSIONS.PARAMEDIC
    return (req, res, next) => {


        // if (req.session.db && req.session.db.user_id && req.session.db.role_id === 3) {
        if (arr.length) {
            for (var key in arr) {

                if (arr[key] === contents.PERMISSIONS.GUEST && (!req.session.db || (req.session.db && req.session.db.user_id == null))) {
                    return next()
                } else if (arr[key] === contents.PERMISSIONS.INJURED && req.session.db && req.session.db.user_id && req.session.db.role_id === contents.PERMISSIONS.INJURED) {
                    return next()
                } else if (arr[key] === contents.PERMISSIONS.PARAMEDIC && req.session.db && req.session.db.user_id && req.session.db.role_id === contents.PERMISSIONS.PARAMEDIC) {

                    return next()

                } else if (arr[key] === contents.PERMISSIONS.ADMIN && req.session.db && req.session.db.user_id && req.session.db.role_id === contents.PERMISSIONS.ADMIN) {
                    return next()
                }
            }



            return send(req, res, next)
        } else
            next()
    }

}


