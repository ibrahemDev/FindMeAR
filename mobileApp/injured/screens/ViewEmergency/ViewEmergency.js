import React, { useState, useEffect } from 'react';


import {StatusBar, View, TouchableOpacity, ScrollView, Text, Image} from 'react-native';
//import { AsyncStorage,View,Text,ScrollView,StatusBar ,StyleSheet, TouchableOpacity} from 'react-native';

import { Header,Card, Divider } from 'react-native-elements'

import { Ionicons } from '@expo/vector-icons';




export default function (props) {

    const { navigation,route } = props;

    const {params} = route
    const Emergency = params.Emergency

    const isLive = (Emergency.status == 1 || Emergency.status == 2);

    return (
        <View style={{flex:1}}>
            <StatusBar barStyle="light-content"  style={{backgroundColor:"#1c7ed7"}} />
            <Header
statusBarProps={{ barStyle: 'light-content' }}
centerComponent={{ text: 'Emergency', style: { color: '#fff'  } }}
leftComponent={(
    <TouchableOpacity onPress={()=>{
        navigation.goBack()
    }}>
        <Ionicons  name="ios-arrow-round-back" size={32} color="#fff" style={{marginHorizontal:18,marginVertical:5}} />
    </TouchableOpacity>
)}

/>

            <ScrollView style={{flex:1}}>
                <Card title={Emergency.title}>

                    <View style={{flex:1,marginVertical:15}}>
                    <Text style={{marginVertical:5}}>description</Text>
                    <Text >{Emergency.description}</Text>
                    </View>
                    <Divider style={{ backgroundColor: '#000' }} />
                    <View style={{flex:1,marginVertical:15}}>

                    <Text style={{marginVertical:5}}>are you injured?</Text>
                    <Text >{Emergency.is_static ? 'no' : 'yes'}</Text>
                    </View>
                    <Divider style={{ backgroundColor: '#000' }} />



                    <View style={{flex:1,marginVertical:15}}>
                        <Text style={{  color:(isLive ? '#04e4ad' : '#720606') }}>{(Emergency.status == 1)?'Waiting Paramedic': (Emergency.status == 2) ? 'Paramedic Received The Emergency' : 'Closed'}</Text>
                    </View>


                </Card>

                <Card title={'Paramedic information'}>

                    {Emergency.paramedic ? (
                        <View style={{flex:1}}>
                            <View style={{flex:1,marginVertical:15}}>
                                <Text style={{marginVertical:5}}>Phone Number</Text>
                                <Text >{Emergency.paramedic.phone_number}</Text>
                            </View>
                            <Divider style={{ backgroundColor: '#000' }} />
                            <View style={{flex:1, marginVertical:15}}>
                                <Text style={{marginVertical:5}}>full name</Text>
                                <Text >{Emergency.paramedic.full_name}</Text>
                            </View>
                        </View>

                    ):(null)}


                </Card>
            </ScrollView>
        </View>
    )

}