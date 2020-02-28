const restify = require('restify')
const Joi = require('@hapi/joi')


class GetEmergencies {
    constructor () {
        const self = this


        SYS.restifyWebServer.httpsServer.get('/api/injured/emergencies/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            // is injured ?
            (req, res, next) => {
                if (req.session.db && req.session.db.user_id && req.session.db.role_id === 2) {
                    next()
                } else {
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                }
            },
            this._getAllEmergencies.bind(self)
        ])


        SYS.restifyWebServer.httpsServer.get('/api/injured/emergencie/:id/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),

            (req, res, next) => {
                if (req.session.db && req.session.db.user_id && req.session.db.role_id === 2) {
                    next()
                } else {
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                }
            },
            SYS.restifyWebServer.middlewares.formidable(),
            restify.plugins.queryParser({ mapParams: false }),
            this._getEmergencieById.bind(self)
        ])

        this.JoiObject = Joi.object({
            id: Joi.number().required().label('id')
        }).label('Form')

    }

    emergenciesParser (items) {


        const emergenciesFinal = items.map((obj) => {
            var cache = {
                ...obj.dataValues
            }
            delete cache.user_id
            delete cache.employee_id

            return cache
        })
        return emergenciesFinal

        /* const emergenciesFinal = []
        for (var key in items) {
            delete items[key].dataValues.user_id
            delete items[key].dataValues.employee_id
            emergenciesFinal.push(items[key].dataValues)
        } */

    }

    async _getEmergencieById (req, res, next) {
        const v = this.JoiObject.validate(req.params, { abortEarly: false })
        if (v.error != null) {
            res.send({
                status: 'failed',
                msg: 'id error'
            })
            return
        }

        const emergencies = await SYS.mariadb.models.get('Emergency').findAll({
            where: {
                id: req.params.id,
                user_id: req.session.db.user_id

            }
        })

        let emergenciesFinal = []
        if (emergencies.length) {
            emergenciesFinal = this.emergenciesParser(emergencies)
            res.send({
                status: 'ok',
                msg: 'Emergency List Ready',
                emergencies: emergenciesFinal[0]

            })
        } else {
            res.send({
                status: 'ok',
                msg: 'Not Found Any Emergency',
                emergencie: emergenciesFinal

            })
        }
    }

    async _getAllEmergencies (req, res, next) {



        const emergencies = await SYS.mariadb.models.get('Emergency').findAll({
            where: {
                user_id: req.session.db.user_id

            }
        })
        let emergenciesFinal = []
        if (emergencies.length) {

            /* for (var key in emergencies) {
                delete emergencies[key].dataValues.user_id
                delete emergencies[key].dataValues.employee_id
                emergenciesFinal.push(emergencies[key].dataValues)
            } */

            emergenciesFinal = this.emergenciesParser(emergencies)

            res.send({
                status: 'ok',
                msg: 'Emergency List Ready',
                emergencies: emergenciesFinal
            })
        } else {
            res.send({
                status: 'ok',
                msg: 'Not Found Any Emergency',
                emergencies: emergenciesFinal

            })
        }





    }

}


module.exports = GetEmergencies


