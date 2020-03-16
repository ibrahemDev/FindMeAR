
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import configureStore from './store'

import App from './App'

// const render = (module.hot === true) ? ReactDOM.render : ReactDOM.hydrate

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById('root'))
