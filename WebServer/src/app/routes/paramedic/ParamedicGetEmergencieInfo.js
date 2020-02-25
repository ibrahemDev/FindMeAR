const Joi = require('@hapi/joi')
const { Op } = require('sequelize')

const restify = require('restify')







// SequelizeStore

class ParamedicGetEmergencieInfo {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.get('/api/paramedic/emergencie/info/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            // check is login or not
            (req, res, next) => {

                if (req.session.db && req.session.db.user_id && req.session.db.role_id === 3) {
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
        const self = this



        const emergency = await SYS.mariadb.models.get('Emergency').findOne({
            where: {
                employee_id: req.session.db.user_id,
                status: 1 // 1 live , 2 close
            }
        })




        res.send({
            status: 'ok',
            msg: 'user Ready',
            code: 'EMERGENCY',
            emergency
        })


    }
}


module.exports = ParamedicGetEmergencieInfo
