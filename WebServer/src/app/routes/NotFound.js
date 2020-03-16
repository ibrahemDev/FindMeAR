const contents = require('../../contents')
const Permissions = require('../middlewares/Permissions')
const restify = require('restify')
const Joi = require('@hapi/joi')



class NotFound {
    constructor(){
        SYS.restifyWebServer.httpsServer.get('*',[
                SYS.restifyWebServer.middlewares.MariadbConnectionTest(),
                SYS.restifyWebServer.middlewares.session(),
                Permissions([

                    contents.PERMISSIONS.ADMIN,
                    contents.PERMISSIONS.GUEST
                ], (req, res, next) => {
                    const html = this.pageNotFound()
                     res.writeHead(200, {
                        'Content-Length': Buffer.byteLength(html),
                        'Content-Type': 'text/html'
                    })
                    res.write(html)
                    res.end()
                }),
                (req, res, next) => {

                    let user = false
                    if(req.session.db && req.session.db.user_id) {
                        user = true
                    }


                    const html = this.html(user)
                     res.writeHead(200, {
                        'Content-Length': Buffer.byteLength(html),
                        'Content-Type': 'text/html'
                    })
                    res.write(html)
                    res.end()
                }
        ])
    }
    pageNotFound () {
        return `
            <html lang='en'>
                <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
                    <title>Page Not Found 404</title>
                    </style>
                </head>
                <body style="margin: 0px;">
                    <h1>Page Not Found 404</h1>

                </body>
            </html>
        `
    }
    html(user){
        let _user = false;
        if(user)
            _user = true //JSON.stringify(user).replace(/</g,'\\u003c');

        return `
            <html lang='en'>
                <head>
                    <meta charset='utf-8'>
                    <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no'>
                    <title>Dashboard</title>

                    <script src="https://maps.googleapis.com/maps/api/js?key=https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&language=en&key=AIzaSyB2kFRFx2lyV6j6_5kNWcv0y7wdgFfIjsA"></script>
                    <!--<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_GOES_HERE"></script>-->
                    </style>
                </head>
                <body style="margin: 0px;">
                    <div id='root'></div>

                    <script>
                        window._user_ = ${user}
                    </script>
                    <script src='/public/bundles/bundle.js' async></script>

                </body>
            </html>
        `
    }
}



module.exports = NotFound
