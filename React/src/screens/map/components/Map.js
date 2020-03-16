import React, { Component } from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker, Circle  } from 'react-google-maps';
import { compose, withProps } from "recompose"

import { v4 as uuidv4 } from 'uuid';



const CoustomCircle = (props) => {

  const {ModelData, item} = props
  // ModelData
  const onClick = () =>{
    alert(item)
  }


  return (
    <>

      <Circle {...props} onClick={onClick}  />
    </>
  )
}


function getColor(value){
  //value from 0 to 1
  var hue=((1-value)*120).toString(10);
  return ["hsl(",hue,",100%,50%)"].join("");
}





const CoustomMarker = (props) => {

  const {item} = props
  // ModelData
  const onClick = () =>{
    alert(JSON.stringify(item))
  }

  let position = {lat: item.lat, lng: item.long}

  return (
    <>
    {(!item.is_static) ?( <Marker onClick={props.onClick} defaultIcon={{url:'/public/images/point.png', scaledSize:new window.google.maps.Size(10,10,"px","px")}}
      position={position}
    />) : (
      <></>
    ) }


    </>
  )
}




 const Map = (props)=>{




  const {areaList,  allState} = props


  const [aiInfo,setAiInfo] = allState.index.aiInfo
  const [allEmergencies,setEmergencies] = allState.fetchForm.emergencies
  const [circleData,setCircleData] = allState.map.circle
  const [getOpeng, setOpen] = allState.modalCircleForm.open

  const [getModalEmergencyOpeng, setModalEmergencyOpeng] = allState.modalEmergency.open
  const [getData, setData] = allState.modalEmergency.data


/*
  lat:21.523935596944117,
      lng:39.70119380688574,

      distance:20,
      hide: true,
      editCircle:false
    let onClick = {

    }
    ()
    onClick.onClick:(circleData.hide || circleData.editCircle)? null : () => {alert('circle')} onClick={(circleData.hide || circleData.editCircle)? null : () => {alert('circle')}}
      */


    return (
      <GoogleMap
        defaultZoom={8}
        defaultCenter={{ lat: 21.523935596944117  , lng: 39.70119380688574 }}
        onClick={props.onClick}
        defaultMapTypeId={'hybrid'}


      >




        {/*areaList && areaList.length && areaList.map((item) => {
          return (<CoustomCircle key={uuidv4()} item={item} radius={item.distance} options={{fillColor:'white'}}  center={{ lat: item.lat, lng: item.long }} {...props} />)
        })*/}
        {(circleData.hide) ? (<></>) :
        (
          <Circle onClick={ (e) => {
            if(circleData.editCircle) {
              setCircleData({
                ...circleData,
                lat:e.latLng.lat(),
                lng:e.latLng.lng(),
              })
            }
            else
            {
              setOpen(true)
            }

          }} options={{fillColor:((aiInfo.average == null) ? 'white' : getColor(aiInfo.average/20))}} center={{ lat: circleData.lat, lng: circleData.lng }} radius={circleData.distance} />
        )}


        {allEmergencies && allEmergencies.length && allEmergencies.map((item) => {
          let arr = []
          for (var key in item) {
            arr.push({key:key,val:item[key]})
          }
          return (

            <div key={uuidv4()}>
            {(!item.is_static) ?( <Marker   onClick={(e) => {
              console.log('pip')
              if(circleData.editCircle) {
                setCircleData({
                  ...circleData,
                  lat:e.latLng.lat(),
                  lng:e.latLng.lng(),
                })
              }
              else
              {

                setData(arr)
                setModalEmergencyOpeng(true)

              }

            }} defaultIcon={{


            fillColor: "#0F0",
            fillOpacity: 0.3,
            strokeWeight: 0.3,
            url:'https://image.flaticon.com/icons/png/128/594/594940.png', scaledSize:new window.google.maps.Size(10,10,"px","px")

            }}
              position={{lat: item.lat, lng: item.long}}
            />) : (
              <></>
            ) }


            </div>
          )

        })}







        {/*areaList && areaList.length && areaList.map((item) => {
          return (<Circle key={uuidv4()} radius={5000} options={{fillColor:'white'}}  center={{ lat: item.lat, lng: item.lng }} />)
        })*/}
      </GoogleMap>
    )
};









  const MyMapComponent = compose(
    withProps({
      googleMapURL: "https://maps.googleapis.com/maps/api/js?key=https://maps.googleapis.com/maps/api/js?callback=initMap&signed_in=true&language=en&key=AIzaSyB2kFRFx2lyV6j6_5kNWcv0y7wdgFfIjsA",
      loadingElement: <div style={{ height: `100%` }} />,
      containerElement: <div style={{ height: `1000px`, width: '100%' }} />,
      mapElement: <div style={{ height: `100%` }} />,

    }),
    withScriptjs,
    withGoogleMap
  )(Map)







export default MyMapComponent





