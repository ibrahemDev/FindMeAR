


import React, { useState, useEffect } from 'react'


import { makeStyles } from '@material-ui/core/styles'
import axios from "axios";
import {
  Paper,
  CardHeader,
  CardActions,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Divider,
  Button,
} from '@material-ui/core'


const useStyles = makeStyles(theme => ({


  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },

}))



class FetchForm {

  constructor () {

  }

  render (props) {
    const classes = useStyles()
    const {open, setOpen, allState} = props

  const [getEmergencies, setEmergencies] = allState.fetchForm.emergencies

  const [getForm2Date, setForm2Date] = allState.fetchForm.form2Date



  const distanceHandleChange = event => {

    console.log(event.target.name)
    setForm2Date({
      ...getForm2Date,
      [event.target.name]: event.target.value
    })
  }

  useEffect(() => {

  }, [])
  const onSubmit = async ()=>{
    try {


      let res = await axios.get(`/api/emergencies2date/?date1=${getForm2Date.date1}&date2=${getForm2Date.date2}`, {
        date1:getForm2Date.date1,
        date2:getForm2Date.date2
      })

      console.dir(res.data)
      if (res.data.status == 'ok') {
          alert('ok')
          setEmergencies(res.data.emergencies)


      }
      else
      {
        alert('error')
      }
    }catch(e){
      alert('errorrrrr')
    }









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
                  <TextField
                  id="datetime-local"
                  label="Next appointment"
                  type="datetime-local"
                  name="date1"
                  value={getForm2Date.date1}
                  className={classes.textField}
                  onChange={distanceHandleChange}
                  InputLabelProps={{
                      shrink: true,
                  }}
                  noValidate/>
                </Grid>
                <Grid item>
                  <h3 style={{margin:'21px 18px'}}>  To  </h3>
                </Grid>
                <Grid item>
                  <TextField
                  id="datetime-local"
                  label="Next appointment"
                  type="datetime-local"
                  name="date2"
                  value={getForm2Date.date2}
                  className={classes.textField}
                  onChange={distanceHandleChange}
                  InputLabelProps={{
                      shrink: true,
                  }}
                  noValidate/>
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
                submit
              </Button>
            </div>
          </CardActions>
        </Paper>
      </main>
    </div>
  )


  }

}



const fetchForm = new FetchForm()




export default fetchForm.render.bind(fetchForm)
