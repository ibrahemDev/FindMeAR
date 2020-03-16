const cluster = require('cluster')



const Routes = require('../app/routes/Routes')

const Thread = require('./Thread')
const Logger = require('./Logger')
const RestifyWebServer = require('./RestifyWebServer')
const Mariadb = require('./Mariadb/Mariadb')


/**
 *
 */
module.exports = async (options) => {

    if (options.constructor !== ({}).constructor) {
        throw new Error('server without options can\'t work ')
    }



    const thread = new Thread(options)

    if (cluster.isMaster && thread.isRequired) {
        thread.init()
    } else {
        global.SYS = {}
        SYS.thread = thread
        SYS.ROOTPATH = process.cwd()
        SYS.isDebug = (typeof options.isDebug === 'boolean') ? options.isDebug : false
        SYS.TimeZone = (typeof options.TimeZone === 'string') ? options.TimeZone : 'Asia/Riyadh'
        SYS.logger = new Logger(options)
        SYS.logger.init() // TODO async/await



        SYS.mariadb = new Mariadb(options)
        await SYS.mariadb.init()
        SYS.restifyWebServer = new RestifyWebServer(options)


        SYS.restifyWebServer.routes = new Routes()








        // SYS.restifyWebServer.init() // TODO async/await

        // loading route before start webserver


        await SYS.restifyWebServer.start()



        await SYS.mariadb.start(0) // miliscand if 0 will loop and stop after connected



        if (SYS.mariadb.isSequelizeSync && SYS.mariadb.isDatabaseCreated) {

            // wait 1 sec if not wait we have problem :(
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

            }, 1000)












            // SYS.restifyWebServer.SequelizeStore.createProcedureGet(true)
            /// SYS.restifyWebServer.SequelizeStore.createProcedureSet(true)
            // SYS.restifyWebServer.SequelizeStore.createEventRemoveAllExpiredSession()

            await SYS.mariadb.inistallManyProcedures()










        }






    }








}
