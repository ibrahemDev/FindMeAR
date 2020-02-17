// SYS.restifyWebServer



const InjuredAccess = require('./injured/InjuredAccess')
const CreateEmergencie = require('./injured/CreateEmergencie')
const EditEmergencie = require('./injured/EditEmergencie')
const GetEmergencies = require('./injured/GetEmergencies')


const AdminAccess = require('./admin/AdminAccess')
const GetAllUsers = require('./admin/GetAllUsers')
const GetUserById = require('./admin/GetUserById')
const AdminGetAllEmergencies = require('./admin/AdminGetAllEmergencies')
const AdminGetEmergencieById = require('./admin/AdminGetEmergencieById')

const AdminAddUserRole = require('./admin/AdminAddUserRole')
// const AdminDelUserRole
// const AdminUpdateUserRole





const PhoneCode = require('./PhoneCode')








class Routes {
    constructor () {

        this.restify = SYS.restifyWebServer


        SYS.restifyWebServer.httpsServer.get('*', [
            SYS.restifyWebServer.middlewares.OptimizeUrl({
                type: 'add', // add slash last url
                statusCode: 301, // this for redirect
                skip: false, //
                methods: 'get,head', // work with this methods
                beforeRedirect: () => {
                    // log
                }
            }),
            this._pageNotFound.bind(this)
        ])


        SYS.restifyWebServer.httpsServer.get('/api/*', SYS.restifyWebServer.middlewares.OptimizeUrl({
            type: 'add', // add slash last url
            statusCode: 301, // this for redirect
            skip: false, //
            methods: 'get,head', // work with this methods
            beforeRedirect: () => {
                // log
            }
        }), this._apiNotFound.bind(this))

        // injured routes
        this.injuredAccess = new InjuredAccess()
        this.createEmergencie = new CreateEmergencie()
        this.editEmergencie = new EditEmergencie()
        this.getEmergencies = new GetEmergencies()

        // admin routes
        this.adminAccess = new AdminAccess()
        this.getAllUsers = new GetAllUsers()
        this.getUserById = new GetUserById()
        this.adminGetAllEmergencies = new AdminGetAllEmergencies()
        this.adminGetEmergencieById = new AdminGetEmergencieById()
        this.adminAddUserRole = new AdminAddUserRole()
        // .....

        // common routes
        this.phoneCode = new PhoneCode()
    }

    _apiNotFound (req, res, next) {
        return this.apiNotFound(req, res, next)
    }

    apiNotFound (req, res, next) {
        res.send({
            status: 'failed',
            message: 'Route Not Found',
            code: 'ROUTE_NOT_FOUND'
        })
        // next()
    }




    _pageNotFound (req, res, next) {
        return this.pageNotFound(req, res, next)
    }

    pageNotFound (req, res, next) {
        res.header('Content-Type', 'text/html')
        res.end('<h1>page Not Found</h1>')
        // res.send('<h1>page Not Found</h1>')


        // next()
    }
}


module.exports = Routes

