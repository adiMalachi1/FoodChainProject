import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import {color} from '../utils'
import { StatusBar} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {auth, db, storage} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'
import { ScrollView } from 'react-native-gesture-handler';

const EditDetail = ({navigation,route}) => {

  const {imageUser} = route.params //get image user as param
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [image, setImage] = useState(null)
  // const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);

  const pickImageCamera = async()=>{//pick image we want to upload from camera
    // ask the user for the permission to access camera 
    const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
    if(cameraStatus.granted === false) {
      Alert.alert("","הודעת שגיאה: סירבת לאפליקציה הזו לגשת למצלמה שלך, עליך לשנות זאת ולאפשר גישה על מנת להחליף תמונה",[,,{text:"אישור"}]);
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      // aspect: [4, 3],
    });
    console.log("taking a photo");
    if (!result.cancelled){
      if(auth.currentUser){ //if user chosen and didnt exit
        const userid = auth.currentUser.uid;
        // alert(userid)
        if (userid) {
          // setIsUploading(true);
          setShow(true)
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
      Alert.alert('', "הודעה: יצאת מבלי לבחור תמונה מהמצלמה, התמונה המקורית תישאר",[,,{text:"אישור"}])
      setImage(null)   
      setShow(false)
   
     }
  }


const pickImageGallery = async () => {//pick image we want to upload from library
  // ask the user for the permission to access the media library 
  const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(galleryStatus.granted === false) {
    Alert.alert("","הודעת שגיאה: סירבת לאפליקציה הזו לגשת לתמונות שלך, עליך לשנות זאת ולאפשר גישה על מנת להחליף תמונה",[,,{text:"אישור"}]);
    return;
  }
  let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        // aspect: [4, 3],
        quality: 1
    });
    // console.log("just picking... ");  
    if (!result.cancelled){ //if user chosen and didnt exit
      if(auth.currentUser){
        const userid = auth.currentUser.uid;

        if (userid) {
          // setIsUploading(true);
          setShow(true)
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
      Alert.alert('', "הודעה: יצאת מבלי לבחור תמונה מהגלריה, התמונה המקורית תישאר",[,,{text:"אישור"}])
      setImage(null)
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
      console.log('Upload succeed');
    }
  };
  
  const uploadImageAsync =  async(uri) =>{// upload the image to storage firebase,the name saving as userid 
    const userid = auth.currentUser.uid;
    if (!userid) {
      alert("error - not userid")
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
            // setIsUploading(false);
  
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

  const getData = () => { //get user data from firebase
      if (auth.currentUser) {
        const userid = auth.currentUser.uid;
        if(userid){
          db.ref(`users/`+userid).on('value', function (snapshot) {
            setUserData({userName:snapshot.val().userName,phone:snapshot.val().phone, email:snapshot.val().email, type:snapshot.val().type})
          });
        }
        else{
          Alert.alert('', "הודעת שגיאה: זהו לא המזהה הנכון",[,,{text:"אישור"}])
        }
      }
      else{
        Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת",[,,{text:"אישור"}])
      }
    }

  useEffect(() => {
    let unmounted = false
      // console.log("ruuning effect to fetch data")
      setTimeout(()=>{
      // console.log("data loaded for page")
      if(!unmounted){
      //   setTimeout(() => {
          getData()
          setLoading(true);
      }}, 1000);
      return()=>{
        unmounted = true
      }
  }, []);

  function ValidatePhoneNumber(phoneNumber) { // check if the cell phone number is valid for israel
    var regex = /^05\d([-]{0,1})\d{7}$/;
    var phone = phoneNumber.match(regex);
    if (phone) {
      return true;
    }
    return false;
  }

  const handleUpdate = () => { //updating in firebase and check validation- cant leave an empty field

     if (image === null && imageUser === null){
        Alert.alert('', "הודעת שגיאה: העלאת תמונה הינה חובה",[,,{text:"אישור"}])
        return;
    
      }
      if(userData.userName === ""||userData.phone==="" || userData.email === ""||userData.type===""){
        Alert.alert('', "הודעת שגיאה: אין אפשרות להשאיר שדה ריק, יש למלא את כל השדות",[,,{text:"אישור"}])
        return;
      }
      if(ValidatePhoneNumber(userData.phone)=== false){
        Alert.alert('', "הודעת שגיאה: מס' הפלאפון אינו תקין, אנא הזן את המספר הסלולרי שלך",[,,{text:"אישור"}])
        return;
      }
     auth.currentUser.updateEmail(userData.email) .then(()=>{
      const userid = auth.currentUser.uid;
      db.ref('users/'+userid)
      .update({
          userName:userData.userName,
          phone:userData.phone,
          email:userData.email,
          type:userData.type,
          image: image?image:imageUser,
      })
      .then(() => {
          console.log('User Updated!');
          let type = userData.type
          navigation.navigate('Tabs',type)
      })
      .catch((error)=>{
        console.log(error)
        return;
      })

     })
     .catch((error)=>{
      switch(error.message) {
        case 'The email address is already in use by another account.':
          Alert.alert('', "הודעת שגיאה: כתובת אימייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
          break;
      }
      console.log(error.message)
      navigation.navigate('עריכת פרטים אישיים')
      return;
    })
       
  }


  return (
    <ScrollView>
      <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
          <View style={{ flexDirection: "column", alignItems:'center',justifyContent:'center',marginVertical:10,}}>
          <Image
              source={{
                uri: image
                  ? image
                  : imageUser
                  ? imageUser ||
                    "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
                  :"https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
              }}
              style={styles.image}>
            </Image> 
            <TouchableOpacity style={styles.imageButton} onPress={pickImageCamera}><Text style = {{fontSize: 15, color:color.BLACK}}>תמונה מהמצלמה</Text></TouchableOpacity> 
            <TouchableOpacity style={styles.imageButton} onPress={pickImageGallery}><Text style = {{fontSize: 15, color:color.BLACK}}>תמונה מהגלריה</Text></TouchableOpacity>
          </View> 
          <View style={{display: show ? "flex": "none",alignSelf:'center'} }>
            <Text style = {{textAlign:'center',marginBottom:5,}}>נא להמתין עד שהתמונה תעלה במלואה</Text>
            <Text style = {{textAlign:'center'}}> מעלה {progress} מתוך 100% </Text>
         </View> 
         <Text  style={{marginVertical:10, writingDirection:'rtl'}}>שם הארגון</Text>
          <TextInput
            placeholder="שם הארגון"
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
        <Text  style={{marginVertical:10,writingDirection:'rtl'}} >אימייל</Text>
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
                      style={styles.conTouch} >
            <Text style = {[styles.textColor,{fontSize: 22,margin:10}]}>עדכן</Text>
          </TouchableOpacity> 
        </View> 
      </View>
      </ScrollView>
  );
};

//make this component available to the app
export default EditDetail;

//define styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.WHITE_GRAY,
    margin:10,
  }, 
  textColor:{
      fontWeight: 'bold',
      color: color.WHITE,
  },

  conTouch :{
      borderWidth:2,
      color: color.WHITE_GRAY,
      borderColor:color.WHITE_GRAY,
      backgroundColor:color.TURQUOISE,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10,
      margin:20,
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
  textInput:{
      borderWidth:1,
      borderColor: color.BLACK,
      backgroundColor: color.WHITE,
      padding:10,
      borderRadius: 10,
      textAlign:'right',  
  },
  image:{
    height: 100,
    width: 100,
    borderRadius:15,
    marginBottom:5
  },
});