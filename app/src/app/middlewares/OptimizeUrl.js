// OptimizeUrl


var url = require('url')

const ALL_METHODS = ['get', 'head', 'post', 'put', 'patch', 'del']





const findMethod = (arr, str) => {

    for (const i in arr)
        if (arr[i] === str)
            return true

    return false
}

const methodOptimaize = (methods) => {
    if (methods) {
        if (typeof methods === 'string') {
            if (methods === '*') {
                return ALL_METHODS
            } else
                return methodOptimaize(methods.split(','))
        } else if (Array.isArray(methods) && methods.length) {
            const a = []
            for (const i in methods)
                if (methods[i] && typeof methods[i] === 'string') {
                    const methodLowerCase = methods[i].toLowerCase()
                    if (findMethod(ALL_METHODS, methodLowerCase))
                        a.push(methodLowerCase)
                }

            return a
        } else if (typeof methods === 'function')
            return methods
        else
            return methodOptimaize()
    } else
        return ALL_METHODS
}






module.exports = (options) => {

    const opts = ((options && {}.constructor === options.constructor) ? options : {}) || {}


    let _statusCode = (opts.statusCode && ((typeof opts.statusCode === 'number' && opts.statusCode > 0 && opts.statusCode < 600) || typeof opts.statusCode === 'function') ? opts.statusCode : 301) || 301

    let _type = ((opts.type && (typeof opts.type === 'function' || (typeof opts.type === 'string' && (opts.type === 'remove' || opts.type === 'add')))) ? opts.type : 'add') || 'add'








    const _skip = ((opts.skip && (typeof opts.skip === 'function' || typeof opts.skip === 'boolean')) ? opts.skip : false) || false


    let _methods = methodOptimaize(opts.methods)


    return (req, res, next) => {
        if (typeof _skip === 'function' && _skip(req, res))
            return next()



        const method = req.method.toLowerCase()



        if (typeof _type === 'function') {
            _type = _type(req, res)
            _type = ((_type && (typeof _type === 'string' && (_type === 'remove' || _type === 'add'))) ? _type : 'add') || 'add'
        }

        if (typeof _methods === 'function') {
            _methods = _methods(req, res)
            _methods = methodOptimaize(_methods)
            if (typeof _methods === 'function')
                throw new Error('arg Overloop')
        }

        if (!findMethod(_methods, method))
            return next()

        if (typeof _statusCode === 'function') {
            _statusCode = _statusCode(req, res)

            if (typeof _statusCode === 'function')
                throw new Error('arg Overloop')
        }

        const _url = url.parse(req.url)
        let pathname = _url.pathname
        const search = _url.search || ''
        const notHasSlash = pathname.charAt(pathname.length - 1) !== '/'

        const isHasMultiSlash = /\/\/+/g.test(pathname)


        pathname = isHasMultiSlash ? pathname.replace(/\/\/+/g, '/') : pathname

        if (_type === 'add') {
            if (notHasSlash)
                pathname = pathname + '/'



            if (notHasSlash || isHasMultiSlash) {
                res.statusCode = _statusCode
                return res.redirect(pathname + search, next)
            }

            return next()
        } else if (_type === 'remove') {
            if (!notHasSlash && isHasMultiSlash) {
                if (!notHasSlash)
                    pathname = pathname.slice(0, -1)


                if (!notHasSlash || isHasMultiSlash) {
                    res.statusCode = _statusCode
                    return res.redirect(pathname + search, next)
                }




            }



            return next()
        } else {
            return next()
        }









    }


}
