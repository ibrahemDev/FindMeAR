import React, { Component,useState } from 'react';

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
} from '@material-ui/core'




class ModalCircleForm {

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
    const [getOpeng, setOpen] = this.allState.modalCircleForm.open
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
    this.allState.modalCircleForm.modalStyle = React.useState(this.getModalStyle.bind(this))


    const [modalStyle] = this.allState.modalCircleForm.modalStyle
    const [getOpeng, setOpen] = this.allState.modalCircleForm.open
    const [aiInfo,setAiInfo] = this.allState.index.aiInfo






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

          <div>
          <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="caption table">
        <caption>msg :)</caption>
        <TableHead>
          <TableRow>
            <TableCell>key</TableCell>
            <TableCell align="right">data</TableCell>

          </TableRow>
        </TableHead>
        <TableBody>

            <TableRow >
              <TableCell component="th" scope="row" style={{textAlign: "center", borderRight: "1px solid black"}} >
                between
              </TableCell>

              <TableCell align="right" style={{textAlign: "center"}}>{aiInfo.date1} and {aiInfo.date2}</TableCell>

            </TableRow>




            <TableRow >
              <TableCell component="th" scope="row" style={{textAlign: "center", borderRight: "1px solid black"}} >
              distance
              </TableCell>

              <TableCell align="right" style={{textAlign: "center"}}>{aiInfo.distance}</TableCell>

            </TableRow>

            <TableRow >
              <TableCell component="th" scope="row" style={{textAlign: "center", borderRight: "1px solid black"}} >
              houres
              </TableCell>

              <TableCell align="right" style={{textAlign: "center"}}>{aiInfo.houres}</TableCell>

            </TableRow>

            <TableRow >
              <TableCell component="th" scope="row" style={{textAlign: "center", borderRight: "1px solid black"}} >
              average
              </TableCell>

              <TableCell align="right" style={{textAlign: "center"}}>{aiInfo.average}</TableCell>

            </TableRow>

            <TableRow >
            <TableCell component="th" scope="row" style={{textAlign: "center", borderRight: "1px solid black"}} >
              lat, lng
              </TableCell>

                <TableCell align="right" style={{textAlign: "center"}}>{aiInfo.lat},{aiInfo.lng}</TableCell>

            </TableRow>

        </TableBody>
      </Table>
    </TableContainer>
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

const modalCircleForm = new ModalCircleForm()




export default modalCircleForm.render.bind(modalCircleForm)
