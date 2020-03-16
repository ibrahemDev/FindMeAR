
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
export default function MapAi () {
    const classes = useStyles()
  return (
    <React.Fragment>
      <CssBaseline />
      <Container fixed>
        <main className={classes.content}>
            <div className={classes.toolbar} />
                map
        </main>


      </Container>
    </React.Fragment>
  )
}
