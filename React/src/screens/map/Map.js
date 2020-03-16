import clsx from 'clsx';
import React, { useState, useEffect } from 'react'

import Typography from '@material-ui/core/Typography'
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import { makeStyles } from '@material-ui/core/styles'
import Map from './components/Map'
import ModalCircleForm from './components/ModalCircleForm'
import AreaForm from './components/AreaForm'
import FetchForm from './components/FetchForm'
import ModalEmergency from './components/ModalEmergency'
import ModalCreateEmergency from './components/ModalCreateEmergency'

const buildUsefulErrorObject = (errors) => {
  const usefulErrors = []
  errors.map((error) => {
    usefulErrors.push(error)
  })
  return usefulErrors
}





function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}
const drawerWidth = 240;

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
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarShiftt: {
    marginLeft: '73px',
    width: `calc(100% - 73px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}))

const TabsPanels = (props) => {


  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const classes = useStyles()
  const {open, setOpen} = props
//["absolute","fixed","relative","static","sticky"].
  return (
    <div >

      <AppBar position="relative"  style={{
          backgroundColor: '#3f51b5',
          color:"#fff"
        }}>
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Fetch Form" {...a11yProps(0)} />
          <Tab label="Area" {...a11yProps(1)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
      <FetchForm  {...props} />


      </TabPanel>
      <TabPanel value={value} index={1}>
        <AreaForm {...props} />
      </TabPanel>


    </div>
  )


}



/*

style={{
         marginLeft: (open) ? '240px' : '73px',

         width:(open) ? '90%' : '97%',
       }}
*/



export default function MapAi (props) {
    const classes = useStyles()


    const allState = {
      index: {
        aiInfo: useState({

          average:null,
          lat:null,
          lng:null,
          date1:null,
          date2:null,
          houres:null,
          distance:null,


        })
      },
      fetchForm:{
        form2Date: useState({
          date1: '2020-03-01T00:00',
          date2: '2020-03-05T00:00'
        }),



        emergencies:  useState([])
      },
      map :{
        circle: useState({
          lat:21.523935596944117,
          lng:39.70119380688574,
          houres: 24,
          distance:20,

          hide: true,
          editCircle:false,


        })
      },
      modalCircleForm: {
        open:useState(false),
        CircleData: useState({

          every : 1,
          count:null,
          color:'gray'

        })
      },
      modalEmergency: {
        open:useState(false),
        data: useState([])
      },
      modalCreateEmergency: {
        open:useState(false),
        create:useState(false),
        data: useState({
          title:'asdasdasd',
          description:'aaaaaa',
          lat:0.555,
          long:0.666,
          is_static:false,
          createdAt:'now' // or 2020-03-16T00:57:50.442Z
        })
      },
    }




    const [circleData,setCircleData] = allState.map.circle
    const ModelData = useState({
      lat:0,
      lng:0,
      distance:0,
      evcery:0

    })

    allState.index.ModelData = ModelData

    const [createEmergency, setCreateEmergency] = allState.modalCreateEmergency.create
    const [getModalCreateEmergencyOpen, setModalCreateEmergencyOpen] = allState.modalCreateEmergency.open
    const [getModalCreateEmergencyData, setModalCreateEmergencyData] = allState.modalCreateEmergency.data

  const {open, setOpen} = props






  const OAreaList = useState([

  ])


  const [areaList, setAreaList] = OAreaList


  return (
    <React.Fragment>
      <div className={classes.toolbar} />

      <div className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
            [classes.appBarShiftt]: !open,
          })} >
        <TabsPanels  allState={allState}  OAreaList={OAreaList}   />
        <Map allState={allState} ModelData={ModelData}  isMarkerShown={true}
        onClick={(e,ee)=>{
          console.log(e)

          if(circleData.editCircle) {
            setCircleData({
              ...circleData,
              lat:e.latLng.lat(),
              lng:e.latLng.lng(),
            })
          } else if(createEmergency) {
            setModalCreateEmergencyOpen(true)
            setModalCreateEmergencyData({
              ...getModalCreateEmergencyData,
              lat:e.latLng.lat(),
              long:e.latLng.lng(),
              createdAt:new Date().toISOString()
            })
          }



        }}  />

      <ModalCircleForm allState={allState} />
      <ModalEmergency allState={allState} />
      <ModalCreateEmergency allState={allState} lat={getModalCreateEmergencyData.lat} lng={getModalCreateEmergencyData.long} />

       </div>
    </React.Fragment>
  );
}
