import React, { useState, useEffect, useRef} from 'react';
import Constants from 'expo-constants';

import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { AsyncStorage,View,Text,ScrollView,StatusBar ,StyleSheet, TouchableOpacity} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import xhr from '../../lib/Xhr';

import { ListItem , Header } from 'react-native-elements'
import { Ionicons } from '@expo/vector-icons';
const styles = StyleSheet.create({
    container: { flex: 1 },

  });


  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }



export default function (props) {
    const { navigation } = props;
    const [ID, setID] = useState(null)
    const [delay1, setDelay1] = useState(10000)
    const [delay2, setDelay2] = useState(30000)
    const [errorMessage,setErrorMessage] = useState(null);
    const [ScreenLocation,setScreenLocation] = useState(null);





    const ask = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied')

        }
    }


    const _getLocationAsync = async () => {


        let _location = await Location.getCurrentPositionAsync({});
        setScreenLocation(_location)

        console.log(errorMessage)

      };
    const [Emergencies, setEmergencies] = useState([
        {
              "id": 335,
              "user_id": 2,
              "employee_id": null,
              "title": "65s6ads",
              "description": "sadasdasd",
              "lat": 565.255,
              "long": 5.66,
              "status": 1,
              "status_msg": "no respone",
              "is_static": false,
              "createdAt": "2020-03-19T03:49:09.000Z"
          },
          {
              "id": 335,
              "user_id": 2,
              "employee_id": null,
              "title": "65s6ads",
              "description": "sadasdasd",
              "lat": 565.255,
              "long": 5.66,
              "status": 3,
              "status_msg": "no respone",
              "is_static": false,
              "createdAt": "2020-03-19T03:49:09.000Z"
          }
    ]);
    const refreshAllEmergencies = async ()=>{
        let _Emergencies = await xhr.getAllEmergencies()


        setEmergencies(_Emergencies)

    }
useInterval(async () => {

    await _getLocationAsync()
    console.log(ScreenLocation)
    if(errorMessage == null){
        for(var i = 0;i<Emergencies.length;i++){
            if((Emergencies[i].status == 1 || Emergencies[i].status == 2) && Emergencies[i].is_static == false) {
                const data= {
                    long:ScreenLocation.coords.longitude,
                    lat:ScreenLocation.coords.latitude,
                    is_static:Emergencies[i].is_static
                }
                await xhr.updateEmergency(Emergencies[i].id,data)
            }
        }

    }




}, delay1)

    useInterval(async () => {

        console.log('TIHCK')

        await refreshAllEmergencies()


    }, delay2)



    const init =  async function() {
        try {
            let _id = await AsyncStorage.getItem('id');

            if(_id == null) {
                _id = Constants.sessionId
                await AsyncStorage.setItem('id', _id);
            }
            setID(_id)

            let isAccess = await xhr.isAccess()

            if(!isAccess) {
                await xhr.access(_id)
            }
            await refreshAllEmergencies()
            /*let _Emergencies = await xhr.getAllEmergencies()


        setEmergencies(_Emergencies)*/





        } catch (error) {
            // Error retrieving data
            console.log('-------------->')
            console.log(error)
            console.log('-------------->')
        }
    }



    useEffect(function (){

        ask()
        init()


    } , [])




// dark-content,light-content

    return (
        <View style={{flex:1}}>
        <StatusBar barStyle="light-content"  style={{backgroundColor:"#1c7ed7"}} />
        <Header
statusBarProps={{ barStyle: 'light-content' }}
centerComponent={{ text: 'Emergencies', style: { color: '#fff' } }}
rightComponent={(
    <TouchableOpacity onPress={()=>{
        navigation.navigate('NewEmergency',{EmergenciesState:[Emergencies, setEmergencies]})

    }}>
        <Ionicons  name="ios-add" size={32} color="#fff" style={{marginHorizontal:18,marginVertical:5}} />
    </TouchableOpacity>
)}

/>
            <ScrollView style={{flex:1}}>
            {

                Emergencies.map((item, i) => {

                    const isLive = (item.status == 1 || item.status == 2);

                    return (
                <ListItem
                    key={"a"+i}
                    onPress={() => {

                        navigation.navigate('ViewEmergency',{Emergency:item})

                    }}
                    title={item.title}
                    subtitle={
                        <View style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 5 }}>
                          <Text style={{  color:(isLive ? '#04e4ad' : '#720606') }}>{(isLive)?'live': 'close'}</Text>
                        </View>
                      }


                bottomDivider />
                )})
            }
</ScrollView>


        </View>
    )




}