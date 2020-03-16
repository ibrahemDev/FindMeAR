const contents = require('../../../contents')
const Permissions = require('../../middlewares/Permissions')
const restify = require('restify')
const Joi = require('@hapi/joi')



class MapAi {
    constructor () {

    }

    buildUsefulErrorObject (errors) {
        const usefulErrors = []
        errors.map((error) => {
            usefulErrors.push(error)
        })
        return usefulErrors
    }

    joiCheck (schema, data) {
        const validate = schema.validate(data, { abortEarly: false })
        const obj2 = {}
        obj2.errors = validate.error ? this.buildUsefulErrorObject(validate.error.details) : null
        obj2.value = validate.value
        return obj2
    }



    middlewares (methodType, permissions) {
        if (methodType === 'get') {
            return [
                SYS.restifyWebServer.middlewares.OptimizeUrl(),
                SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
                SYS.restifyWebServer.middlewares.session(),
                Permissions([
                    ...permissions
                ], (req, res, next) => {
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                })

            ]
        } else if (methodType === 'post') {
            return [
                SYS.restifyWebServer.middlewares.OptimizeUrl(),
                SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
                SYS.restifyWebServer.middlewares.session(),
                SYS.restifyWebServer.middlewares.formidable(),
                Permissions([
                    ...permissions
                ], (req, res, next) => {
                    res.send({
                        status: 'failed',
                        message: 'Route Not Found',
                        code: 'ROUTE_NOT_FOUND'
                    })
                })

            ]
        }
    }

    // https://127.0.0.1:3000/api/map/ai/get_all_areas/
    /**
     *const data = [
      {
        lat: -34.397,
        lng: 150.644,
        distance:10000,
        every:5,
        fillColor:'white',
        count:5
      }
    ]
     */
    async getAllAreas (req, res, next) {
        const items = await SYS.mariadb.models.get('Area').findAll({})



        res.send({
            status: 'ok',
            areas: items
        })

    }


    // https://127.0.0.1:3000/api/map/ai/sort_emergencies/ ,,,, date1,date2,distance
    async sortEmergencies (req, res, next) {

        const JoiForm = Joi.object({
            date1: Joi.string().required().label('date1'),
            date2: Joi.string().required().label('date2'),
            distance: Joi.number().required().label('distance')
        }).min(1).label('Form')
        const validateJoiForm = this.joiCheck(JoiForm, req.body.fields)
        if (validateJoiForm.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    Form: validateJoiForm.errors
                }
            })
            return next()
        }



        // call aiEmergenciesFetchEmergenciesPerTimeRange(100,'2020-02-20 00:00:00.000000','2020-02-29 00:00:00.000000');
        const [results, metadata] = await SYS.mariadb.sequelize.query('call aiEmergenciesFetchEmergenciesPerTimeRange(:distance, :date1, :date2);', {
            raw: true,
            replacements: {
                date1: validateJoiForm.value.date1,
                date2: validateJoiForm.value.date2,
                distance: validateJoiForm.value.distance
            }
        })



        res.send({
            status: 'ok'
        })

    }

    // start_ai_training
    async startAiTraining (req, res, next) {

        const JoiForm = Joi.object({
            lat: Joi.number().required().label('lat'),
            lng: Joi.number().required().label('lng'),
            distance: Joi.number().required().label('distance'),
            houres: Joi.number().required().label('houres'),
            date1: Joi.string().required().label('date1'),
            date2: Joi.string().required().label('date2')

        }).min(6).label('Form')
        const validateJoiForm = this.joiCheck(JoiForm, req.body.fields)
        if (validateJoiForm.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    Form: validateJoiForm.errors
                }
            })
            return next()
        }
        // 3600* 12
        const [results, metadata] = await SYS.mariadb.sequelize.query('call ai(:date1,:date2, :lat, :lng, :distance, :houres);', {
            raw: true,
            replacements: {
                lat: validateJoiForm.value.lat,
                lng: validateJoiForm.value.lng,
                distance: validateJoiForm.value.distance,
                houres: validateJoiForm.value.houres * 3600,
                date1: validateJoiForm.value.date1,
                date2: validateJoiForm.value.date2

            }
        })


        res.send({
            status: 'ok',
            average: results.count
        })






    }


    // https://127.0.0.1:3000/api/map/ai/calculate_hours/ ,,,, houres
    async calculateHours (req, res, next) {
        const JoiForm = Joi.object({
            houres: Joi.string().required().label('houres')

        }).min(1).label('Form')
        const validateJoiForm = this.joiCheck(JoiForm, req.body.fields)
        if (validateJoiForm.errors != null) {
            res.send({
                status: 'failed',
                error: {
                    Form: validateJoiForm.errors
                }
            })
            return next()
        }

        // call aiEmergenciesCountEmergenciesPerRangeSelectArea(:houres);
        const [results, metadata] = await SYS.mariadb.sequelize.query('call aiEmergenciesCountEmergenciesPerRangeSelectArea(:houres);', {
            raw: true,
            replacements: {
                houres: (60 * 60) * validateJoiForm.value.houres
            }
        })


        res.send({
            status: 'ok'
        })
    }








}





module.exports = MapAi
