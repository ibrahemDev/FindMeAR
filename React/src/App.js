
import React, { useState } from 'react'
import { connect} from 'react-redux'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from 'react-router-dom'

import loadable from "@loadable/component";
import Header from "./components/Header";
import Drawer from "./components/Drawer";
import { actions, selectors } from './actions/userActions'
import { GoogleMap, DrawingManager } from '@react-google-maps/api'
import Map from "./screens/map/index";

const LoadableNotFoundComponent = loadable(() => import("./screens/NotFound"), {
  fallback: (<h1>Wite sec :)</h1>)
});
const LoadableHomeComponent = loadable(() => import("./screens/Home"), {
  fallback: (<h1>Wite sec :)</h1>)
});
const LoadableLoginComponent = loadable(() => import("./screens/Login/index"), {
  fallback: (<h1>Wite sec :)</h1>)
});
/*
const LoadableMapComponent = loadable(() => import("./screens/map/index"), {
  fallback: (<h1>Wite sec :)</h1>)
});*/


//       <Header selectUserID={selectUserID} updateUserID={updateUserID} />
// <Drawer selectUserID={selectUserID} updateUserID={updateUserID} />
function App ({ selectUserID, updateUserID }) {
  const [count, setCount] = useState(0)
  const [open, setOpen] = React.useState(false);
  console.log(selectUserID)
  return (



    <Router>
      <Drawer selectUserID={selectUserID} updateUserID={updateUserID} open={open} setOpen={setOpen} />


<Switch>




          <Route exact  path="/"  component={LoadableHomeComponent} />


          <Route path="/login"  >
            <LoadableLoginComponent selectUserID={selectUserID} updateUserID={updateUserID} />
          </Route>
          <Route path="/map"  >
            <Map open={open} setOpen={setOpen}  selectUserID={selectUserID} updateUserID={updateUserID} />
          </Route>

        <Route path="*"  component={LoadableNotFoundComponent} />
      </Switch>
    </Router>

  )
}
/**
 *
 *
 *           <Route path="/account"  component={(<h1>account</h1>)} />
          <Route path="/map_ai"  component={(<h1>MapAi</h1>)} />
          <Route path="/emergency_list"  component={(<h1>EmergencyList</h1>)} />
          <Route path="/users_list"  component={(<h1>users_list</h1>)} />
 */


const mapStateToProps = state => {

  const selectUserID = selectors.selectUserID(state)


  return { selectUserID }
}

const mapDispatchToProps = dispatch => ({
  updateUserID: data => {
    return dispatch(actions.updateUserID(data))
  }

})



export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
