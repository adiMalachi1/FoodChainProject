import React  from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Image,
    Platform,
    Alert,
    StatusBar,
} from 'react-native';
import { getPreciseDistance } from 'geolib';
import { color } from '../utils';
import { useState, useEffect } from 'react'
import {auth, db} from '../FirebaseConfig';
import { Callout, Marker } from "react-native-maps";
import { PROVIDER_GOOGLE } from 'react-native-maps';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

const MapsUsers = ({navigation}) => {
  const [userObj, setUserObj] = useState('');
  const [userObjForm, setUserObjForm] = useState('');
  const [markers, setMarkers] = useState([])
  const [show, setShow] = useState(false);
  const [ spinner, setSpinner ] = useState(true);

  useEffect(() => {
    let unmounted = false
    // console.log("ruuning effect to fetch data")
    setTimeout(()=>{
    // console.log("data loaded for page" )
    if(!unmounted){
      (async () => {
         // ask the user for the permission to access location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== "granted"){
          Alert.alert('',"סירבת לאפליקציה הזו לגשת למיקום שלך, עליך לשנות זאת ולאפשר גישה על מנת לקבל ביצועים טובים יותר",[,,{text:"אישור"}]);
            return;
        }
      })();}},3000)
    return()=>{
      unmounted = true
    } 
  }, []);
   
  useEffect(() => {  
    getData()
    setTimeout(() => {       
      setSpinner(false)}, 1000)
  }, [])

  const getData = () => {//get data from firebase - take data of current user and all users that in different type from current user
      if (auth.currentUser) {
        const userid = auth.currentUser.uid;
        var type,name
        if (userid) {
          db.ref('users/'+userid+'/Form').on('value', (snapshot) => {
            setUserObjForm(snapshot.val())   
          });
          db.ref('users/'+userid).on('value', (snapshot) => {
            setUserObj(snapshot.val()) 
            type =  (snapshot.val().type);
            name = (snapshot.val().userName)
            latitudeTemp = snapshot.val().Form.latitude
            longitudeTemp = snapshot.val().Form.longitude   
          });
          var latitudeTemp,longitudeTemp
          db.ref('users/').on('value', (snapshot) => {
            let array = [];
            snapshot.forEach((child)=>{
                var pdis = getPreciseDistance(
                  { latitude:latitudeTemp, longitude: longitudeTemp },
                  { latitude: child.val().Form.latitude, longitude:child.val().Form.longitude }
                );
                var typeUser 
                if(child.val().type === "giver"){
                  typeUser = "תורם"
                }
                else{
                  typeUser = "נתרם"
                }
                if(type!== child.val().type){  // data we need to showProfiles screen
                    array.push({
                    'key':child.key,
                    'latitude':child.val().Form.latitude,
                    'longitude':child.val().Form.longitude, 
                    'user':child.val().userName,
                    'description':child.val().Form.description,
                    'image':child.val().image,
                    'catogary': child.val().Form.catogary,
                    'tags':child.val().Form.tags,
                    'expoPush':child.val().expoPushToken,
                    'food': child.val().Form.typeFood,
                    'amount':child.val().Form.amount,
                    'number':child.val().Form.numberPeople,
                    'phone': child.val().phone,
                    'latitudeUser':latitudeTemp,
                    'longitudeUser':longitudeTemp,
                    'Time': child.val().Form.Time,
                    'TimePick': child.val().Form.timePick,
                    'pdis':pdis,
                    'type':typeUser,
                    'nameCurrentUser':name
                  })  
                  // console.log(array)
                  setMarkers(array)  
                }  
            })
          })
        }
        else{
          Alert.alert('', "הודעת שגיאה: זהו לא המזהה הנכון",[,,{text:"אישור"}])
        }
      }
      else{
        Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת, יתכן כי משתמש זה כבר מחובר ממכשיר אחר, אנא התנתק ונסה שנית",[,,{text:"אישור"}])
      }
  }
      
  const check = (marker)=>{
    if (Platform.OS === 'android'){
      return(
        <View  style = {{display: show ? "flex": "none"}}>
          <Image
              source={{uri:marker.image}}
              style={{width: 100, height: 100}}
            resizeMode="contain"/>
        </View> 
      )
    }
  }
return (
  <View style ={styles.container}>
  <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
    <MapView style={{height: '100%', width: '100%'}} 
      provider={PROVIDER_GOOGLE}
      showsCompass={true}
      rotateEnabled={false}
      showsUserLocation={true}
      showsMyLocationButton={true}
      zoomEnabled={true}
      loadingEnabled={true}
      region ={{
        latitude:userObjForm.latitude?userObjForm.latitude:31,
        longitude:userObjForm.longitude?userObjForm.longitude:35,  
        longitudeDelta: 1,
        latitudeDelta: 2.5,  
      }}>
         
      {/* // onRegionChangeComplete={(region) => setRegion(region)}>  */}
      {markers.map((marker, i) => (
          <Marker key={i} identifier={`id${i}`} coordinate={marker} >
              {check(marker)}
          </Marker>
                
      ))}
      {markers.map((marker, i) => (
          <Marker key={i} identifier={`id${i}`} coordinate={marker}>
            <Callout tooltip onPress={() =>{navigation.navigate('הצגת פרופיל',{
              itemId: marker.key,
              itemName: marker.user,
              itemImage: marker.image ? marker.image || marker.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
              itemTags : marker.tags,
              itemCatogary : marker.catogary,
              itemType : marker.type,
              itemFood: marker.food,
              itemAmount: marker.amount,
              itemNumber: marker.number,
              itemTime: marker.Time,
              itemPickTime: marker.TimePick,
              itemPhone: marker.phone,
              itemExpoPush: marker.expoPush,
              itemLatitude: marker.latitude,
              itemLongitude: marker.longitude,
              itemLatitudeUser: marker.latitudeUser,
              itemLongitudeUser: marker.longitudeUser,
              nameCurrentUser:marker.nameCurrentUser,
            })}}>
              <View key = {i}>
                  <View style ={styles.bubble}>
                      <Text style={styles.userText}>{marker.user}</Text>
                      <Text style={{textAlign:'center'}}>{marker.description}</Text>
                      <Text style={{textAlign:'center',color:color.BLACK,fontSize:14,backgroundColor:color.TURQUOISE2, marginVertical:5}}>למעבר לפרופיל</Text> 
                        <View style = {styles.viewImage}>
                          <Text> <Image style={{ height: 150, width:150 }} source={{uri:marker.image?marker.image || marker.image : "https://180dc.org/wp-content/uploads/2018/05/empty.png"}} resizeMode="cover" ></Image> </Text>
                    </View>
                  </View>
              </View>
            </Callout>
          </Marker>
              
      ))}
      <MapView.Marker coordinate={{latitude:userObjForm.latitude?userObjForm.latitude:31, longitude:userObjForm.longitude?userObjForm.longitude:35}} pinColor='blue'>
        <Callout tooltip>
          <View style ={styles.bubble}>
            <Text style={{textAlign:'center', color:'red',fontSize:16}}>המיקום של הארגון שלי</Text>
            <Text style={{textAlign:'center',marginBottom:5}}>{userObjForm.description}</Text>      
              <View style = {styles.viewImage}>
                <Text style ={{ textAlign:'center'}}>
                  <Image
                      source={{uri:userObj.image}}
                      style={{width: 150, height: 150}}
                      resizeMode="cover"
                  /> </Text>
              </View>
          </View>
        </Callout>
      </MapView.Marker>
    </MapView>
  </View>

  );
};

//make this component available to the app
export default MapsUsers;

//define styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
      }, 
      userText:{
        textAlign:'center',
        fontWeight:'bold',
        fontSize:16,
      },
      bubble: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: 6,
        borderColor: '#ccc',
        borderWidth: 0.5,
        padding: 10,
        alignItems:'center',
        width: 200,
      },
      viewImage: {
        alignItems:'center',
        ...Platform.select({
          ios: {
              marginTop: 0,

          },
          android:{
              marginTop: -50,
              // padding: 6,
          },
        }),
      },
    }) 