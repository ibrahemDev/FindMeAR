const Joi = require('@hapi/joi')
const { Op } = require('sequelize')

const restify = require('restify')


// SequelizeStore

class AdminGetEmergencieById {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/admin/emergencie/:id/', [
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
            restify.plugins.queryParser({ mapParams: false }),
            this._post.bind(self)
        ])






        this.JoiObject = Joi.object({
            id: Joi.number().required().label('id')
        }).label('Form')

    }


    async _post (req, res, next) {
        const v = this.JoiObject.validate(req.params, { abortEarly: false })
        if (v.error != null) {
            res.send({
                status: 'failed',
                msg: 'id error'
            })
            return
        }
        const emergencie = await SYS.mariadb.models.get('Emergency').findOne({
            where: {
                id: req.params.id
            },
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
            emergencie
        })


    }
}


module.exports = AdminGetEmergencieById
