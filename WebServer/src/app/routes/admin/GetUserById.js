const Joi = require('@hapi/joi')
const { Op } = require('sequelize')

const restify = require('restify')







// SequelizeStore

class GetUserById {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/admin/user/:id/', [
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
        const self = this
        const v = this.JoiObject.validate(req.params, { abortEarly: false })
        if (v.error != null) {
            res.send({
                status: 'failed',
                msg: 'id error'
            })
            return
        }

        const user = await SYS.mariadb.models.get('Users').findOne({
            where: {
                id: req.params.id
            },
            include: {
                model: SYS.mariadb.models.get('Roles')

            }
        })




        res.send({
            status: 'ok',
            msg: 'user Ready',
            code: 'USERS_LIST',
            user
        })


    }
}


module.exports = GetUserById
