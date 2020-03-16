
import React, { useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

import { makeStyles } from '@material-ui/core/styles'
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 500
  },

  floor: {
    'text-align': 'center',
    color: '#5254ae',
    'font-size': '12em',
    'font-weight': 'bold',
    'font-family': 'Helvetica',
    'text-shadow': '0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa,  0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1),  0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)'

  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}))
export default function NotFound () {
    const classes = useStyles()
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
      <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.floor}>404</div>
        </main>


      </Container>
    </React.Fragment>
  )
}
