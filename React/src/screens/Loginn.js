
import React, { useState } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,
  Avatar,
  Typography,
  Divider,
  Button,
  LinearProgress
} from '@material-ui/core'

import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import FormLabel from '@material-ui/core/FormLabel'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  },
  _padding: {
    padding: '0 45px'
  }

}))




function Login ({ selectUserID, updateUserID }) {
    const [values, setValues] = useState({
        phone: '',
    })
  const classes = useStyles()
  const handleChange = event => {


    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>

      <CssBaseline />
      <Container fixed>

        <Paper >
          <form
            autoComplete="off"
            noValidate
          >
            <CardHeader subheader="input your Phone Number and wite sms code :)" title="Access" />
            <Divider />
            <CardContent>
              <Grid
                container
                spacing={3}
              >
                <Grid
                  item
                  md={12}
                  xs={12}
                >
                  <TextField
                    fullWidth
                    helperText="Please input your phone number"
                    label="Phone Number"
                    margin="dense"
                    name="phone"
                    onChange={handleChange}
                    required
                    value={values.phone}
                    variant="outlined"
                  />
                </Grid>

              </Grid>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                color="primary"
                variant="contained"
              >
            submit
              </Button>
            </CardActions>
            <CardActions>
             <a href={"javascript:void(0);" } >you have code alrdy ?</a>
            </CardActions>
          </form>
        </Paper>



      </Container>
    </React.Fragment>

  )
}

const CheckISAdmin = ({ selectUserID, updateUserID }) => {
  return (
    <div>
      {selectUserID
        ? <Redirect to='/' />
        : <Login />
      }

    </div>
  )
}

export default CheckISAdmin
