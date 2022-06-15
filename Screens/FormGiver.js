import { 
        View, 
        Text, 
        StyleSheet,
        TouchableOpacity, 
        Switch,
        Alert,
        Image,
        StatusBar,
        TextInput,
    } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import React, { useState, useEffect } from 'react'
import {auth, db,storage} from '../FirebaseConfig';
import { color,inputGiver } from '../utils';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const FormGiver = ({navigation,route}) => {
 
  const [image, setImage] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [progress, setProgress] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [show, setShow] = useState(false);
  const [description, setDescription] =  useState('');
  const [amountKg, setAmountKg] =  useState('');
  const [location, setLocation] = useState(''); 
  const [locationLat, setLocationLat] = useState(null);
  const [locationLon, setLocationLon] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);

  const pickImageGallery = async () => {//pick image we want to upload from library
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
      if (!result.cancelled){ //the user choose image
        if(auth.currentUser){
          const userid = auth.currentUser.uid;
          if (userid) {
            setIsUploading(true);
            setShow(true)
            setImageUrl(result.uri)
            handleImagePicked(result);
          } 
        else {
          Alert.alert('', "הודעת שגיאה: זהו לא המזהה הנכון",[,,{text:"אישור"}])
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
    if (!result.cancelled){ //if user chosen and didnt exit
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

const handleImagePicked = async (pickerResult) => {//handle functin to upload the chosen image to firebase
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
                 setImage(downloadURL);// set url in image state to update in db firebase too
                 console.log("File available at", downloadURL);
               });
             }
  )
       
}

const onProgress = (progress) => {
  setProgress(progress);
};

const toggleSwitch = () => { //toggle for location + validation
  setIsEnabled(previousState => !previousState)
  if (!isEnabled){
    if(locationLat===null || locationLon===null ){
      Alert.alert('', "הודעת שגיאה: עליך לאשר הרשאות גישה למיקום על מנת להמשיך",[,,{text:"אישור"}])
      setLocation("")
      setIsEnabled(false)
    }
    else{
      setLocation("המיקום הנוכחי הוא: " + locationLat + ','+ locationLon)
    }
  }
  else{    
      setLocation("")
  }
};

//catogary
const [openCato, setOpenCato] = useState(false);
const [valueCa, setValueCa] = useState('');
const [itemCato, setItemCato] = useState(inputGiver.catogary);

//tags
const [openTags, setOpenTags] = useState(false);
const [valueTags, setValueTags] = useState([]);
const [itemTags, setItemTags] = useState(inputGiver.tags);
  
//status
const [openStatus, setOpenStatus] = useState(false);
const [valueStatus, setValueStatus] = useState([]);
const [itemStatus, setItemStatus] = useState(inputGiver.status);

//types food 
const [openTypeFood, setOpenTypeFood] = useState(false);
const [valueTypeFood, setValueTypeFood] = useState([]);
const [itemTypeFood, setItemTypeFood] = useState(inputGiver.typeFood);
  
//time options to pick up the food
const [openTimePick, setOpenTimePick] = useState(false);
const [valueTimePick, setValueTimePick] = useState([]);
const [itemTimePick, setItemTimePick] = useState(inputGiver.timePick);

//times in hours
const [openTime, setOpenTime] = useState(false);
const [valueTime, setValueTime] = useState([]);
const [itemTime, setItemTime] = useState(inputGiver.timeHours);
  
//within a few hours the food should be collected
const [openWhen, setOpenWhen] = useState(false);
const [valueWhen, setValueWhen] = useState([]);
const [itemWhen, setItemWhen] = useState(inputGiver.when);

useEffect(() => {
  let unmounted = false
  // console.log("ruuning effect to fetch data")
  setTimeout(()=>{
  // console.log("data loaded for page" )
  if(!unmounted){
    (async () => {
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

const handleSignUpCon = () =>{ //before continue, check validation + put the information fields in firebase
  
  if(valueCa == "" || valueTags == "" ||valueStatus == "" || valueTime == "" || valueTimePick == "" || valueTypeFood == ""|| valueWhen == "" || amountKg==""){
    Alert.alert('', "הודעת שגיאה: כל השדות הינן שדות חובה, אנא מלא את כולן",[,,{text:"אישור"}])
    return;
  }

  if (image === null || imageUrl === null){
    Alert.alert('', "הודעת שגיאה: העלאת תמונה הינה חובה",[,,{text:"אישור"}])
    return;
  }
  if(amountKg === '0'|| amountKg[0] === '0' || amountKg.includes('.') || amountKg.includes('-')){
    Alert.alert('', "הודעת שגיאה: כמות האוכל אינה יכולה להיות תווים שאינם מספרים, שווה ל-0 או להתחיל ב-0, אנא תשנה ונסה שנית",[,,{text:"אישור"}])
    return;
  }
  if(locationLat === null || locationLon === null || isEnabled == false){
    Alert.alert('', "הודעת שגיאה: מיקום נוכחי הינו שדה חובה",[,,{text:"אישור"}])    
    return;
  }
  if (auth.currentUser) {
    const userid = auth.currentUser.uid;
    if (userid) {
        //  db.ref('users/'+userid).update({ //שם הכל ביחד עם התכונות של השאלון לאותו משתמש
          db.ref('users/'+userid).update({
            image:image
          }) .catch((error) => {
              console.log(error.message);
          });
          db.ref('users/'+userid+'/Form').set({// מפריד את תכונות השאלון לקטגוריה נפרדת
              description: description,
              catogary: valueCa,
              tags: valueTags,
              status : valueStatus,
              typeFood: valueTypeFood,
              timePick: valueTimePick,
              when: valueWhen,
              location: location,
              Time : valueTime,
              amount : amountKg,
              latitude: locationLat,
              longitude: locationLon,
        }).catch((error) => {
          console.log(error.message);
        });
        
        let type = 'giver'
        navigation.navigate('Tabs',{type} )           

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
        placeholder="הסבר קצר על הארגון"
        style = {styles.textInput}
        multiline={true}
        autoFocus ={true}
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
        closeAfterSelecting={true}></DropDownPicker>
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
        placeholder= {'אנא בחר את התגים המתאימים'}></DropDownPicker>
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
        placeholderStyle={{textAlign:'left',}}
        style = {{direction:'rtl' }}
        placeholder= {'אנא בחר את הסטטוס'}    
        closeAfterSelecting={true}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,}}></DropDownPicker>
          <Text  style={{fontSize:20, margin:20,textAlign:'center'}}>ההצעה שלך</Text>
          <Text  style={{writingDirection:'rtl',}}>צרף תמונה להמחשת ההצעה</Text>
      <View style={{ flexDirection: "column", alignItems:'center',justifyContent:'center',marginVertical:20,}}>

      <TouchableOpacity style={styles.imageButton} onPress={pickImageCamera}><Text style = {{fontSize: 15, color:color.BLACK}}>תמונה מהמצלמה</Text></TouchableOpacity> 
      <TouchableOpacity style={styles.imageButton} onPress={pickImageGallery}><Text style = {{fontSize: 15, color:color.BLACK}}>תמונה מהגלריה</Text></TouchableOpacity> 
      {imageUrl && <Image source={{uri:imageUrl}} style = {{ width:100, height:100,borderRadius:15,marginTop:5 }} />}</View>  
      <View style={{display: show ? "flex": "none",alignSelf:'center'} }>
          <Text> מעלה {progress} מתוך 100% </Text>
      </View>  
      <Text  style={{ marginBottom:20,writingDirection:'rtl'}}>סוג האוכל</Text>
        <DropDownPicker 
        open={openTypeFood}
        value={valueTypeFood}
        items={itemTypeFood}
        setOpen={setOpenTypeFood}
        setValue={setValueTypeFood}
        setItems={setItemTypeFood}
        multiple={true}
        dropDownContainerStyle={{
          position: 'relative',
          top:0,
        }}
        mode= 'BADGE'
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
        }}></DropDownPicker>
      <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>כמות האוכל? (בק"ג)</Text>

      <TextInput
          value={amountKg}
          onChangeText={(amountKg) => setAmountKg(amountKg)}
          placeholder="אנא הזן מספר"
          keyboardType="numeric"
          autoCapitalize="none"
          autoCorrect={false}
          style = {styles.textInput}
          activeUnderlineColor={color.WHITE}
          underlineColor={color.WHITE}
          selectionColor={color.BLACK}
        />
      <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>יום איסוף</Text>
      < DropDownPicker
        open={openTimePick}
        value={valueTimePick}
        items={itemTimePick}
        setOpen={setOpenTimePick}
        setValue={setValueTimePick}
        setItems={setItemTimePick} 
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
        multiple = {true}
        mode = 'BADGE'
        placeholder= {'אנא בחר יום איסוף'} 
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
      }}> </DropDownPicker>
    
      <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>יש לצרוך עד</Text>
      <DropDownPicker
        open={openWhen}
        value={valueWhen}
        items={itemWhen}
        setOpen={setOpenWhen}
        setValue={setValueWhen}
        setItems={setItemWhen} 
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
        placeholder= {'אנא בחר תוך כמה זמן יש לצרוך את האוכל'} 
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
      }}> </DropDownPicker>
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
        closeAfterSelecting={true}
        listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
        }}></DropDownPicker>
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
      <Text style = {{writingDirection:'rtl', textAlign:'center',marginVertical:10}}>
     {location}
     </Text>
      </View>
      <View style = {{ alignItems:'center'}}>
      <TouchableOpacity onPress={handleSignUpCon} style={styles.conTouch} >
        <Text style = {[styles.textColor,{fontSize: 20,}]}>המשך</Text>
      </TouchableOpacity> 
    </View>
    </ScrollView>
  );
}

//make this component available to the app
export default FormGiver;

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
  conTouch :{
    borderColor:color.WHITE_GRAY,
    alignItems:'center',
    justifyContent:'center',
    width:100,
    height:50,
    backgroundColor:color.TURQUOISE,
    borderRadius:10,
    marginBottom:10,
    }, 
  imageButton :{
      borderWidth:2,
      borderColor:color.TURQUOISE,
      alignItems:'center',
      justifyContent:'center',
      width:140,
      height:50,
      // backgroundColor:'#009387',
      borderRadius:10,
      marginVertical:5, 
  },

  textInput:{
      borderWidth:1,
      borderColor:color.BLACK,
      backgroundColor:color.WHITE,
      padding:10,
      height:45,
      textAlign:'right',
      borderRadius:5,
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
});