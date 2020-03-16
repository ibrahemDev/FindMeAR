import React, { useState, useEffect } from 'react'
/*import CssBaseline from '@material-ui/core/CssBaseline'


import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import Container from '@material-ui/core/Container'
import { GoogleMap, DrawingManager } from '@react-google-maps/api'


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
  Grid,
  TextField
} from '@material-ui/core' */
import { makeStyles } from '@material-ui/core/styles'
import axios from "axios";
import {
  Paper,
  CardHeader,
  CardActions,
  CardContent,
  Checkbox,

  Grid,
  TextField,
  Divider,
  Button,
  Switch,
  FormControlLabel,
} from '@material-ui/core'




const useStyles = makeStyles(theme => ({


  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },

}))




class AreaForm {

  constructor () {

  }

  render (props) {
    const classes = useStyles()
  const { allState} = props
  const [circleValues, setCircleValues] = allState.map.circle
  const [createEmergency, setCreateEmergency] = allState.modalCreateEmergency.create


  const [getForm2Date, setForm2Date] = allState.fetchForm.form2Date
  const [aiInfo,setAiInfo] = allState.index.aiInfo
  const onSubmit = async ()=>{




    try {

      //start Artificial intelligence(AI) training
      let res = await axios.post("/api/map/ai/start_ai_training/",{
        date1:getForm2Date.date1,
        date2:getForm2Date.date2,
        lat:circleValues.lat,
        lng:circleValues.lng,
        distance:circleValues.distance,
        houres:circleValues.houres
      })


      if (res.data.status == 'ok') {
        setAiInfo({
          average:res.data.average,
          date1:getForm2Date.date1,
          date2:getForm2Date.date2,
          lat:circleValues.lat,
          lng:circleValues.lng,
          distance:circleValues.distance,
          houres:circleValues.houres
        })


      }
      else
      {
        alert('error')
      }
    }catch(e){
      alert('error')
    }


  }


  const onChange = event => {


    setCircleValues({
      ...circleValues,
      [event.target.name]: (isNaN(Number.parseFloat(event.target.value))) ? 0 : Number.parseFloat(event.target.value)
    })


  }

  return (
    <div >

      <main className={classes.content}>
        <div />
        <Paper >
          <CardHeader subheader="Fetch all emegency between 2 date and u need select distance" title="Fetch all emegency between 2 date" />
            <Divider />
            <CardContent style={{flexGrow: "1"}}>
            <Grid container>
                <Grid item>

                  <h3 style={{margin:'21px 18px 21px 0px'}}>  lat  </h3>
                </Grid>
                <Grid item>
                  <TextField

                  label="lat"
                  type="text"
                  name="lat"
                  value={circleValues.lat}

                  onChange={onChange}
                  InputLabelProps={{
                      shrink: true,
                  }}
                  />
                </Grid>
                <Grid item>
                  <h3 style={{margin:'21px 18px'}}>  lng  </h3>
                </Grid>
                <Grid item>
                  <TextField
                  label="lng"
                  type="text"
                  name="lng"
                  value={circleValues.lng}
                  className={classes.textField}
                  onChange={onChange}
                  InputLabelProps={{
                      shrink: true,
                  }}
                  />
                </Grid>
              </Grid>
              <Grid container>

                <Grid item>
                  <TextField
                  id="datetime-local"
                  label="distance"
                  type="text"
                  name="distance"
                  value={circleValues.distance}
                  className={classes.textField}
                  onChange={onChange}
                  InputLabelProps={{
                      shrink: true,
                  }}
                  noValidate/>
                </Grid>
                <Grid item>
                  <h3 style={{margin:'21px 18px'}}>  meters  </h3>
                </Grid>

              </Grid>
              <Grid container>

                <Grid item>
                  <TextField
                  id="datetime-local"
                  label="houres"
                  type="text"
                  name="houres"
                  value={circleValues.houres}
                  onChange={onChange}
                  className={classes.textField}

                  InputLabelProps={{
                      shrink: true,
                  }}
                  noValidate/>
                </Grid>
                <Grid item>
                  <h3 style={{margin:'21px 18px'}}>  houres  </h3>
                </Grid>

              </Grid>


            <Grid container>
                <Grid item>
                <FormControlLabel
        control={

          <Switch
        checked={circleValues.hide}
        onChange={(event) => {

          setCircleValues({
            ...circleValues,
            hide:event.target.checked
          })

        }}
        value="hide circle"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
        label="hide circle"
      />
        }
        label="Hide Circle"
      />

                </Grid>


              </Grid>
              <Grid container>
                <Grid item>
                <FormControlLabel
        control={
          <Switch
        checked={circleValues.editCircle}
        onChange={(event) => {

          setCircleValues({
            ...circleValues,
            editCircle:event.target.checked
          })

        }}
        value="edit Circle"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
        label="edit Circle"
      />
        }
        label="edit Circle"
      />


                </Grid>


              </Grid>
              <Grid container>
                <Grid item>
                <FormControlLabel
        control={

          <Switch
        checked={createEmergency}
        onChange={(event) => {
          setCreateEmergency(event.target.checked)


        }}
        value="create emergency"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
        label="create emergency"
      />
        }
        label="create emergency"
      />

                </Grid>


              </Grid>
            </CardContent>
            <Divider />
            <Divider />
            <CardActions>
            <div>
              <Button
              color="primary"
              variant={'contained'}
              onClick={onSubmit}>
                start Artificial intelligence(AI) training
              </Button>
            </div>
          </CardActions>
        </Paper>
      </main>
    </div>
  )
  }

}






const areaForm = new AreaForm()




export default areaForm.render.bind(areaForm)




