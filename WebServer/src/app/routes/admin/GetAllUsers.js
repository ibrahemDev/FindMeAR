const Joi = require('@hapi/joi')
const { Op } = require('sequelize')


// SequelizeStore

class GetAllUsers {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/admin/user/all/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            // check is login or not
            (req, res, next) => {

                if (req.session.db && req.session.db.user_id && req.session.db.role_id === 1) {
                    next()
                } else {
                    console.log(req.session)
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })

                }
            },
            this._post.bind(self)
        ])








    }

    jsonToArray (json) {
        var cache = []
        for (var key in json) {
            cache.push(json[key])
        }
        return cache
    }

    async _post (req, res, next) {
        const self = this
        const users = await SYS.mariadb.models.get('Users').findAll({
            include: {
                model: SYS.mariadb.models.get('Roles')
            }
        })



        res.send({
            status: 'ok',
            msg: 'users List Ready',
            code: 'USERS_LIST',
            users: self.jsonToArray(users)
        })


    }
}


module.exports = GetAllUsers
