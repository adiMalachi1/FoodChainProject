import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    Image,
    StyleSheet,
    Alert,
    Switch,
    ColorPropType,
  } from 'react-native';
import {color} from '../utils'
import { ScrollView } from 'react-native-gesture-handler';

import DropDownPicker from 'react-native-dropdown-picker';;
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import {auth, db, storage} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'

const EditDetail = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    // const [data, setData] = useState('');
    const [userData, setUserData] = useState({});


    const getData = () => {
        if (auth.currentUser) {
          const userid = auth.currentUser.uid;
        
        if(userid){
          db.ref(`users/`+userid).on('value', function (snapshot) {
            //  setData(snapshot.val());
             setUserData({userName:snapshot.val().userName,phone:snapshot.val().phone, email:snapshot.val().email, type:snapshot.val().type})
     
          });
       }
       else{
         alert("ERROR: not userid")
       }
      }
       else{alert("ERROR: not auth.currentUser")}
      }
  
    useEffect(() => {
     
        //   setTimeout(() => {
            getData()
            setLoading(true);
        //   }, 1000);
        }, []);
    const handleUpdate = () => {
        const userid = auth.currentUser.uid;
        db.ref('users/'+userid)
        .update({
            userName:userData.userName,
            phone:userData.phone,
            email:userData.email,
            type:userData.type,

        })
        .then(() => {
            console.log('User Updated!');
            Alert.alert(
             'הפרופיל עודכן בהצלחה!'
            );
            let type = userData.type
            alert(type)
            navigation.navigate('Tabs',type)
          })
        
    }


    return (
        <View style={styles.container}>
        <Text  style={{marginVertical:10, writingDirection:'rtl'}}>שם הארגון</Text>
     
          <TextInput
            placeholder="שם הארגון"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.userName : ''} 
            onChangeText={(txt) => setUserData({...userData, userName: txt})}
            style={styles.textInput}
          />
        
        <Text  style={{marginVertical:10,writingDirection:'rtl'}}>פלאפון סלולרי</Text>

        <TextInput
            placeholder="מס' פלאפון"
            keyboardType="number-pad"
            autoCorrect={false}
            value={userData ? userData.phone : ''}
            onChangeText={(txt) => setUserData({...userData, phone: txt})}
            autoCapitalize="none"
            style = {styles.textInput}
            />
        <Text  style={{marginVertical:10,writingDirection:'rtl'}} >אמייל</Text>

        <TextInput
            value={userData ? userData.email : ''}
            onChangeText={(txt) => setUserData({...userData, email: txt})}
            placeholder="אימייל"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style = {styles.textInput}
        />
        <View style = {{ alignItems:'center'}}>
        <TouchableOpacity onPress={handleUpdate}
                    style={styles.conTouch} 
                ><Text style = {[styles.textColor,{fontSize: 20,margin:10}]}>עדכן</Text></TouchableOpacity> 
        </View> 
        </View>

    );
};
export default EditDetail;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.WHITE,
      paddingTop:100,
      margin:15,
    }, 
    textColor:{
        fontWeight: 'bold',
        color: 'white',
    },

    conTouch :{
        borderWidth:2,
        borderColor:'#fff',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#009387',
        borderRadius:10,
        margin:20,
    },
    textInput:{
        borderWidth:1,
        borderColor: 'black',
        backgroundColor: 'white',
        padding:10,
        borderRadius: 10,
        // marginBottom:20,
      
        // textAlignVertical: 'top',
        // width: '90%',
        textAlign:'right',
       
  
      },

});