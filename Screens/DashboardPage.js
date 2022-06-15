import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Alert,
    FlatList,
} from 'react-native';
import * as Device from 'expo-device';
import { useState, useEffect } from 'react'
import {auth, db} from '../FirebaseConfig';
import { Title,Caption, } from 'react-native-paper';
import { color } from '../utils';
import * as Notifications from 'expo-notifications'
import { ScrollView } from 'react-native-gesture-handler';
import {StatusBar} from 'react-native';

const DashboardPage = ({navigation}) => {

  const [match, setMatch] = useState([]);//set all match
  const [userObj, setUserObj] = useState('');//set user object data
  const [userObjForm, setUserObjForm] = useState(''); //set user data from of user

  useEffect(() => {
    let unmounted = false
    // console.log("ruuning effect to fetch data")
    setTimeout(()=>{
    // console.log("data loaded for page" )
    if(!unmounted){
      registerForPushNotificationsAsync();
      }},1000)
    return()=>{
      unmounted = true
    }
   },[]);

  useEffect(() => {
    let unmounted = false
    // console.log("ruuning effect to fetch data")
    setTimeout(()=>{
      // console.log("data loaded for page" )
      if(!unmounted){
        if (auth.currentUser) {
          const userid = auth.currentUser.uid; 
          db.ref(`users/`+userid+'/match').on('value',  (snapshot) =>{ //get from firebase all exchanges made between current user and other
            var users =[]
            snapshot.forEach((child)=>{
              if(child.val().status === true){
              users.push({
                key:child.key,
                date:child.val().date,
                name: child.val().with,
              })
              setMatch(users)
            }
            })
          })
          if (userid) {
            db.ref('users/'+userid).on('value', (snapshot) => {
              setUserObj(snapshot.val()) 
              setUserObjForm(snapshot.val().Form) 
          })}
          else{
            Alert.alert('', "הודעת שגיאה: זהו לא המזהה הנכון",[,,{text:"אישור"}])
          }}
          else{
            Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת, יתכן כי משתמש זה כבר מחובר ממכשיר אחר, אנא התנתק ונסה שנית",[,,{text:"אישור"}])
      }}},1000)
    return()=>{
      unmounted = true
    }
  }, []);
   
  const registerForPushNotificationsAsync = async () => { //fuction to register to pusg notification
     if (Device.isDevice) {
       //check for existing permissions
       const { status } = await Notifications.getPermissionsAsync();
       let finalStatus = status;
       //if no exisitng permissions, ask user from permission
       if (status !== 'granted') {
         const { status } = await Notifications.requestPermissionsAsync();
         finalStatus = status;
       }
       //if no permissions, exit the function
       if (finalStatus !== 'granted') {
         alert('Failed to get push token for push notification!');
         return;
       }
       //get pusk notification token
       const token = (await Notifications.getExpoPushTokenAsync()).data;
       console.log(token);
       let uid = auth.currentUser.uid
      //  alert(uid)
       db.ref('users/' + uid ).update({
        expoPushToken:token
        
       })   
     } 
     else {
        Alert.alert("","הודעת שגיאה: חייב להשתמש במכשיר פיזי עבור הודעות Push",[,,{text:"אישור"}]);
        return;
     }
   
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };
    
  const checkCatogary=(catogary)=>{ //if catogary is other - returns what the user written instead 
    if(catogary == "אחר")
        return userObjForm.other
    else{
      return catogary
    }
  }
  const checkData =(value)=>{ // check data exist and return as string with comma between each word
    try{
      if(value === undefined){
          return ""
      }
      else{
      let string = ""
      for (var i=0; i < value.length; i++) {
          if(i !== value.length-1 ){
          string += (value[i]+', ')
        }
        else {string += (value[i])}   
      }
      return string
      }
    }
    catch(error){
      console.log(error)
    } 
  }
  //put the information we need in fields by function
  let catogary =  checkCatogary(userObjForm.catogary)
  let first,firstValue, second,secondValue
  let time,pickTime,typeFood
  time = checkData(userObjForm.Time)
  pickTime = checkData(userObjForm.timePick)
  typeFood = checkData(userObjForm.typeFood)

  //if getter/giver show somthing else
  if (userObj.type === 'getter'){ 
      first = 'לכמה אנשים?'
      firstValue = userObjForm.numberPeople
      second = 'סוג המזון'
      secondValue = typeFood
  }
  else{                        
      first = 'סוג המזון'
      firstValue = typeFood
      second = 'משקל (בק"ג)'
      secondValue = userObjForm.amount
  }
  const renderSeparator = () => { //seperator between each item
        return (
          <View
            style={styles.seperator}
          />
        )
  }
  const renderItem = (({ item } ) => (
    <View style ={styles.item}>     
      <Text style={styles.date}> 
          {item.date}     
      </Text>
      <Text style={styles.name}>
          {item.name}
      </Text> 
    </View>
  ))
  return (
    <ScrollView>
    <View style ={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
        <View style={styles.header}>
        <Image style={styles.image} source={{uri: userObj.image}} />
              <Title style={styles.title}>{userObj.userName}</Title> 
              <Caption style={{fontSize:14,}}>{catogary}</Caption> 
        </View>
        <View style ={styles.box} >
            <View style={styles.infoBox}>
            <Text style = {styles.title}>{first}</Text>
              <Caption style={styles.caption}>{firstValue} </Caption>
            </View>
            <View style={styles.infoBox}>
            <Text style = {styles.title}>{second}</Text>
              <Caption style={styles.caption}>{secondValue}</Caption>
            </View>
            <View style={styles.infoBox}>
              <Text style = {styles.title}>ימים</Text>
              <Caption style={styles.caption}>{pickTime}</Caption>
            </View>
            <View style={styles.infoBox}>
            <Text style = {styles.title}>בין השעות</Text>
              <Caption style={styles.caption}>{time}</Caption>
            </View>
          </View>
          <View style = {styles.editButton}>
          <TouchableOpacity
              style={styles.userBtn}
              onPress={() => {
                navigation.navigate('עריכת פרטי הטופס',{type:userObj.type});
              }}>
              <Text style={styles.userBtnTxt}>עריכת פרטי הטופס</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.userBtn,{marginVertical:10}]} onPress={() => {
                navigation.navigate('עריכת פרטים אישיים', {imageUser:userObj.image});
              }}>
              <Text style={styles.userBtnTxt}>עריכת פרטים אישיים</Text>
            </TouchableOpacity >
          </View>
          <View >
            <Text style={styles.textMatch}>החלפות שבוצעו</Text>
            <FlatList
              data={match}
              extraData={match.sort((a, b) => a.date < b.date)}
              style={{width:'90%',margin:10,}}
              renderItem = {renderItem}
              keyExtractor = {(item)=>item.key}
              ItemSeparatorComponent = {renderSeparator}
              scrollEnabled={false}/>
          </View>
    </View>
    </ScrollView>

  );
};

//make this component available to the app
export default DashboardPage;

//define styling
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.WHITE_GRAY,
      paddingTop: 10, 
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    box:{
      alignItems:'center',
      paddingTop:15,
      direction:'rtl'
    },
    infoBox: {
      flexDirection: 'column',
      alignItems:'flex-start',
      padding:5,
      width: '90%',
      borderTopColor: '#dddddd', 
      borderTopWidth: 2
    },
    header:{
      paddingVertical:5,
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center'
    },
    userBtn: {
      margin:5,
      borderColor: color.WHITE_GRAY,
      // borderWidth: 2,
      borderRadius: 10,
      paddingVertical: 8,
      marginVertical: 5,
      backgroundColor:color.TURQUOISE,
      width:'40%', 
      alignItems:'center',
      justifyContent:'center',
      alignContent:'center',
    },
    userBtnTxt: {
      color: color.WHITE_GRAY,
    },
    textMatch:{
      color:color.BLACK,
      fontSize:16,
      backgroundColor:color.TURQUOISE1,
      width:'90%',
      textAlign:'center',
      alignSelf:'center',
      padding:2,
      marginTop:10
    },
    editButton:{
      alignItems:'center',
      alignSelf:'center',
      ...Platform.select({
        ios: {
            flexDirection: 'row-reverse',
        },
        android:{
            flexDirection: 'row',
        },

    }),
    },
    item:{
      width:'100%', 
      padding:10,
      alignItems:'center',
      justifyContent:'center'
    },
    name:{
      color:color.BLACK,
      fontSize:16,
    },
    image:{
      height: 100, 
      width: 100, 
      borderRadius:50
    },
    date:{
      color:color.BLACK,
      fontSize:16,
      fontWeight:'bold',
      writingDirection:'rtl'
    },
    seperator:{
      height: 2,
      width: '90%',
      backgroundColor: color.BLACK,
      alignSelf:'center',
      marginLeft: '5%',
    }
    }) 