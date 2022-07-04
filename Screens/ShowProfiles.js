import React, {useState,useEffect,useRef} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import * as Device from 'expo-device';
import {Title, Caption, } from 'react-native-paper';
import {db} from '../FirebaseConfig';
import { color } from '../utils';
import { StatusBar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {getPreciseDistance } from 'geolib';
import * as Notifications from 'expo-notifications'
import { PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
// import * as SMS from 'expo-sms';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});
const ShowProfiles = ({navigation,route}) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [feedback,setFeedback] =useState('');
  const [lengthArrayFeedback,setLengthArrayFeedback] =useState('0');


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    let unmounted = false
    // console.log("ruuning effect to fetch data")
    setTimeout(()=>{
      // console.log("data loaded for page" )
      if(!unmounted){

          db.ref(`users/`+itemId+'/match').on('value',  (snapshot) =>{ //get from firebase all exchanges made between current user and other
            var feedback = []
            snapshot.forEach((child)=>{
              if(child.val().status === true){ 
                if(child.val().rating!==0){
                  feedback.push(child.val().rating)
                }
                // console.log(feedback)

              setFeedback(feedback)
            }
            setLengthArrayFeedback(feedback.length)

          })
          })
          
      }},1000)
    return()=>{
      unmounted = true
    }
  }, []);

  
  const {itemId, itemName, itemImage, itemTags, itemCatogary,itemOther, itemType, itemFood, itemAmount, itemNumber,itemTime,itemPickTime, itemPhone,itemExpoPush,itemLatitude,itemLongitude,itemLatitudeUser,itemLongitudeUser,nameCurrentUser} = route.params;
  let first,firstValue, second,secondValue,donation,required
  var pdis = getPreciseDistance(
    { latitude:itemLatitude, longitude: itemLongitude },
    { latitude: itemLatitudeUser, longitude:itemLongitudeUser }
    );

 
  const checkData =(value)=>{// check data exist and return as string with comma between each word
      let string = ""
      try{
        if(value === '' || value === undefined || value === null){
          return string
        }
        else{
        for (var i=0; i < value.length; i++) {
            if(i !== value.length-1 ){
            string += (value[i]+', ')
          }
          else {
            string += (value[i])
          }  
        }
        return(string)
        }
      }
      catch(error){
        console.log(error)
      }
  }
  const calculateAvgFeedback=(feedback)=>{ //function that calculate the average of all geedback to current user
    try{
      // console.log(feedback.length)
      if(feedback.length === 0){
          return 0
      }
      else{
      let sum = 0 
      let length = feedback.length
      for (var i=0; i < feedback.length; i++) {
              sum += feedback[i] 
      }
     
      let average = (sum/length)
      // alert(average.toString().length)
      if(average.toString().length > 5){
       average = Number(average.toFixed(3))
      }
      return average

      }
    }
    catch(error){
      console.log(error)
    } 
  }
  const checkCatogary=(catogary)=>{//if catogary is other - returns what the user written instead 
    if(catogary == "אחר")
        return itemOther
    else{
      return catogary
    }

  }

  let calFeedback,rating
  calFeedback = calculateAvgFeedback(feedback)
  rating = "דירוג: " +calFeedback+'/5 ' +"(" +lengthArrayFeedback +" מדרגים)" 
  const starImageFilled = 'https://raw.githubusercontent.com/tranhonghan/images/46b0935e75d1a738b8457e6e95f821b861da3986/star_filled.png'
  //put the information we need in fields by function
  let catogary =  checkCatogary(itemCatogary)
  let tags = checkData(itemTags)
  let pick = checkData(itemPickTime) 
  let time = checkData(itemTime)

  //if getter/giver show somthing else
  if (itemType === 'נתרם'){
      first = 'לכמה אנשים?'
      firstValue = itemNumber
      second = 'סוג המזון'
      secondValue = checkData(itemFood)
      donation = 'הצע תרומה'
      required = 'התרומה הנדרשת'
  }
  else{
      first = 'סוג המזון'
      firstValue =checkData(itemFood) 
      second = 'משקל (בק"ג)'
      secondValue = itemAmount
      donation = 'בקש תרומה'
      required = 'התרומה המוצעת'
  }
   
   
  return (
    <ScrollView>
    <View style ={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} translucent/>
        <View style={{paddingVertical:5,flexDirection:'column',justifyContent:'center', alignItems:'center'}}>
            <Image style={styles.image} source={{uri: itemImage}} />
            <Title style={styles.title}>{itemName}</Title> 
            <Caption style={{fontSize:14,}}>{catogary}</Caption> 
        </View>
        <View style ={{alignItems:'center',direction:'rtl'}} >

                <View style={styles.infoBoxWrapper}>
                    <Text style = {styles.title}>{first}</Text>
                    <Caption style={styles.caption}>{firstValue} </Caption>
                </View>
                <View style={styles.infoBoxWrapper}>
                    <Text style = {styles.title}>{second}</Text>
                    <Caption style={styles.caption}>{secondValue}</Caption>
                </View>
                <View style={styles.infoBoxWrapper}>
                    <Text style = {styles.title}>ימים</Text>
                    <Caption style={styles.caption}>{pick}</Caption>
                </View>
                <View style={styles.infoBoxWrapper}>
                    <Text style = {styles.title}>בין השעות</Text>
                    <Caption style={styles.caption}>{time}</Caption>
                </View>
                <View style={styles.infoBoxWrapper}>
                    <Text style = {styles.title}>תגיות</Text>
                    <Caption style={styles.caption}>{tags}</Caption>
                </View>
                <View style={styles.infoBoxWrapper}>
                    <Text style = {styles.title}>מרחק</Text>
                    <Caption style={styles.caption}>{pdis / 1000} ק"מ</Caption>
                </View>
        </View>
        <View>
          <MapView style={{height: 300, width: '100%'}} 
              provider={PROVIDER_GOOGLE}
              initialRegion = {{
                latitude:itemLatitude,
                longitude:itemLongitude,
              
                longitudeDelta:1,
                latitudeDelta: 1.7,  
              }}

              zoomEnabled={true}
              scrollEnabled={true}
              showsScale={true}
              showsUserLocation={true}
              showsMyLocationButton={true}
              showsCompass={true}
              toolbarEnabled={true}
              loadingEnabled={true}
              loadingIndicatorColor="blue"
            >
             
            {/* <MapView.Circle
            center={{
              latitude: itemLatitude,
              longitude: itemLongitude,
            }}
            radius={150}
            strokeWidth={2}
            strokeColor="#3399ff"
            fillColor="rgba(102,204,153,0.2)"/> */}

            <MapView.Marker   
              coordinate={{latitude:itemLatitudeUser, longitude:itemLongitudeUser}}
              title = 'המיקום שלי'
               pinColor='blue'/> 
            <MapView.Marker   
              coordinate={{latitude:itemLatitude, longitude:itemLongitude}}
              title ={'המיקום של ' + itemName} 
              pinColor='red'></MapView.Marker>
            <MapView.Polyline
                 coordinates={[ 
                    {latitude: itemLatitude, longitude:itemLongitude}, // optional
                    {latitude: itemLatitudeUser, longitude: itemLongitudeUser}, // optional
                ]}
                strokeWidth={5} 
                strokeColor={color.BLACK}
            />
          </MapView>
        </View>
        <View style = {{ ...Platform.select({
            ios: {
                flexDirection: 'row-reverse',
            },
            android:{
                flexDirection: 'row',
            },

        }),marginTop:10,alignSelf:'center'}}>
              <Image
                    style ={styles.starImageStyle}
                    source = {
                     {uri: starImageFilled}
                    
                    }
                />
            <Text style={{color:color.BLACK,marginHorizontal:5,}}>{rating}</Text>
        </View>
        <View style = {{alignItems:'center',margin:10,}}>
        <TouchableOpacity onPress={async () => {
          await sendPushNotification(itemExpoPush, itemType,nameCurrentUser,itemName);
        }}
                style={styles.conTouch} 
            ><Text style = {[styles.textColor,{fontSize: 18,margin:10}]}>{donation}</Text></TouchableOpacity>
        </View>
        {/* <View style = {{alignItems:'center'}}>
        <TouchableOpacity onPress={ onPress}
                style= {styles.conTouch}
            ><Text style = {[styles.textColor,{fontSize: 18,margin:10}]}>יצירת קשר דרך SMS</Text></TouchableOpacity>
        </View>
        */}
     </View>
     </ScrollView>


    );
};

//make this component available to the app
export default ShowProfiles;

//define styling
async function sendPushNotification(expoPushToken, itemType,nameCurrentUser,itemName) { //send push notification from current user to chosen user in profile
  // alert(expoPushToken)
  var msg,alert
  if(itemType == "תורם"){
    msg = 'יש לך בקשת תרומה מאת '+ nameCurrentUser
    alert = "בקשת התרומה נשלחה אל " + itemName
  }
  else{
    msg = 'יש לך הצעת תרומה מאת '+ nameCurrentUser
    alert = "הצעת התרומה נשלחה אל " + itemName

  }
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'התראות FoodChain',
    body: msg,
    data: { someData: 'goes here' },
  }
  ;

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
  Alert.alert('', alert,[,,{text:"אישור"}])
}

async function registerForPushNotificationsAsync() { // register for push notifications and ask permission
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('', "הודעת שגיאה: קבלת מזהה עבור ההתראות נכשלה",[,,{text:"אישור"}])
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    Alert.alert('', "הודעת שגיאה: חייב להשתמש במכשיר פיזי עבור שליחת התראות",[,,{text:"אישור"}])
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// const onPress = async()=>{
    //   const isAvailable = await SMS.isAvailableAsync();
    //   if (isAvailable) {
    //     // alert("hey")
    //     const status = await SMS.sendSMSAsync(
    //       [itemPhone],
    //       'שלום, מעוניין ליצור קשר בנוגע לתרומה'
    //     );
    //     console.log(status)
    //     // do your SMS stuff here
    //   } else {
    //     // there's no SMS available on this device
    //     Alert.alert("","הודעת שגיאה: חייב להשתמש במכשיר פיזי עבור הודעות Push",[,,{text:"אישור"}]);
    //     return
    //   }
    // }

//define styling
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: color.WHITE_GRAY,
      margin:10,   
    },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 15,
    fontWeight: 'bold',
    writingDirection:'rtl',
  },
  infoBoxWrapper: {
    flexDirection: 'column',
    alignItems:'flex-start',
    padding:5,
    width: '90%',
    borderTopColor: '#dddddd', 
    borderTopWidth: 2
  },
  infoBox: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textColor:{
    fontWeight: 'bold',
    color: color.WHITE_GRAY,
  },
  starImageStyle:{
    width:20,
    height:20,
    resizeMode:'cover',
  },
  conTouch :{
    borderWidth:2,
    borderColor:color.WHITE_GRAY,
    alignItems:'center',
    justifyContent:'center',
    // width:150,
    // height:50,
    backgroundColor: color.TURQUOISE,
    borderRadius:10,
  },
  image:{
    height: 100,
    width: 100, 
    borderRadius:50
  },
});