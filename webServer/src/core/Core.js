const cluster = require('cluster')



const Routes = require('../app/routes/Routes')

const Thread = require('./Thread')
const Logger = require('./Logger')
const RestifyWebServer = require('./RestifyWebServer')
const Mariadb = require('./Mariadb/Mariadb')


module.exports = async (options) => {
    if (options.constructor !== ({}).constructor) {
        throw new Error('server without options can\'t work ')
    }

    // cluster host :) for powr full server
    const thread = new Thread(options)
    if (cluster.isMaster && thread.isRequired) {
        thread.init()
    } else {
        global.SYS = {}
        SYS.thread = thread
        SYS.ROOTPATH = process.cwd()
        SYS.isDebug = (typeof options.isDebug === 'boolean') ? options.isDebug : false
        SYS.TimeZone = (typeof options.TimeZone === 'string') ? options.TimeZone : 'Asia/Riyadh'
        // logger :)
        SYS.logger = new Logger(options)
        SYS.logger.init() // TODO async/await


        // database
        SYS.mariadb = new Mariadb(options)
        await SYS.mariadb.init()


        // web server
        SYS.restifyWebServer = new RestifyWebServer(options)
        // web server Routes
        SYS.restifyWebServer.routes = new Routes()
        await SYS.restifyWebServer.start()


        // start mariadb after load all webserver routes
        await SYS.mariadb.start(0) // miliscand if 0 will loop and stop after connected :)

        if (SYS.mariadb.isSequelizeSync && SYS.mariadb.isDatabaseCreated) {

            // wait 1 sec if not wait we have problem :( :/ bad code :(
                // this code find roles if not found create it :)
                // and create paramedic and admin account
            setTimeout(async () => {
                const arr = ['admin', 'injured', 'paramedic']
                for (let i = 0; i < arr.length; i++) {
                    const val = arr[i]

                    const [user, created] = await SYS.mariadb.models.get('Roles').findOrCreate({
                        where: { role: val },
                        defaults: {
                            role: val,
                            description: '',
                            is_active: true

                        }
                    })
                }



                const [user, isUserCreatedNow] = await SYS.mariadb.models.get('Users').findOrCreate({

                    where: { device_id: 'ssssssssssssssssssswAdmin' },
                    defaults: {
                        device_id: 'ssssssssssssssssssswAdmin',
                        phone_number:568568568
                    }
                })


                const [RoleUser, isRoleUserCreated] = await SYS.mariadb.models.get('RoleUser').findOrCreate({

                    where: { role_id: 1, user_id: user.dataValues.id },
                    defaults: {
                        role_id: 1,
                        user_id: user.dataValues.id
                    }
                })



                //
                const [_user, _isUserCreatedNow] = await SYS.mariadb.models.get('Users').findOrCreate({

                    where: { device_id: 'ssssssssssssssssssswParamidec' },
                    defaults: {
                        device_id: 'ssssssssssssssssssswParamidec',
                        phone_number:568568566
                    }
                })

                const [_RoleUser, _isRoleUserCreated] = await SYS.mariadb.models.get('RoleUser').findOrCreate({

                    where: { role_id: 2, user_id: _user.dataValues.id },
                    defaults: {
                        role_id: 2,
                        user_id: _user.dataValues.id
                    }
                })


            }, 1000)

            // here load sql file and instal Procedures and events only and that help for ai and auto respon paramedic for injurid :)
            await SYS.mariadb.inistallManyProcedures()
        }
    }
}
