const Joi = require('@hapi/joi')





/**
 *
 */
class EditEmergencie {
    constructor () {
        const self = this


        SYS.restifyWebServer.httpsServer.post('/api/injured/emergencie/edit/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            this._post.bind(self)
        ])


        this.JoiObject = Joi.object({
            id: Joi.number().id().required().label('id'),
            title: Joi.string().empty().min(0).max(255).label('Title'),
            description: Joi.string().empty().min(0).max(1000).label('Description'),
            lat: Joi.number().label('Lat'),
            long: Joi.number().label('Long'),
            is_static: Joi.boolean().label('is Static')
        }).min(2).label('Form')
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
                const jsonUpdate = {}

                for (var key in req.body.fields) {

                    if (key !== 'id')
                        jsonUpdate[key] = req.body.fields[key]
                }


                const emergency = await SYS.mariadb.models.get('Emergency').update(jsonUpdate, {
                    where: {
                        id: req.body.fields.id,
                        user_id: req.session.db.user_id

                    }
                })



                if (emergency[0] === 1) {
                    res.send({
                        status: 'ok',
                        msg: 'emergencie updated'
                    })

                } else {
                    res.send({
                        status: 'failed',
                        msg: 'emergencie not found to update' // database error
                    })
                }




            }










        } else {
            res.send({
                status: 'failed',
                message: 'Route Not Found',
                code: 'ROUTE_NOT_FOUND'
            })
        }


    }

}


module.exports = EditEmergencie
