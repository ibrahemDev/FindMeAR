const Joi = require('@hapi/joi')
const { Op } = require('sequelize')


// SequelizeStore

class GetAllEmergencies {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/admin/emergencie/all/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            // check is login or not
            (req, res, next) => {

                if (req.session.db && req.session.db.user_id && req.session.db.role_id === 1) {
                    next()
                } else {

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


    async _post (req, res, next) {


        const emergencies = await SYS.mariadb.models.get('Emergency').findAll({
            include: [
                {
                    model: SYS.mariadb.models.get('Users'),
                    as: 'injured'
                }, {
                    model: SYS.mariadb.models.get('Users'),
                    as: 'paramedic'
                }
            ]
        })



        res.send({
            status: 'ok',
            msg: 'users List Ready',
            code: 'USERS_LIST',
            emergencies
        })


    }
}


module.exports = GetAllEmergencies
