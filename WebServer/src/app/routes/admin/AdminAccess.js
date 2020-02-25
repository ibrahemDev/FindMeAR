const Joi = require('@hapi/joi')



// SequelizeStore

class AdminAccess {

    /**
     *  describe what happened here
     */
    constructor () {
        const self = this



        SYS.restifyWebServer.httpsServer.post('/api/admin/access/', [
            SYS.restifyWebServer.middlewares.OptimizeUrl(),
            SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
            SYS.restifyWebServer.middlewares.session(),
            SYS.restifyWebServer.middlewares.formidable(),
            // check is login or not
            (req, res, next) => {
                if (req.session.db && req.session.db.user_id && typeof req.session.db.role_id === 'number') {
                    res.send({
                        status: 'failed',
                        msg: 'Already Access Logout and then you can access',
                        code: 'ALREADY_ACCESS'
                    })
                } else {
                    next()
                }
            },
            this._post.bind(self)
        ])



        this.JoiObject = Joi.object({
            phone_number: Joi.string().min(9).max(9).pattern(new RegExp('^5[0-9]{8}$')).label('Phone number')
        }).label('Form')




    }

    /**
     *
     * @param {*} schema
     * @param {*} data
     */
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




    /**
     *
     * @param {*} req
     * @param {*} phoneNumber
     */
    async accessByPhoneNumber (req, phoneNumber) {
        const randomCode = this.random(100000, 999999) // Math.floor(Math.random() * 999999)
        const expires = new Date(Date.createDateTimeZone('Asia/Riyadh').getTime() + 1000 * 60 * 10).getTime() // 10 min
        const user = await SYS.mariadb.models.get('Users').findOne({
            where: {
                phone_number: Number.parseInt(phoneNumber, 10)
            }
        })



        if (user == null) {
            return {
                phoneCode: false,
                user_undefind: true,
                isAdmin: false
            }
        } else {


            // check if have Permissions
            let isAdmin = await SYS.mariadb.models.get('RoleUser').count({
                where: {
                    user_id: user.dataValues.id,
                    role_id: 1
                }
            })
            isAdmin = Boolean(isAdmin)


            if (isAdmin) {
                req.session.checkPhoneCode = {
                    type: 'ACCESS_BY_PHONE_NUMBER',
                    code: randomCode,
                    expires: expires,
                    user_id: user.dataValues.id,
                    role_id: 1 // admin
                }
            }


            return {
                phoneCode: isAdmin,
                user_undefind: false,
                isAdmin: isAdmin
            }

        }



    }

    random (min, max) { // min and max included
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    /**
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async _post (req, res, next) {



        const validate = this.joiParseErrors(this.JoiObject, req.body.fields)

        if (validate != null) {
            const arr = []
            validate.forEach((item) => {
                var cache = {

                    lable: item.context.label,
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




            const access = await this.accessByPhoneNumber(req, req.body.fields.phone_number)

            if (access.isAdmin && access.phoneCode) {
                res.send({
                    status: 'ok',
                    msg: 'wait phone code'
                })
            } else {
                res.send({
                    status: 'failed',
                    msg: 'failed access',
                    code: 'FAILED_ACCESS'

                })
            }






        }





    }
}


module.exports = AdminAccess
