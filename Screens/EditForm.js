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
import * as Location from 'expo-location';
import {auth, db} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'
import { color,inputGiver,inputGetter } from '../utils';
import { StatusBar} from 'react-native';

const EditForm = ({navigation,route}) => {
  //get type as params
  const {type} = route.params
  let giver,getter
  //set state for information we need
  const [userData, setUserData] = useState({});
  const [description, setDescription] =  useState('');
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [amountKg, setAmountKg] =  useState('');
  const [numPeople, setNumPeople] =  useState('');
  const [show, setShow] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showInputNumPeople, setShowInputNumPeople] = useState(false);
  const [showInputNumKg, setShowInputNumKg] = useState(false);
  
  if(type === 'giver'){
    giver = 'כמות האוכל? (בק"ג)'

  }
  else{
    getter = 'כמה אנשים מאכילים באופן קבוע?'

  }
  const set = ()=>{ //show diffrenet field depend on user type
      if(type === 'giver'){
        setShowInputNumKg(true)
        setShowInputNumPeople(false)
        setShow(true)
      }else{
        setShowInputNumPeople(true)
        setShowInputNumKg(false)
        setShow(false)

      }
  }
  const getData = () => { //get user data from firebase and put in text input the appropiate field
    if (auth.currentUser) {
        const userid = auth.currentUser.uid; //get id current user from firebase
      if(userid){
        db.ref(`users/`+userid).on('value', function (snapshot) {
          setData(snapshot.val());
          setDescription(snapshot.val().Form.description)
          setValueTypeFood(snapshot.val().Form.typeFood)
          setValueTimePick(snapshot.val().Form.timePick)
          setValueTags(snapshot.val().Form.tags)
          setValueTime(snapshot.val().Form.Time)
          if(snapshot.val().type === 'giver'){
            setAmountKg(snapshot.val().Form.amount)
            setValueWhen(snapshot.val().Form.when)
          }
          else{
            setNumPeople(snapshot.val().Form.numberPeople)
          }
          setUserData({userName:snapshot.val().userName,phone:snapshot.val().phone, email:snapshot.val().email})
          setLoading(true);
        });
      }
      else{
        Alert.alert('', "הודעת שגיאה: זהו לא המזהה הנכון",[,,{text:"אישור"}])
      }
    }
    else{
      Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת, יתכן כי משתמש זה כבר מחובר ממכשיר אחר, אנא התנתק ונסה שנית",[,,{text:"אישור"}])
    }
  }

  function onChaneHandler(item){ //if there other field
    if(item != null){
    if (item.includes("אחר")){  
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

  useEffect(() => {
  let unmounted = false
  // console.log("ruuning effect to fetch data")
  setTimeout(()=>{
  // console.log("data loaded for page")
  if(!unmounted){
    set()
    getData()
  }}, 3000);
  return()=>{
    unmounted = true
  }
  }, []);
     
     
  
    

  const handleUpdate = async() => { //updating in firebase and check validation- cant leave an empty field
    if( valueTags == ""  || valueTime == "" || valueTimePick == "" || valueTypeFood == "" ){
      Alert.alert('', "הודעת שגיאה: אין אפשרות להשאיר שדה ריק, יש למלא את כל השדות",[,,{text:"אישור"}])
      return;
    }
    if(type ==='giver'){ //specific validation for giver user
      if(amountKg ==""){
        Alert.alert('', "הודעת שגיאה: אין אפשרות להשאיר שדה ריק, יש למלא את כל השדות",[,,{text:"אישור"}])
        return;
      }
      if(valueWhen ==""){ 
          Alert.alert('', "הודעת שגיאה: אין אפשרות להשאיר שדה ריק, יש למלא את כל השדות",[,,{text:"אישור"}])
          return;
      }
      if(amountKg === '0'|| amountKg[0] === '0' || amountKg.includes('.') || amountKg.includes('-')){
        Alert.alert('', "הודעת שגיאה: כמות האוכל אינה יכולה להיות תווים שאינם מספרים, שווה ל-0 או להתחיל ב-0, אנא תשנה ונסה שנית",[,,{text:"אישור"}])
        return;
      }
    }
          
    if(type ==='getter'){//specific validation for getter user
      if(numPeople ==""){
        Alert.alert('', "הודעת שגיאה: אין אפשרות להשאיר שדה ריק, יש למלא את כל השדות",[,,{text:"אישור"}])
        return;
      }

      if(numPeople === '0'|| numPeople[0] === '0' || numPeople.includes('.') || numPeople.includes('-')){
        Alert.alert('', "הודעת שגיאה: כמות האנשים אינו יכול להיות תווים שאינם מספרים, שווה ל-0 או להתחיל ב-0, אנא תשנה ונסה שנית",[,,{text:"אישור"}])
        return;
      }
    }
        
    const userid = auth.currentUser.uid; //get current userid
    if (type === 'giver'){ //update in firebase specific if user is giver
      db.ref('users/'+userid+'/Form')
      .update({
        description: description || data.description||"",
        typeFood: valueTypeFood || data.Form.typeFood,
        tags:valueTags || data.Form.tags,
        timePick: valueTimePick ||data.Form.timePick,
        when: valueWhen || data.Form.when,
        Time: valueTime || data.Form.Time,
        amount : amountKg ,
        location:location || data.Form.location,
        latitude:locationLat || data.Form.latitude,
        longitude:locationLon || data.Form.longitude,
      })
      .then(() => {
        console.log('User Updated!');
        navigation.navigate('איזור אישי')
      })
    }
    else{
      db.ref('users/'+userid+'/Form')//update in firebase specific if user is getter
      .update({
          description: description || data.description || "",
          typeFood: valueTypeFood || data.Form.typeFood,
          tags:valueTags || data.Form.tags,
          timePick: valueTimePick ||data.Form.timePick,
          Time: valueTime || data.Form.Time,
          numberPeople : numPeople ,
          location:location || data.Form.location,
          latitude:locationLat || data.Form.latitude,
          longitude:locationLon || data.Form.longitude,
      })
      .then(() => {
        console.log('User Updated!');
        // Alert.alert(
        //   'הפרופיל עודכן בהצלחה!'
        // );
        navigation.navigate('איזור אישי')
      })

    }
  }

  const checkFood= (type)=>{ //get the appropriate type food for cuurent user
    if(type ==='giver'){
      return inputGiver.typeFood
    }
    else{
      return inputGetter.typeFood
    }
    
  }
  const checkTags= (type)=>{ //get the appropriate tags for cuurent user
    if(type ==='giver'){
      return inputGiver.tags
    }
    else{
      return inputGetter.tags
    }
  }
  
  //type food
  const [openTypeFood, setOpenTypeFood] = useState(false);
  const [valueTypeFood, setValueTypeFood] = useState([]);
  const [itemTypeFood, setItemTypeFood] = useState(checkFood(type));

  //tags
  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [itemTags, setItemTags] = useState(checkTags(type));

  //time options to pick up the food
  const [openTimePick, setOpenTimePick] = useState(false);
  const [valueTimePick, setValueTimePick] = useState([]);
  const [itemTimePick, setItemTimePick] = useState(inputGetter.timePick);

  //times in hours
  const [openTime, setOpenTime] = useState(false);
  const [valueTime, setValueTime] = useState([]);
  const [itemTime, setItemTime] = useState(inputGiver.timeHours);

  //within a few hours the food should be collected
  const [openWhen, setOpenWhen] = useState(false);
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
    let unmounted = false
    // console.log("ruuning effect to fetch data")
      setTimeout(()=>{
    // console.log("data loaded for page" )
    if(!unmounted){
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== "granted"){
          Alert.alert('',"סירבת לאפשר לאפליקציה הזו לגשת למיקום שלך, עליך לשנות זאת ולאפשר גישה במידה ותרצה לעדכן את המיקום שלך",[,,{text:"אישור"}]);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocationLat(location.coords.latitude)
        setLocationLon(location.coords.longitude)
        
      })();}},3000)
    return()=>{
      unmounted = true
    } 
  }, []);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => { //toggle for location + validation
  setIsEnabled(previousState => !previousState)
  if (!isEnabled){
    if(locationLat===null || locationLon===null ){
      Alert.alert('', "הודעת שגיאה: עליך לאשר הרשאות גישה למיקום על מנת לעדכן את מיקומך",[,,{text:"אישור"}])
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
                 
  return (
    <ScrollView>
    <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
    <View style={styles.container}>
        <Text  style={{marginVertical:15,writingDirection:'rtl'}}>תיאור קצר</Text>
          <TextInput
          value={description}
          onChangeText={(description) => setDescription(description)}
          placeholder="הסבר קצר על הארגון/עמותה"
          style = {styles.textInput}
          multiline={true}
          selectionColor={color.BLACK}
          autoFocus ={true}
          activeUnderlineColor={color.WHITE}
          underlineColor={color.WHITE}
        />
       <Text  style={styles.text}>סוג האוכל</Text>
 
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

        style = {{direction:'rtl', }}
        dropDownContainerStyle={{
            position: 'relative',
            top:0,
        }}
        mode= 'BADGE'
        onChangeValue={(item) => onChaneHandler(item)} ></DropDownPicker>
      <View style ={{display: showInput ? "flex": "none"}}>
        <TextInput 
            value={userData ? userData.other : ''}
            onChangeText={(txt) => setUserData({...userData, other: txt})}
            placeholder="אחר"
            style = {[styles.textInput,{marginTop:10,}]}
            selectionColor={color.BLACK}
            autoFocus ={true}
            activeUnderlineColor={color.WHITE}
            underlineColor={color.WHITE}/>
      </View> 
      <Text  style={styles.text}>תגים</Text>
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
      <Text  style={styles.text}>יום איסוף</Text>
      < DropDownPicker
          open={openTimePick}
          value={valueTimePick}
          items={itemTimePick}
          setOpen={setOpenTimePick}
          setValue={setValueTimePick}
          setItems={setItemTimePick} 
          mode= 'BADGE'
          multiple = {true}
          multipleText="תודה שבחרת"
          placeholder= {'אנא בחר יום איסוף'} 
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
          }}> 
      </DropDownPicker>
      <View  style = {{display: show ? "flex": "none"}}>
        <Text  style={styles.text}>יש לצרוך עד</Text>
        <DropDownPicker
          open={openWhen}
          value={valueWhen}
          items={itemWhen}
          setOpen={setOpenWhen}
          setValue={setValueWhen}
          setItems={setItemWhen} 
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

          closeAfterSelecting={true}
          placeholder= {'אנא בחר תוך כמה זמן יש לצרוך את האוכל'} 
          listMode="SCROLLVIEW"
            scrollViewProps={{
              nestedScrollEnabled: true,
          }}>
        </DropDownPicker>
      </View>
      <View>
        <Text  style={styles.text}>הזמן הכי טוב לאיסוף, בין השעות:</Text>
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
          }} ></DropDownPicker>
      </View>
      <Text  style={styles.text}>{giver}</Text>
      <TextInput
        value = {amountKg}
        placeholder="אנא הזן מספר"
        keyboardType="numeric"
        autoCapitalize="none"
        autoFocus ={true}
        style = {[styles.textInput,{display: showInputNumKg ? "flex": "none"}]}
        activeUnderlineColor={color.WHITE}
        underlineColor={color.WHITE}
        onChangeText={(amountKg) => setAmountKg(amountKg)}
        selectionColor={color.BLACK}
      /> 
      <Text  style={{marginBottom:20,marginTop:-40,writingDirection:'rtl'}}>{getter}</Text>
      <TextInput
        value={numPeople}
        onChangeText={(numPeople) => setNumPeople(numPeople)}
        placeholder="אנא הזן מספר"
        keyboardType="numeric"
        autoCapitalize="none"
        style = {[styles.textInput,{display: showInputNumPeople ? "flex": "none"}]}
        selectionColor={color.BLACK}
        activeUnderlineColor={color.WHITE}
        underlineColor={color.WHITE}
      /> 
      <View style = {{flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
        <Text style = {{marginTop:20,writingDirection:'rtl',marginBottom:10}}>
          עדכון המיקום הנוכחי שלי:  </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#78CECC" }}
            thumbColor={isEnabled ? "#009387" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
        />
      </View>
      <Text style = {{writingDirection:'rtl', textAlign:'center',marginBottom:10}}>
        {location}
      </Text>
      <View style = {{ alignItems:'center'}}>
        <TouchableOpacity onPress={handleUpdate}
                    style={styles.conTouch}><Text style = {[styles.textColor,{fontSize: 22 ,}]}>עדכן</Text></TouchableOpacity> 
      </View> 
    </View>
    </ScrollView>

  );
};

//make this component available to the app
export default EditForm;

//define styling
const styles = StyleSheet.create({
    container: {
      width:'90%',
      flex:1,
      alignSelf:'center'
    }, 
    textColor:{
      fontWeight: 'bold',
      color: color.WHITE_GRAY,
    },
    conTouch :{
      color: color.WHITE_GRAY,
      alignItems:'center',
      justifyContent:'center',
      width:100,
      height:50,
      backgroundColor:color.TURQUOISE,
      borderRadius:10,
      marginBottom:10,
    }, 
    textInput:{
        borderWidth:1,
        borderColor: color.BLACK,
        backgroundColor: color.WHITE,
        padding:10,
        borderRadius: 10,
        height:45,
        textAlign:'right',
    },
    text:{
      marginVertical:20,
      writingDirection:'rtl'
    }
  });