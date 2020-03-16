import React from 'react'
import loadable from "@loadable/component";
// import Tt from "Tt";
// import Tt from './t.js'
//import a from '../../sys_apps/Install/t.js'

const semver = require('semver')


/*
const LoadableComponent = loadable(() => import('../../sys_apps/Install/t.js') , {
    fallback: (<h1>waite please</h1>)
});*/

/*
setTimeout(() => {
     import('../../sys_apps/Install/t.js').then((d) => {
        d.default(semver)
    })
    //a()
}, 3000)
*/



class Home extends React.Component {

    constructor () {
        super()


    }

    render () {
        return <div>
            <Tt />

        </div>
    }
}


export default Home
