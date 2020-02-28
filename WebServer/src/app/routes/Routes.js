// SYS.restifyWebServer



// todo
/**
 * employee_lat
employee_long
 *
 *
 */

const contents = require('../../contents')


// injured
const InjuredAccess = require('./injured/InjuredAccess')
const CreateEmergencie = require('./injured/CreateEmergencie')
const EditEmergencie = require('./injured/EditEmergencie')
const GetEmergencies = require('./injured/GetEmergencies')

// admin
const AdminAccess = require('./admin/AdminAccess')
const GetAllUsers = require('./admin/GetAllUsers')
const GetUserById = require('./admin/GetUserById')
const AdminGetAllEmergencies = require('./admin/AdminGetAllEmergencies')
const AdminGetEmergencieById = require('./admin/AdminGetEmergencieById')
const AdminAddUserRole = require('./admin/AdminAddUserRole')
const AdminDelUserRole = require('./admin/AdminDelUserRole')

// paramedic

const ParamedicGetEmergencieInfo = require('./paramedic/ParamedicGetEmergencieInfo')
const ParamedicUpdateEmergencie = require('./paramedic/ParamedicUpdateEmergencie')

// readEmergencieInformation
// update stutse and location
// checkEmergencie




// const PhoneCode = require('./PhoneCode')
const Emergencie = require('./api/Emergencie_.js')
const Access = require('./api/Access_')
const PhoneCode = require('./api/PhoneCode_')
const Account = require('./api/Account_')







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
        this.emergencie = new Emergencie()


        // https://127.0.0.1:3000/api/emergencie/1/
        SYS.restifyWebServer.httpsServer.get('/api/emergency/:id/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.ADMIN,
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC
            ]),
            this.emergencie.getById.bind(this.emergencie)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/emergency/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.PARAMEDIC
            ]),
            this.emergencie.get.bind(this.emergencie)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/emergencies/', [
            ...this.emergencie.middlewares('get', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN
            ]),
            this.emergencie.getAll.bind(this.emergencie)
        ])

        SYS.restifyWebServer.httpsServer.post('/api/emergency/', [
            ...this.emergencie.middlewares('post', [
                contents.PERMISSIONS.INJURED
            ]),
            this.emergencie.post.bind(this.emergencie)
        ])

        SYS.restifyWebServer.httpsServer.put('/api/emergency/:id/', [
            ...this.emergencie.middlewares('post', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC
            ]),
            this.emergencie.putById.bind(this.emergencie)
        ])


        this.access = new Access()




        SYS.restifyWebServer.httpsServer.post('/api/access/', [
            ...this.access.middlewares('post', [
                contents.PERMISSIONS.GUEST

            ]),
            this.access.post.bind(this.access)
        ])
        SYS.restifyWebServer.httpsServer.get('/api/isAccess/', [
            ...this.access.middlewares('get', [
                contents.PERMISSIONS.GUEST,
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN

            ]),
            this.access.getIsAccess.bind(this.access)
        ])


        this.phoneCode = new PhoneCode()
        SYS.restifyWebServer.httpsServer.post('/api/phone_code/', [
            ...this.phoneCode.middlewares([
                contents.PERMISSIONS.GUEST
            ]),
            this.phoneCode.post.bind(this.phoneCode)
        ])


        SYS.restifyWebServer.httpsServer.get('/api/phone_code/', this.phoneCode.get([
            contents.PERMISSIONS.GUEST
        ]))


        this.account = new Account()
        SYS.restifyWebServer.httpsServer.get('/api/account/', [
            ...this.account.middlewares('get', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN

            ]),
            this.account.get.bind(this.account)
        ])

        SYS.restifyWebServer.httpsServer.put('/api/account/', [
            ...this.account.middlewares('put', [
                contents.PERMISSIONS.INJURED,
                contents.PERMISSIONS.PARAMEDIC,
                contents.PERMISSIONS.ADMIN

            ]),
            this.account.putSelf.bind(this.account)
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
        this.adminDelUserRole = new AdminDelUserRole()
        // .....
        this.paramedicGetEmergencieInfo = new ParamedicGetEmergencieInfo()
        this.paramedicUpdateEmergencie = new ParamedicUpdateEmergencie()


        SYS.restifyWebServer.httpsServer.put('/api/paramedic/emergencie/:id/', [
            ...this.paramedicUpdateEmergencie.middlewares,
            this.paramedicUpdateEmergencie.put.bind(this.paramedicUpdateEmergencie)
        ])





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

