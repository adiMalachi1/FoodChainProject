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
  } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import DropDownPicker from 'react-native-dropdown-picker';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import {auth, db, storage} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'
import { color } from 'react-native-reanimated';

const EditProfile = ({navigation}) => {
    const user = auth.currentUser
    // console.log(user)
    const [imageUrl, setImageUrl] = useState(undefined);

    const [userData, setUserData] = useState({});
    const [data, setData] = useState('');
    const [loading, setLoading] = useState(false);

    const getData = () => {
      if (auth.currentUser) {
        const userid = auth.currentUser.uid;
      
        // const userid = auth.currentUser.uid;
      if(userid){
        db.ref(`users/`+userid).on('value', function (snapshot) {
           setData(snapshot.val());
           setValueTypeFood(snapshot.val().Form.typeFood)
           setValueTimePick(snapshot.val().Form.timePick)
           setUserData({userName:snapshot.val().userName,phone:snapshot.val().phone, email:snapshot.val().email})
        //    setValueWhen(snapshot.val().Form.when)
           setLoading(true);
        });
     }
     else{
       alert("ERROR: not userid")
     }
    }
     else{alert("ERROR: not auth.currentUser")}
    }

     useEffect(() => {
      if (auth.currentUser) {
        const userid = auth.currentUser.uid;
    
       if (userid) {
        storage
          .ref('images/').child(userid) //name in storage in firebase console
          .getDownloadURL()
          .then((url) => {
            setImageUrl(url);
            // console.log(url)
          })

          .catch((e) => console.log('Errors while downloading => ', e));
      }}
        setTimeout(() => {
          getData()
          setLoading(true);
        }, 1000);
      }, []);

      const [hasGalleryPermission, setHasGalleryPermission] = useState(null)
      const [image, setImage] = useState(null)
      
      if(hasGalleryPermission === false){
        // return <Text>אין גישה</Text>
          alert("אין גישה!")
      }

      useEffect(() => {
        (async ()=>{
          const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === 'granted');
        }
        )();
      }, []);
         
   
      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });
    
        if (!result.cancelled) {////להוסיף הודעה במקרה של שגיאה
          if (auth.currentUser) {
            const userid = auth.currentUser.uid;
        
           if (userid) {
                setImage(result.uri)  
                const response = await fetch(result.uri);
                const blob = await response.blob();          
                storage.ref('images/').child(userid).put(blob)
                .catch((error) => {
                  alert(error.message);
              });
             }
           
        } 
       
        }
    };
    
      
      const pickImageCamera = async()=>{
        let result = await ImagePicker.launchCameraAsync(
          {
            mediaTypesL: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [4,3],
            quality:1,
      
          }
        );
        // console.log(result)
        if (!result.cancelled) {////להוסיף הודעה במקרה של שגיאה
          if (auth.currentUser) {
            const userid = auth.currentUser.uid;
           if (userid) {
                setImage(result.uri)  
                const response = await fetch(result.uri);
                const blob = await response.blob();          
                storage.ref('images/').child(userid).put(blob)
                .then(() => {
                  console.log('it work')
                })
                .catch(error => {
                    console.log('it does not work')
                    console.error(error)
                            //       alert(error.message);

                })
            }
      
          } 
        
        }
      };
      if(hasGalleryPermission === false){
          return <Text>אין גישה</Text>
      }
      useEffect(() => {
        (async ()=>{
          const galleryStatus = await ImagePicker.requestCameraPermissionsAsync();
          setHasGalleryPermission(galleryStatus.status === 'granted');
        }
        )();
      }, []);
 
    function onChaneHandler(item){
        if(item != null){
        if (item.includes("אחר")){  //you writes if condition here, it's an example of code below
          setShowInput(true)
        }
        else{
          setShowInput(false)
          }
        }
        else{
            alert("errror")
        }
    }

      const handleUpdate = async() => {
       
        const userid = auth.currentUser.uid;
        db.ref('users/'+userid)
        .update({
            userName:userData.userName,
            phone:userData.phone,
            email:userData.email,


        })
        db.ref('users/'+userid+'/Form')
        .update({
       
        catogary: valueCa || data.Form.catogary,
        other: userData.other || data.Form.other||null,
        typeFood: valueTypeFood ,
        amount : userData.amount || data.Form.amount,
        timePick: valueTimePick,
        when: valueWhen || data.Form.when,
        location:location || data.Form.location,
        latitude:locationLat || data.Form.latitude,
        longitude:locationLon || data.Form.longitude,

        })
        .then(() => {
          console.log('User Updated!');
          Alert.alert(
           'הפרופיל עודכן בהצלחה!'
          );
          let type = 'giver'
          navigation.navigate('Tabs',type)
        })
      }
      const [openCato, setOpenCato] = useState(false);
      const [valueCa, setValueCa] = useState('');
      const [itemCato, setItemCato] = useState([
        {label: 'סיטונאי', value: 'סיטונאי'},
        {label: 'קמעונאי', value: 'קמעונאי'},
        {label: 'מסעדה', value: 'מסעדה'},
        {label: 'מלון', value: 'מלון'},
        {label: 'מקום מפגש', value: 'מקום מפגש'},
        {label: 'חברת קייטרינג', value: 'חברת קייטרינג'},
        {label: 'חקלאי', value: 'חקלאי'},
        {label: 'קואופרטיב חקלאי', value: 'קוטופרטיב חקלאי'},
        {label: 'סופרמרקט', value: 'סופרמרקט'},
        {label: 'יצרן', value: 'יצרן'},
        {label: 'מאפיה', value: 'מאפיה'},
        {label: 'בניין משרדים', value: 'בניין משרדים'},
        {label: 'בית ספר', value: 'בית ספר'},
        {label: 'מכולת', value: 'מכולת'}
      ]);
    const [other, setOther] =  useState('');
    const [showInput, setShowInput] = useState(false);
    const [openTypeFood, setOpenTypeFood] = useState(false);
    const [valueTypeFood, setValueTypeFood] = useState([]);
    const [itemTypeFood, setItemTypeFood] = useState([
        {label: 'הכל', value: 'הכל'},
        {label: 'פירות טריים וירקות', value: 'פירות טריים וירקות'},
        {label: 'מוצרים ארוזים יבשים', value: 'מוצרים ארוזים יבשים'},
        {label: 'מנות מבושלות', value: 'מנות מבושלות'},
        {label: 'אוכל אצבעות', value: 'אוכל אצבעות'},
        {label: 'מוצרים בקירור שפג תוקפם', value: 'מוצרים בקירור שפג תוקפם'},
        {label: 'סלטים', value: 'סלטים'},
        {label: 'ארוחות ארוזות', value: 'ארוחות ארוזות'},
        {label: 'משקאות', value: 'משקאות'},
        {label: 'ממתקים וקינוחים', value: 'ממתקים וקינוחים'},
        {label: 'כריכים', value: 'כריכים'},
        {label: 'לחם ואפייה', value: 'לחם ואפייה'},
        {label: 'אחר', value: 'אחר'}

        ]);
        const [openTimePick, setOpenTimePick] = useState(false);
        const [valueTimePick, setValueTimePick] = useState([]);
        const [itemTimePick, setItemTimePick] = useState([
        {label: 'ראשון', value: 'ראשון'},
        {label: 'שני', value: 'שני'},
        {label: 'שלישי', value: 'שלישי'},
        {label: 'רביעי', value: 'רביעי'},
        {label: 'חמישי', value: 'חמישי'},
        {label: 'שישי', value: 'שישי'},
        {label: 'שבת', value: 'שבת'},
        {label: 'חגים יהודיים', value: 'חגים יהודיים'},
        {label: 'חגים נוצריים', value: 'חגים נוצריים'},
        {label: 'חגים מוסלמים', value: 'חגים מוסלמים'},
        {label: 'מידי פעם', value: 'מידי פעם'}

        ]);
        const [opeמWhen, setOpenWhen] = useState(false);
        const [valueWhen, setValueWhen] = useState('');
        const [itemWhen, setItemWhen] = useState([
        {label: '3 שעות ', value: '3'},
        {label: '6 שעות ', value: '6'},
        {label: '12 שעות ', value: '12'},
        {label: '24 שעות ', value: '24'},
        {label: '48 שעות ', value: '48'},
        ]);

        const [location, setLocation] = useState('');
        const [locationLat, setLocationLat] = useState(null);
        const [locationLon, setLocationLon] = useState(null);
        useEffect(() => {
            (async () => {
              let { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
              }
        
              let location = await Location.getCurrentPositionAsync({});
              let address = await Location.reverseGeocodeAsync(location.coords)
              // console.log(location.coords.latitude,location.coords.longitude)
              // setLocation(location.coords.latitude,  location.coords.longitude);
              setLocationLat(location.coords.latitude)
              setLocationLon(location.coords.longitude)
              
             
              
            })();
          }, []);
          const [isEnabled, setIsEnabled] = useState(false);
          const toggleSwitch = () => {
            setIsEnabled(previousState => !previousState)
            if (!isEnabled){
            //   alert("true")
              setLocation("המיקום הנוכחי הוא: " + locationLat + ','+ locationLon)
             
              // setShowComponent(true)
            }
             else{    
              // alert("false")
              setLocation("")
              // setShowComponent(false)
            }
            };
        return (
        <ScrollView>
        <View style={{ paddingTop:20, margin:20,}}>
       
          <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
          <ImageBackground
                source={{
                  uri: image
                    ? image
                    : imageUrl
                    ? imageUrl ||
                      'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg'
                    : 'https://lh5.googleusercontent.com/-b0PKyNuQv5s/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclxAM4M1SCBGAO7Rp-QP6zgBEUkOQ/s96-c/photo.jpg',
                }}
                style={{height: 100, width: 100}}
                imageStyle={{borderRadius: 15}}>
               

              </ImageBackground> 
              <View style={{ flexDirection: "column", alignItems:'center',justifyContent:'center',margin:10,}}>

<TouchableOpacity  onPress={()=>pickImageCamera()}><Text style = {{fontSize: 18, color:'blue'}}>תמונה מהמצלמה</Text></TouchableOpacity> 

<TouchableOpacity onPress={()=>pickImage()}><Text style = {{fontSize: 18, color:'blue'}}>תמונה מהגלריה</Text></TouchableOpacity> 
{/* {image && <Image source={{uri:image}} style = {{ width:70, height:70,borderRadius:10,margin:5 }} />}</View> */}
    </View>                
    </View>

        <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>כמות האוכל? (בק"ג)</Text>

         <TextInput
        placeholder="אנא הזן מספר"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        style = {[styles.textInput,{height:45,},]}
        activeUnderlineColor="white"
        underlineColor='white'
        value={userData ? userData.amount : ''} 
        onChangeText={(txt) => setUserData({...userData, amount: txt})}
        //   ={true}
        // underlineColorAndroid={"transparent"}
        selectionColor={"black"}

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
      selectedItemContainerStyle={{
        direction:'rtl',

      }}
      listItemLabelStyle={{
        textAlign:"left",
        direction:'rtl',
      }}
      placeholderStyle={{
          textAlign:'left',
        }
      }

      style = {{direction:'rtl',backgroundColor:'#7FFFD4', }}
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
        
    ></DropDownPicker>
    
     <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>סוג האוכל</Text>

       
    <DropDownPicker 
    
        open={openTypeFood}
        value={valueTypeFood}
        items={itemTypeFood}
        setOpen={setOpenTypeFood}
        setValue={setValueTypeFood}
        setItems={setItemTypeFood}
        multiple={true}
        multipleText="תודה שבחרת"
        placeholder= {'אנא בחר את סוג האוכל המתאים'}
        // zIndex={1000}
        // zIndexInverse={3000}
        listMode="SCROLLVIEW"
        scrollViewProps={{
            nestedScrollEnabled: true,
        }}
        labelStyle={{textAlign:'left'}}
        selectedItemContainerStyle={{
        direction:'rtl',
        }}
        listItemLabelStyle={{
        textAlign:"left",
        direction:'rtl',
        }}
        placeholderStyle={{
            textAlign:'left',
        }}

        style = {{direction:'rtl',backgroundColor:'#7FFFD4' }}
        dropDownContainerStyle={{
            position: 'relative',
            top:0,
        }}
        mode= 'BADGE'
        // renderBadgeItem={(values) => <Badge>{console.log(values)}</Badge>  }
    
        //  onSelectItem={(item) => {handleOrangeClick(item)}  }
        onChangeValue={(item) => onChaneHandler(item)}
        
    ></DropDownPicker>
    <TextInput 
        value={userData ? userData.other : ''}
        onChangeText={(txt) => setUserData({...userData, other: txt})}
        placeholder="אחר"
        style = {[styles.textInput,{marginTop:10,height:45,display: showInput ? "flex": "none"}]}
        // multiline={true}
        selectionColor={"black"}
        autoFocus ={true}
        activeUnderlineColor="white"
        underlineColor='white'/>
    <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>יום איסוף</Text>
    < DropDownPicker
        open={openTimePick}
        value={valueTimePick}
        items={itemTimePick}
        setOpen={setOpenTimePick}
        setValue={setValueTimePick}
        setItems={setItemTimePick} 
        // zIndex={2000}
        // zIndexInverse={2000}
        mode= 'BADGE'
        multiple = {true}
        multipleText="תודה שבחרת"
        placeholder= {'אנא בחר יום איסוף'} 
        listMode="SCROLLVIEW"
            scrollViewProps={{
            nestedScrollEnabled: true,
        }}
        dropDownContainerStyle={{
            position: 'relative',
            top:0,
        }}
            // closeAfterSelecting={true}
   > 
   </DropDownPicker>
   <Text  style={{ marginVertical:20,writingDirection:'rtl'}}>יש לצרוך עד</Text>

      < DropDownPicker
        open={opeמWhen}
        value={valueWhen}
        items={itemWhen}
        setOpen={setOpenWhen}
        setValue={setValueWhen}
        setItems={setItemWhen} 
        // zIndex={1000}
        // zIndexInverse={3000}
        dropDownContainerStyle={{
            position: 'relative',
            top:0,
        }}

        closeAfterSelecting={true}

        // multipleText="תודה שבחרת"
        placeholder= {'אנא בחר תוך כמה זמן יש לצרוך את האוכל'} 
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
      }}>

      </DropDownPicker>
      <Text  style={{marginVertical:20,writingDirection:'rtl'}}>מיקום</Text>
      <View style = {{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
      <Text style = {{marginVertical:10,writingDirection:'rtl'}}>
        השתמש במיקום הנוכחי שלי:  </Text>
         <Switch
          trackColor={{ false: "#767577", true: "#78CECC" }}
          thumbColor={isEnabled ? "#009387" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=> toggleSwitch()}
          value={isEnabled}
          
          // style = {{margin:10,writingDirection:'rtl'}}
      />

    </View>
    <Text  style={{marginVertical:10, writingDirection:'rtl'}}>שם הארגון</Text>
      {/* <View style={styles.action}> */}
          {/* <FontAwesome name="user-o" color="#333333" size={20} /> */}
          <TextInput
            placeholder="שם הארגון"
            placeholderTextColor="#666666"
            autoCorrect={false}
            value={userData ? userData.userName : ''} 
            onChangeText={(txt) => setUserData({...userData, userName: txt})}
            style={styles.textInput}
          />
        {/* </View> */}
        
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
    <TouchableOpacity onPress={()=>{handleUpdate();}}
    // {()=> navigation.navigate('SignInScreen')}
                style={styles.conTouch} 
            ><Text style = {[styles.textColor,{fontSize: 20,}]}>עדכן</Text></TouchableOpacity> 
    </View> 
    </View>
    </ScrollView>

    );
};

export default EditProfile;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop:100,
      margin:10,
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
    width:100,
    height:50,
    backgroundColor:'#009387',
    borderRadius:10,
    margin:20,
    }, 
    commandButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginTop: 10,
    },
 
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
   
   

    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
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