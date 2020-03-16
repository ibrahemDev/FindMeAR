const presets = [
    [
        "@babel/env",
        {
          "useBuiltIns": "entry",
          "targets": {
            "browsers": "> 1%, not ie 11, not op_mini all",
            "node": 10
          }
        }
    ],
    "@babel/react"
]
const plugins = [
    "@babel/plugin-syntax-dynamic-import",
    [
        'babel-plugin-import',
        {
            'libraryName': '@material-ui/core',
            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
            'libraryDirectory': 'es',
            'camel2DashComponentName': false
        },
        'core'
    ],
    [
        'babel-plugin-import',
        {
            'libraryName': '@material-ui/icons',
            // Use "'libraryDirectory': ''," if your bundler does not support ES modules
            'libraryDirectory': 'es',
            'camel2DashComponentName': false
        },
        'icons'
    ]
]




module.exports = {presets,plugins};