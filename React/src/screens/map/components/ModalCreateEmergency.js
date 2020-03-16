import React, { Component,useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Modal from '@material-ui/core/Modal'
import { makeStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";
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
  TextField,
  Switch,
  FormControlLabel,
} from '@material-ui/core'




class ModalEmergency {

  constructor() {

    this.useStyles = makeStyles(theme => ({
      link: {
        color: '#2097ff',
        cursor: 'pointer'
      },
      content: {
        flexGrow: 1,

      },
      paper: {
        position: 'absolute',
        width: 1000,
        backgroundColor: theme.palette.background.paper,


        padding: theme.spacing(2, 4, 3),
      },
      menuButton: {
        marginRight: theme.spacing(2)
      },
      table: {
        minWidth: 900,
      },

    }))
  }


  createDataRow(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
  }

  handleCloseModal () {
    const [getOpeng, setOpen] = this.allState.modalCreateEmergency.open
    setOpen(false)
  }

  getModalStyle () {
    const top = 50
    const left = 50

    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`
    }
  }

  render(props) {
    const classes = this.useStyles()
    this.allState = props.allState




    const [getOpeng, setOpen] = this.allState.modalCreateEmergency.open
    const [getData, setData] = this.allState.modalCreateEmergency.data
    /*const [getData,setData] = useState({
      title:'asdasdasd',
      description:'aaaaaa',
      lat:props.lat,
      long:props.lng,
      is_static:false,
      createdAt:'now' // or 2020-03-16T00:57:50.442Z
    })*/

    const getDataAllList = () => {
      let arr = []

      for(var key in getData) {
        arr.push({key,val:getData[key]})
      }

      return arr
    }

    const [allEmergencies,setEmergencies] = this.allState.fetchForm.emergencies

    const onSubmit = async ()=>{




      try {

        //start Artificial intelligence(AI) training
        let res = await axios.post("/api/emergency/",{
          title:getData.title,
          description:getData.description,
          lat:getData.lat,
          long:getData.long,
          is_static:getData.is_static,
          createdAt:getData.createdAt
        })

        console.log(res.data)

        if (res.data.status == 'ok') {

          setOpen(false)
          setEmergencies([...allEmergencies,{...res.data.Emergency}])
        }
        else
        {
          alert('error')
        }
      }catch(e){
        console.log(e)
        alert('error')
      }


    }





    const onChange = event => {
      let val = null


      if(event.target.name == 'lat' || event.target.name == 'long' ) {
        val = (isNaN(Number.parseFloat(event.target.value))) ? 0 : Number.parseFloat(event.target.value)
      }
      else
        val = event.target.value





      setData({
        ...getData,
        [event.target.name]: val
      })


    }

    return (<div>
        <Dialog
        fullWidth={true}
        maxWidth={'md'}
        open={getOpeng}
        onClose={this.handleCloseModal.bind(this)}
        aria-labelledby="max-width-dialog-title"
      >

        <DialogTitle id="max-width-dialog-title">Optional sizes</DialogTitle>
        <DialogContent>







        <Grid container >
          <Grid item>
            <TextField
            id="datetime-local"
            label="title"
            type="datetime-local"
            name="title"
            value={getData.title}
            className={classes.textField}
            onChange={onChange}
            InputLabelProps={{
                shrink: true,
            }}
            noValidate/>
          </Grid>
        </Grid>


        <Grid container >
          <Grid item>
            <TextField
            id="datetime-local"
            label="description"
            type="datetime-local"
            name="description"
            value={getData.description}
            className={classes.textField}
            onChange={onChange}
            InputLabelProps={{
                shrink: true,
            }}
            noValidate/>
          </Grid>
        </Grid>


        <Grid container >
          <Grid item>
            <TextField
            id="datetime-local"
            label="lat"
            type="datetime-local"
            name="lat"
            value={getData.lat}
            className={classes.textField}
            onChange={onChange}
            InputLabelProps={{
                shrink: true,
            }}
            noValidate/>
          </Grid>
        </Grid>





        <Grid container >
          <Grid item>
            <TextField
            id="datetime-local"
            label="long"
            type="datetime-local"
            name="long"
            value={getData.long}
            className={classes.textField}
            onChange={onChange}
            InputLabelProps={{
                shrink: true,
            }}
            noValidate/>
          </Grid>
        </Grid>

        <Grid container >
          <Grid item>
            <TextField
            id="datetime-local"
            label="createdAt"
            type="datetime-local"
            name="createdAt"
            value={getData.createdAt}
            className={classes.textField}
            onChange={onChange}
            InputLabelProps={{
                shrink: true,
            }}
            noValidate/>
          </Grid>
        </Grid>

        <FormControlLabel
        control={
          <Switch
        checked={getData.is_static}
        onChange={(event) => {
          setData({
            ...getData,
            is_static: event.target.checked
          })


        }}
        value="is static"
        color="primary"
        inputProps={{ 'aria-label': 'primary checkbox' }}
        label="is static"
      />
        }
        label="is static"
      />




    <div>
              <Button
              color="primary"
              variant={'contained'}
              onClick={onSubmit}>
                supmit
              </Button>
            </div>



        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleCloseModal.bind(this)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>



    </div>)
  }
}

const modalEmergency = new ModalEmergency()




export default modalEmergency.render.bind(modalEmergency)
/*

 {/**
<TableRow key={uuidv4()}>
  <TableCell component="th" scope="row" style={{textAlign: "center", borderRight: "1px solid black"}} >
  {item.key}
  </TableCell>
  <TableCell align="right" style={{textAlign: "center"}}>
  <TextField

label={item.key}
type="text"
name={item.key}
value={item.val}

onChange={onChange}
InputLabelProps={{
    shrink: true,
}}
/>

    </TableCell>

</TableRow>* /}

*/
