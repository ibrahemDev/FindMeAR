import React, { useState, useEffect  } from 'react'
import { v4 as uuidv4 } from 'uuid';
import {
  Link,
  Redirect
} from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardActions,
  CardContent,

  Divider,
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Grid
} from '@material-ui/core'
import axios from "axios";

import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import InfoIcon from '@material-ui/icons/Info'







const Joi = require('@hapi/joi')

const useStyles = makeStyles(theme => ({
  link: {
    color: '#2097ff',
    cursor: 'pointer'
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },

}))
/* const renderErrors = (_errors) => {

    const Errors = _errors.map((error) => {
      return (
        <div>
            <div key={uuidv4()}>{error}</div>
        </div>
      );
    });


    return (
      {Errors}
    );
  } */
const JoiForm = Joi.object({
  phone: Joi.string().min(10).max(10).pattern(new RegExp('^05[0-9]{8}$')).label('Phone number')

})
const buildUsefulErrorObject = (errors) => {
  const usefulErrors = []
  errors.map((error) => {
    usefulErrors.push(error)
  })
  return usefulErrors
}

const joiCheck = (schema, data) => {
  const validate = schema.validate(data, { abortEarly: false })
  const obj2 = {}
  obj2.errors = validate.error ? buildUsefulErrorObject(validate.error.details) : null
  obj2.value = validate.value
  return obj2
}
function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}
function PhoneNumber ({ values, setValues, setFormType, alert, setAlert, updateUserID, setPhoneCode}) {

  const [open, setOpen] = React.useState(false)
  const [errors, setErrors] = React.useState([])


  const [modalStyle] = React.useState(getModalStyle)
  const classes = useStyles()
  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleChange = event => {
    const validateJoiForm = joiCheck(JoiForm, {
      [event.target.name]: event.target.value
    })
    if (validateJoiForm.errors) {
        const arr = []

        for(var key in validateJoiForm.errors)
            arr.push(validateJoiForm.errors[key].message)
        setErrors(arr)
    }
    else
    {
        setErrors([])
    }

    setValues({
      ...values,
      [event.target.name]: event.target.value
    })
  }

   useEffect(() => {

    const validateJoiForm = joiCheck(JoiForm, {
        ['phone']: values.phone
      })

    if (validateJoiForm.errors) {
        const arr = []

        for(var key in validateJoiForm.errors)
            arr.push(validateJoiForm.errors[key].message)
        setErrors(arr)
    }
    else
    {
        setErrors([])
    }


  }, []);



const api_access = async () => {
    try {
        // res.data
        let res = await axios.post("/api/access/", {
            phone_number: (+values.phone)+'',
            type: 'admin'
        })

        console.log(res.data)


        if (res.data.status == 'ok') {
          setAlert({
            msg: 'success we will send code to your phone ',
            open:true,
            type:'success' // success
          })


          // updateUserID(1)
          setTimeout(()=>{
            setFormType('CODE_SMS')
          }, 3500)

          let res_phone_code = await axios.get("/api/phone_code/")
          if (res_phone_code.data.status === 'ok')
            setPhoneCode(res_phone_code.data._code_debug)

          //res_phone_code.data.status == 'ok'

          //setPhoneCode
        }
        else {
          setAlert({
            msg: 'error your phone not found',
            open:true,
            type:'error'
          })

        }



    } catch (e) {

    }





};

  return (

    <Paper >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader subheader="input your Phone Number and wite sms code :)" title="Login using Phone Number" />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={11}
              xs={11}
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
            <Grid
              item
              md={1}
              xs={1}

            >
            {errors.length ? (
            <IconButton onClick={handleOpen} edge="start" className={classes.menuButton} aria-label="menu">
            <InfoIcon style={{
                color:'#f00'
            }} />
          </IconButton>) : (<></>)}

            </Grid>
          </Grid>

        </CardContent>
        <Divider />
        <Divider />
        <CardActions>

        <Button
            color="primary"
            variant="contained"
            disabled={ Boolean(errors && errors.length)}
            onClick = {() => {
                api_access()
        }}>
          submit
        </Button>
        </CardActions>
        <CardActions>
          <span className={classes.link} onClick={() => {
            setFormType('CODE_SMS')
          }} >you have code alrdy ?</span>
        </CardActions>
      </form>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open}
        onClose={handleClose}
      >
          <div style={modalStyle} className={classes.paper}>

                    {errors && errors.length && errors.map((error) => {

                       return  (<div key={uuidv4()}><div >{error}</div><br /></div>)
                    } ) }



        </div>
      </Modal>
    </Paper>

  )
}

//

export default PhoneNumber
