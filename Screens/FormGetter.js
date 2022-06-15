import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Switch,
    TextInput,
    Alert,
    StatusBar,
} from 'react-native';
import React, { useState, useEffect } from 'react'
import {auth, db, storage} from '../FirebaseConfig';
import { color,inputGetter } from '../utils';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker'

const FormGetter = ({navigation}) => {
  
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);      
  const [description, setDescription] =  useState('');
  const [numPeople, setNumPeople] =  useState('');
  const [other, setOther] =  useState('');
  const [showInput, setShowInput] = useState(false);
  const [location, setLocation] = useState('');
  const [locationLat, setLocationLat] = useState(null);
  const [locationLon, setLocationLon] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  
  const pickImageGallery = async () => { //pick image we want to upload from library
    // ask the user for the permission to access the media library 
    const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if(galleryStatus.granted === false) {
      Alert.alert("","הודעת שגיאה: סירבת לאפליקציה הזו לגשת לתמונות שלך, עליך לשנות זאת ולאפשר גישה על מנת להמשיך",[,,{text:"אישור"}]);
      return;
    }
    let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 4],
          quality: 1
      });
      // console.log("just picking... "); 
      if (!result.cancelled){//the user choose image
        if(auth.currentUser){
          const userid = auth.currentUser.uid;
          if (userid) {
            setIsUploading(true);
            setShow(true)
            setImageUrl(result.uri)
            handleImagePicked(result);
          } 
        else {
          alert("error - not userid")
        }
       }
      else{
        Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת",[,,{text:"אישור"}])
      }
    }
      else{
        Alert.alert('', "הודעת שגיאה: יצאת מבלי לבחור תמונה מהגלריה",[,,{text:"אישור"}])
        setImage(null)
        setImageUrl(null)  
        setShow(false)
    }
};

const pickImageCamera = async()=>{//pick image we want to upload from library
  // ask the user for the permission to access camera 
  const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
  if(cameraStatus.granted === false) {
    Alert.alert("","הודעת שגיאה: סירבת לאפליקציה הזו לגשת למצלמה שלך, עליך לשנות זאת ולאפשר גישה על מנת להמשיך",[,,{text:"אישור"}]);
    return;
  }
  let result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    // aspect: [4, 3],
  });
  // console.log("taking a photo");
  if (!result.cancelled){//if user chosen and didnt exit
    if(auth.currentUser){
      const userid = auth.currentUser.uid;
      // alert(userid)
      if (userid) {
        setIsUploading(true);
        setShow(true)
        setImageUrl(result.uri)
        handleImagePicked(result);
      }
      else {
        alert("error - not userid")
      }
    }
    else{
      Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת",[,,{text:"אישור"}])
    }
     
    } 
     else{
    Alert.alert('', "הודעת שגיאה: יצאת מבלי לבחור תמונה מהמצלמה",[,,{text:"אישור"}])
    setImage(null)   
    setImageUrl(null) 
    setShow(false)
 
   }
}

const handleImagePicked = async (pickerResult) => { //handle functin to upload the chosen image to firebase
  try {
    const uploadUrl = await uploadImageAsync(pickerResult.uri);
  } catch (e) {
    console.log(e);
    Alert.alert('', "הודעת שגיאה: העלאת התמונה נכשלה, אנא נסה שנית",[,,{text:"אישור"}])
  } finally {
    setIsUploading(false);
    console.log('Upload succeed');
  }
};

const uploadImageAsync =  async(uri) =>{ // upload the image to storage firebase,the name saving as userid 
  const userid = auth.currentUser.uid;
  if (!userid) {
    Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת",[,,{text:"אישור"}])
  }
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const uploadTask =  storage.ref('images/').child(userid).put(blob)
  uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
          // Monitor uploading progress
          onProgress && onProgress(Math.fround(progress).toFixed(2));
        },
        (error) => {
          // Something went wrong -  error response
          console.log(error)
          setIsUploading(false);

        },
        () => {
               // Upload completed successfully, now we can get the download URL
               uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                 setImage(downloadURL); // set url in image state to update in db firebase too
                //  console.log("File available at", downloadURL);
               });
             }
  )
}

const onProgress = (progress) => {
  setProgress(progress);
};

const toggleSwitch = () => {//toggle for location + validation
  setIsEnabled(previousState => !previousState)
  if (!isEnabled){
    if(locationLat===null || locationLon===null ){
      Alert.alert('', "הודעת שגיאה: עליך לאשר הרשאות גישה למיקום על מנת להמשיך",[,,{text:"אישור"}])
      setLocation("")
      setIsEnabled(false)

    }
    else{
      setLocation("המיקום הנוכחי הוא: " + locationLat + ','+ locationLon)

    }}
    else{    
      setLocation("")
    }
  };
 
//catogary
const [openCato, setOpenCato] = useState(false);
const [valueCa, setValueCa] = useState('');
const [itemCato, setItemCato] = useState(inputGetter.catogary);

//tags
const [openTags, setOpenTags] = useState(false);
const [valueTags, setValueTags] = useState([]);
const [itemTags, setItemTags] = useState(inputGetter.tags);
  
//status
const [openStatus, setOpenStatus] = useState(false);
const [valueStatus, setValueStatus] = useState([]);
const [itemStatus, setItemStatus] = useState(inputGetter.status);

//types food
const [openTypeFood, setOpenTypeFood] = useState(false);
const [valueTypeFood, setValueTypeFood] = useState([]);
const [itemTypeFood, setItemTypeFood] = useState(inputGetter.typeFood);

//time options to pick up the food
const [openTimePick, setOpenTimePick] = useState(false);
const [valueTimePick, setValueTimePick] = useState([]);
const [itemTimePick, setItemTimePick] = useState(inputGetter.timePick);

//times in hours
const [openTime, setOpenTime] = useState(false);
const [valueTime, setValueTime] = useState([]);
const [itemTime, setItemTime] = useState(inputGetter.timeHours);

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
        Alert.alert('',"סירבת לאפליקציה הזו לגשת למיקום שלך, עליך לשנות זאת ולאפשר גישה על מנת להמשיך",[,,{text:"אישור"}]);
          return;
      }
      let location = await Location.getCurrentPositionAsync();
      setLocationLat(location.coords.latitude)
      setLocationLon(location.coords.longitude)
      
    })();}},3000)
  return()=>{
    unmounted = true
  }

}, []);

const handleSignUpCon = () =>{//before continue, check validation + put the information fields in firebase
 
  if(valueCa == "" || valueTags == "" ||valueStatus == "" || valueTime == "" || valueTimePick == "" || valueTypeFood == ""|| numPeople ==""){
    Alert.alert('', "הודעת שגיאה: שדות אלו הן שדות חובה, אנא מלא אותן",[,,{text:"אישור"}])
    return;
  }
  if(valueCa == "אחר" && other == ""){
    Alert.alert('', "הודעת שגיאה: זהו שדה חובה, עליך למלא את סוג הקטגוריה",[,,{text:"אישור"}])
    return;

  }

  if (image === null || imageUrl === null){
    Alert.alert('', "הודעת שגיאה: העלאת תמונה הינה חובה",[,,{text:"אישור"}])
    return;

  }
  if(numPeople === '0'|| numPeople[0] === '0' || numPeople.includes('.') || numPeople.includes('-')){
    Alert.alert('', "הודעת שגיאה: כמות האנשים אינו יכול להיות תווים שאינם מספרים, שווה ל-0 או להתחיל ב-0, אנא תשנה ונסה שנית",[,,{text:"אישור"}])
    return;
  }
  if(locationLat === null || locationLon === null || isEnabled == false){
    Alert.alert('', "הודעת שגיאה: מיקום נוכחי הינו שדה חובה",[,,{text:"אישור"}])
    
    return;
  }
  // alert(image)
  if (auth.currentUser) {
    const userid = auth.currentUser.uid;

   if (userid) {
      //  db.ref('users/'+userid).update({ //שם הכל ביחד עם התכונות של השאלון לאותו משתמש
      db.ref('users/'+userid).update({
        image:image
      }) .catch((error) => {
      alert(error.message);
       });
      db.ref('users/'+userid+'/Form').set({// מפריד את תכונות השאלון לקטגוריה נפרדת
            description: description,
            numberPeople: numPeople,
            catogary: valueCa,
            tags: valueTags,
            status : valueStatus,
            typeFood: valueTypeFood,
            other: other,
            Time : valueTime,
            location: location,
            latitude: locationLat,
            longitude: locationLon,
            // image: image,
            timePick: valueTimePick,

            
       }) .catch((error) => {
        console.log(error.message);
    });
    let type = 'getter'
    navigation.navigate('Tabs',{type})
    }

  }
}
return (   
  <ScrollView>
    <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
    <View style={styles.container}>
      <Text  style={{marginVertical:15,writingDirection:'rtl',}}>תיאור קצר</Text>
      <TextInput
      value={description}
      onChangeText={(description) => setDescription(description)}
      placeholder="הסבר קצר על הארגון/עמותה"
      style = {styles.textInput}
      autoFocus ={true}
      multiline={true}
      selectionColor={color.BLACK}
      activeUnderlineColor={color.WHITE}
      underlineColor={color.WHITE}
      /> 
      <Text  style={{marginVertical:20,writingDirection:'rtl'}}>קטגוריה</Text>
      <DropDownPicker 
        open={openCato}
        value={valueCa}
        items={itemCato}
        setOpen={setOpenCato}
        setValue={setValueCa}
        setItems={setItemCato}
        labelStyle={{textAlign:'left'}}
        selectedItemContainerStyle={{direction:'rtl'}}
        listItemLabelStyle={{
          textAlign:"left",
          direction:'rtl',
        }}
        placeholderStyle={{textAlign:'left',}}
        style = {{direction:'rtl' }}
        dropDownContainerStyle={{
          position: 'relative',
          top:0,
        }}
        placeholder= {'אנא בחר את הקטגוריה המתאימה'} 
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
        }}
        closeAfterSelecting={true}
        onChangeValue={(item) => {
          if (item === "אחר"){  
              //showing input
            setShowInput(true)
          }
          else{
            //need set to false if not "others", because user can change select a lot of times
            setShowInput(false)
            }
        }}>
      </DropDownPicker>
      <TextInput 
      value = {other}  
      placeholder="אחר"
      onChangeText={(other) => setOther(other)}
      style = {[styles.textInput,{borderWidth:0.5,marginTop:10,display: showInput ? "flex": "none"}]}
      selectionColor={color.BLACK}
      // autoFocus ={true}
      activeUnderlineColor={color.WHITE}
      underlineColor={color.WHITE}/>   
      <Text  style={{marginVertical:20,writingDirection:'rtl'}}>תגים</Text>
      <DropDownPicker 
        open={openTags}
        value={valueTags}
        items={itemTags}
        setOpen={setOpenTags}
        setValue={setValueTags}
        setItems={setItemTags}
        multiple={true}
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
        }}
        labelStyle={{textAlign:'left'}}
        selectedItemContainerStyle={{direction:'rtl'}}
        listItemLabelStyle={{
          textAlign:"left",
          direction:'rtl',
        }}
        placeholderStyle={{textAlign:'left',}}
        style = {{direction:'rtl' }}
        dropDownContainerStyle={{
          position: 'relative',
          top:0,
        }}
        mode= 'BADGE'
        placeholder= {'אנא בחר את התגים המתאימים'}
      ></DropDownPicker>
      <Text  style={{marginVertical:20,writingDirection:'rtl'}}>סטטוס</Text>
      <DropDownPicker 
        open={openStatus}
        value={valueStatus}
        items={itemStatus}
        setOpen={setOpenStatus}
        setValue={setValueStatus}
        setItems={setItemStatus}
        dropDownContainerStyle={{
          position: 'relative',
          top:0,
        }}
        labelStyle={{textAlign:'left'}}
        selectedItemContainerStyle={{direction:'rtl'}}
        listItemLabelStyle={{
          textAlign:"left",
          direction:'rtl',
        }}
        style = {{direction:'rtl' }}
        placeholderStyle={{textAlign:'left',}}
        placeholder= {'אנא בחר את הסטטוס'}    
        closeAfterSelecting={true}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
      ></DropDownPicker>
      <Text  style={{fontSize:20, margin:20,textAlign:'center'}}>הבקשה שלך</Text>
      <Text  style={{writingDirection:'rtl',}}>צרף תמונה שממחישה את פעילות הארגון</Text>
      <View style={{ flexDirection: "column", alignItems:'center',justifyContent:'center',marginVertical:20,}}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImageCamera}><Text style = {{fontSize: 15, color:color.BLACK}}>תמונה מהמצלמה</Text></TouchableOpacity> 
        <TouchableOpacity style={styles.imageButton} onPress={pickImageGallery}><Text style = {{fontSize: 15, color:color.BLACK}}>תמונה מהגלריה</Text></TouchableOpacity> 
        {imageUrl && <Image source={{uri:imageUrl}} style = {{ width:100, height:100,borderRadius:15,marginTop:5 }} />}
      </View>  
      <View style={{display: show ? "flex": "none",alignSelf:'center'} }>
          <Text> מעלה {progress} מתוך 100% </Text>
      </View>  
      <Text  style={{marginBottom:20,writingDirection:'rtl'}}>סוג האוכל שתרצו לקבל</Text>
      <DropDownPicker 
        open={openTypeFood}
        value={valueTypeFood}
        items={itemTypeFood}
        setOpen={setOpenTypeFood}
        setValue={setValueTypeFood}
        setItems={setItemTypeFood}
        multiple={true}
        mode= 'BADGE'
        dropDownContainerStyle={{
          position: 'relative',
          top:0,
        }}
        placeholder= {'אנא בחר את סוג האוכל המתאים'}
        labelStyle={{textAlign:'left'}}
        selectedItemContainerStyle={{direction:'rtl'}}
        listItemLabelStyle={{
          textAlign:"left",
          direction:'rtl',
        }}
        placeholderStyle={{textAlign:'left',}}
        style = {{direction:'rtl' }}
        listMode="SCROLLVIEW"
        scrollViewProps={{
            nestedScrollEnabled: true,
        }}
     ></DropDownPicker>
      <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>כמה אנשים מאכילים באופן קבוע?</Text>
      <TextInput
          value={numPeople}
          onChangeText={(numPeople) => setNumPeople(numPeople)}
          placeholder="אנא הזן מספר"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          style = {[styles.textInput,{height:45,},]}
          activeUnderlineColor={color.WHITE}
          underlineColor={color.WHITE}
          selectionColor={color.BLACK}

        />
      <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>הזמן הכי טוב לאיסוף, בין השעות:</Text>
      <DropDownPicker 
        open={openTime}
        value={valueTime}
        items={itemTime}
        setOpen={setOpenTime}
        setValue={setValueTime}
        setItems={setItemTime}
        multiple={true}
        mode = 'BADGE'
        dropDownContainerStyle={{
          position: 'relative',
          top:0,
        }}
        labelStyle={{textAlign:'left'}}
        selectedItemContainerStyle={{direction:'rtl'}}
        listItemLabelStyle={{
          textAlign:"left",
          direction:'rtl',
        }}
        placeholderStyle={{textAlign:'left',}}
        style = {{direction:'rtl' }}
        placeholder= {'אנא בחר את הזמן הרצוי'}    
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}
        
      ></DropDownPicker>
          <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>יום איסוף</Text>
          < DropDownPicker
            open={openTimePick}
            value={valueTimePick}
            items={itemTimePick}
            setOpen={setOpenTimePick}
            setValue={setValueTimePick}
            setItems={setItemTimePick} 
      
          multiple={true}
          mode = 'BADGE'
          dropDownContainerStyle={{
            position: 'relative',
            top:0,
          }}
          labelStyle={{textAlign:'left'}}
          selectedItemContainerStyle={{direction:'rtl'}}
          listItemLabelStyle={{
            textAlign:"left",
            direction:'rtl',
          }}
          placeholderStyle={{textAlign:'left',}}
          style = {{direction:'rtl' }}
          placeholder= {'יום איסוף'}    
          listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
          }}
      > </DropDownPicker>
      <View style = {{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <Text style = {{marginTop:20,writingDirection:'rtl',marginBottom:10}}>
          השתמש במיקום הנוכחי שלי:  </Text>
          <Switch
            trackColor={{ false: "#767577", true: color.TURQUOISE1 }}
            thumbColor={isEnabled ? color.TURQUOISE : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
            style = {styles.toggle}
        />
      </View>
      <Text style = {{marginVertical:10,writingDirection:'rtl',textAlign:'center'}}>
      {location}
      </Text>
      <View style = {{ alignItems:'center'}}>
        <TouchableOpacity   onPress={handleSignUpCon} style={styles.conTouch} >
          <Text style = {[styles.textColor,{fontSize: 20,}]}>המשך</Text>
        </TouchableOpacity> 
      </View> 
    </View>
    </ScrollView>
)};

//make this component available to the app
export default FormGetter;

//define styling
const styles = StyleSheet.create({
  container:{
    width:'90%',
    flex:1,
    alignSelf:'center'
  }, 
  textColor:{
    fontWeight: 'bold',
    color: color.WHITE,
  },
  imageButton :{
    borderWidth:2,
    borderColor:color.TURQUOISE,
    alignItems:'center',
    justifyContent:'center',
    width:140,
    height:50,
    borderRadius:10,
    marginVertical:5, 
  },
  conTouch :{
    borderColor:color.WHITE_GRAY,
    alignItems:'center',
    justifyContent:'center',
    width:150,
    height:50,
    backgroundColor:color.TURQUOISE,
    borderRadius:10,
    marginBottom:10,
  },
  textInput:{
    borderWidth:1,
    borderColor:color.BLACK,
    backgroundColor: color.WHITE,
    padding:10,
    borderRadius:5,
    height:45,
    textAlign:'right', 
  },
  toggle:{
    ...Platform.select({
      // ios: {
      //   flexDirection: 'row',
      // },
    android: {
      transform: [{ scaleX: -1 }]
    }}),
  }, 
})