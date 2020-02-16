const Joi = require('@hapi/joi')
const formidable = require('formidable')




/**
 *
 */
class CreateEmergencie {
    constructor () {
        const self = this


        SYS.restifyWebServer.httpsServer.post('/api/injured/emergencie/create/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            this._post.bind(self)
        ])


        this.JoiObject = Joi.object({
            title: Joi.string().empty().min(0).max(255).required().label('Title'),
            description: Joi.string().empty().min(0).max(1000).required().label('Description'),
            lat: Joi.number().required().label('Lat'),
            long: Joi.number().required().label('Long'),
            is_static: Joi.boolean().required().label('is Static')
        }).label('Form')
    }

    joiParseErrors (schema, data) {

        var errors = schema.validate(data, { abortEarly: false })

        const buildUsefulErrorObject = (errors) => {
            const usefulErrors = []
            errors.map((error) => {
                usefulErrors.push(error)
            })
            return usefulErrors
        }



        return errors.error
            ? buildUsefulErrorObject(errors.error.details)
            : null
    }





    async _post (req, res, next) {

        //console.dir(req.session)
        if (req.session.db && req.session.db.user_id && req.session.db.role_id === 2) {


            const validate = this.joiParseErrors(this.JoiObject, req.body.fields)

            if (validate != null) {
                const arr = []
                validate.forEach((item) => {

                    var cache = {

                        ...item.context,
                        msg: item.message,
                        code: item.type

                    }
                    arr.push(cache)
                })


                res.send({
                    status: 'failed',
                    msg: 'form error',
                    code: 'FORM_ERROR',
                    form: arr

                })
            } else {
                console.dir(validate)
                const emergency = await SYS.mariadb.models.get('Emergency').create({
                    user_id: req.session.db.user_id,
                    employee_id: null,
                    title: req.body.fields.title,
                    description: req.body.fields.description,
                    lat: req.body.fields.lat,
                    long: req.body.fields.long,
                    is_static: req.body.fields.is_static,
                    status: 1, // 1 == live , 2 == close

                    status_msg: 'no respone'

                })

                if (emergency != null) {
                    res.send({
                        status: 'ok',
                        msg: 'emergencie created',
                        emergency: {
                            id: emergency.dataValues.id,
                            title: emergency.dataValues.title,
                            description: emergency.dataValues.description,
                            lat: emergency.dataValues.lat,
                            long: emergency.dataValues.long,
                            is_static: emergency.dataValues.is_static,
                            status: emergency.dataValues.status,
                            status_msg: emergency.dataValues.status_msg
                        }
                    })

                } else {
                    res.send({
                        status: 'failed',
                        msg: 'unKnow' // database error
                    })
                }




            }








            // console.log(jane.toJSON()); // This is good!
            // console.log(JSON.stringify(jane, null, 4)); // This is also good!






        } else {
            res.send({
                status: 'failed',
                message: 'Route Not Found',
                code: 'ROUTE_NOT_FOUND'
            })
        }


    }

}


module.exports = CreateEmergencie
