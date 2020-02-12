const cluster = require('cluster')



const Thread = require('./Thread')
const Logger = require('./Logger')
const RestifyWebServer = require('./RestifyWebServer')
const Mariadb = require('./Mariadb/Mariadb')

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
        SYS.restifyWebServer = new RestifyWebServer(options)



        await SYS.mariadb.init()





        // SYS.restifyWebServer.init() // TODO async/await



        await SYS.restifyWebServer.start()



        await SYS.mariadb.start(0) // miliscand if 0 will loop and stop after connected









        /*
        await SYS.mariadb.init()
        SYS.mariadb.start()
        await (async () => {
            await SequelizeStore.createProcedureGet(false)
            await SequelizeStore.createProcedureSet(false)
            await SequelizeStore.createEventRemoveAllExpiredSession(false)

        })()


        SYS.restify = new Restify() */



    }








}
