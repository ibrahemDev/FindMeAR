
import React, { useState, useEffect } from 'react'
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
  Modal
} from '@material-ui/core'

import TextField from '@material-ui/core/TextField'
import { makeStyles } from '@material-ui/core/styles'
import InfoIcon from '@material-ui/icons/Info'

import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
const Joi = require('@hapi/joi')
const useStyles = makeStyles(theme => ({
    link:{
        color: "#2097ff",
        cursor: "pointer"
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

function getModalStyle () {
  const top = 50
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}


const JoiForm = Joi.object({
  code: Joi.string().min(6).max(6).pattern(new RegExp('^[0-9]{6}$')).label('code')
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


const apiPostPhoneCode = async (props) => {

  const { values, setValues, setFormType, phoneCode, updateUserID, setAlert } = props;


  try {
      // res.data
      let res = await axios.post("/api/phone_code/", {
        phone_code: values.code,

      })
      console.log(res.data)



      if (res.data.status == 'ok') {

        setAlert({
          msg: 'success logged :) ',
          open:true,
          type:'success' // s uccess
        })


        // updateUserID(1)

        setTimeout(()=>{
          updateUserID({id:true})
        },3500)





      }
      else {
        setAlert({
          msg: 'error your code error',
          open:true,
          type:'error'
        })

      }



  } catch (e) {

  }


}





function CodeSms (props) {

    const { values, setValues, setFormType, phoneCode } = props;



    const classes = useStyles()
    const [errors, setErrors] = React.useState([])
    const [open, setOpen] = React.useState(false)
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

  const [modalStyle] = React.useState(getModalStyle)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  useEffect(() => {

    const validateJoiForm = joiCheck(JoiForm, {
        ['code']: values.code
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
  return (

    <Paper >
      <form
        autoComplete="off"
        noValidate
      >
        <CardHeader subheader="" title={(phoneCode) ? phoneCode:''} />
        <CardHeader subheader="input code from sms in your phone :)" title={"complete login input your code  "} />
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
                helperText="Please input code"
                label="code"
                margin="dense"
                name="code"
                onChange={handleChange}
                required
                value={values.code}
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
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={()=>{

              apiPostPhoneCode(props)

            }}
          >
            submit
          </Button>
        </CardActions>
        <CardActions>
          <span className={classes.link} onClick={() => {
            setFormType("PHONE_NUMBER")

          }} >update phone number ?</span>
        </CardActions>
      </form>
      <Modal
        aria-labelledby="simple-modal-titlee"
        aria-describedby="simple-modal-descriptionn"
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




export default CodeSms
