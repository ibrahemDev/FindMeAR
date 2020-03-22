import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons';

import { AsyncStorage,View,Text,ScrollView,StatusBar ,StyleSheet, TouchableOpacity,Platform} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import xhr from '../../lib/Xhr';

import { ListItem , Header, Input  } from 'react-native-elements'

import { TextArea  as TextArea_,FormTextArea as FormTextArea_,Picker , Button} from "@99xt/first-born";

const styles = StyleSheet.create({
    container: { flex: 1 },

  });




export default function (props) {
    const { navigation, route } = props;

    const {params} = route

    const [Emergencies, setEmergencies] = params.EmergenciesState;


    const [pickerValue, setPickerValue] = useState('no');
    const [Title, setTitle] = useState('');
    const [Description, setDescription] = useState('');



    const [isStatic,setIsStatic] = useState(false);
    const [errorMessage,setErrorMessage] = useState(null);
    const [ScreenLocation,setScreenLocation] = useState(null);




    const _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            setErrorMessage('Permission to access location was denied')

        }

        let _location = await Location.getCurrentPositionAsync({});
        setScreenLocation(_location)



      };
    useEffect(() => {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
              errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
            });
          } else {
            _getLocationAsync();
          }
    },[])








// FormTextArea


// dark-content,light-content

    return (
        <View style={{flex:1}}>
        <StatusBar barStyle="light-content"  style={{backgroundColor:"#1c7ed7"}} />
        <Header
statusBarProps={{ barStyle: 'light-content' }}
centerComponent={{ text: 'New Emergency', style: { color: '#fff'} }}
leftComponent={(
    <TouchableOpacity onPress={()=>{
        navigation.goBack()
    }}>
        <Ionicons  name="ios-arrow-round-back" size={32} color="#fff" style={{marginHorizontal:18,marginVertical:5}} />
    </TouchableOpacity>
)}

/>

            <ScrollView keyboardDismissMode='on-drag' keyboardShouldPersistTaps={'never'} style={{flex:1}}>
            <View style={{flex:4,marginVertical:10}}>
                <Text style={{color:"#c10000"}}>
                    {errorMessage}
                </Text>
            </View>
                <View style={{flex:1,marginVertical:10}}>
                    <Input label='Title' placeholder='Title' value={Title}  onChangeText={(val)=>{
                        setTitle(val)


                    }} />
                </View>




                <View style={{flex:1,marginVertical:10}}>
                    <FormTextArea_  label="Description" value={Description}  onChangeText={(val)=>{
                        setDescription(val)


                    }} />
                </View>
                <View style={{flex:1,marginVertical:10}}>
                <Text>Are you injured or accompanied?</Text>
                <Picker onValueChange={(val) => {
                    if(val == 'yes')
                        setIsStatic(false)
                    else
                        setIsStatic(true)

                }} selectedValue={pickerValue} >
                    <Picker.Item value="no" label="no" />
    <Picker.Item value="yes" label="yes" />


</Picker>

                </View>

                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    paddingHorizontal: 10
                }}>
       <TouchableOpacity
         style={{

            alignItems: 'center',
            backgroundColor: '#1c7ed7',
            padding: 10
         }}
         onPress={async () =>{

            const data = {

                long:ScreenLocation.coords.longitude,
                lat:ScreenLocation.coords.latitude,
                is_static:isStatic,
                title:Title,//encodeURI(Title),
                description:Description//encodeURI(Description)
            }


            const newEmergencyRes = await xhr.NewEmergency(data);
            if(newEmergencyRes.status == 'ok') {






                const eCach = [...Emergencies,newEmergencyRes.Emergency]

                setEmergencies(eCach)


                navigation.goBack()


            }
            else
            {
                console.log('error')
            }



         }}
       >
         <Text style={{color: '#fff'}}> submit </Text>
       </TouchableOpacity>

      </View>







            </ScrollView>


        </View>
    )




}