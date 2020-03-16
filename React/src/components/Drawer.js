import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import {
  Link

} from 'react-router-dom'

import Button from '@material-ui/core/Button'
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import HomeIcon from '@material-ui/icons/Home';
import MapIcon from '@material-ui/icons/Map';
import { useCookies } from 'react-cookie';



import cookie from 'react-cookies'


const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    title: {
      flexGrow: 1
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
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,

    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    link:{
      "text-decoration": "none",

      "color": "#fff"
    }
  }));








  export default function MiniDrawer({ selectUserID, updateUserID, open, setOpen }) {
    const classes = useStyles();
    const theme = useTheme();


    const handleDrawerOpen = () => {
      setOpen(true);
    };

    const handleDrawerClose = () => {
      setOpen(false);
    };

    return (
      <div className={classes.root}>
        <div>
        <CssBaseline />
        <AppBar
        style={{
          backgroundColor: 'rgb(0, 75, 138)',
          color:"#fff"
        }}
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
          {selectUserID ? (
            <IconButton
            style={{
              padding: "12px 12px 12px 0px",
              marginRight: 36,
              marginLeft: "-12px"

            }}
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            ) : (<></>)}
            <Typography variant="h6" className={classes.title}>
            Dashboard
            </Typography>
            {selectUserID ? (null) : <Link className={classes.link} color="#fff" to={'/login'}><Button color="inherit" onClick={()=>{

}} >Login</Button></Link>}
          </Toolbar>
        </AppBar>
        {selectUserID ? (
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}

        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
          <Link style={{
            "textDecoration": "none",

            "color": "black"
          }}  to={'/'}>
            <div>
          <ListItem onClick={()=>{alert('eeeeeeeee')}} >

                <ListItemIcon>{'Home' % 2 === 0 ? <InboxIcon /> : <HomeIcon />}</ListItemIcon>
                <ListItemText primary={'Home'} />

          </ListItem>
          </div>
                </Link>

          <Link style={{
            "textDecoration": "none",

            "color": "black"
          }} to={'/map'}>
          <ListItem  >

                <ListItemIcon>{'Map' % 2 === 0 ? <InboxIcon /> : <MapIcon />}</ListItemIcon>
                <ListItemText primary={'Map'} />

          </ListItem>
          </Link>
          <ListItem  onClick={()=>{

            console.log(':)')
            // logout request
            //cookie.remove('sess', { path: '/' })
          }}>
                <ListItemIcon style={{color: "red"}}>{'Logout' % 2 === 0 ? <InboxIcon /> : <ExitToAppIcon />}</ListItemIcon>
                <ListItemText primary={'Logout'} />
          </ListItem>

          </List>

        </Drawer>
        ) : (<></>)}
</div>
      </div>
    );
  }

