
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
import PhoneNumber from './components/PhoneNumber'
import CodeSms from './components/CodeSms'
import { Alert, AlertTitle } from '@material-ui/lab';

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: 200
    }
  },
  _padding: {
    padding: '0 45px'
  },
  content: {
    flexGrow: 1,
    //padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },

}))




function Login ({ selectUserID, updateUserID }) {
const [alert, setAlert] = useState({
    msg: '',
    open:false,
    type:'error' // success
  })

    const [values, setValues] = useState({
        phone: '',
        code: ''
    })
  const [formType, setFormType] = useState("PHONE_NUMBER")
  const [phoneCode, setPhoneCode] = useState(0)

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
        {alert.open ? (<Alert action={
          <Button color="inherit" size="small" onClick={() => {
            setAlert({
              ...alert,
              open: false
            })
          }}>
            UNDO
          </Button>
        } severity={alert.type}>
        <AlertTitle>{alert.type}</AlertTitle>
        {alert.msg}
      </Alert>) : (<></>) }

        {(formType === 'PHONE_NUMBER') ? (<PhoneNumber setPhoneCode={setPhoneCode} updateUserID={updateUserID} alert={alert} setAlert={setAlert} values={values} setValues={setValues} setFormType={setFormType} />) : (<CodeSms alert={alert} setAlert={setAlert} updateUserID={updateUserID} phoneCode={phoneCode} values={values} setValues={setValues} setFormType={setFormType} />)}




      </Container>
    </React.Fragment>

  )
}
/*
    "status": "ok",
    "msg": "Wait Phone Code",
    "code": "WAIT_PHONE_CODE",
    "_code_debug": 552557


*/
const CheckISAdmin = ({ selectUserID, updateUserID }) => {
  const classes = useStyles()
  return (
    <main className={classes.content}>
          <div className={classes.toolbar} />


    <div>
      {selectUserID
        ? <Redirect to='/' />
        : <Login selectUserID={selectUserID} updateUserID={updateUserID} />
      }

    </div>
    </main>
  )
}

export default CheckISAdmin
