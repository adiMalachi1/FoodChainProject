import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState, useEffect } from 'react'
import {auth, db} from '../FirebaseConfig';

import { 
        View, 
        Text, 
        StyleSheet,
        TouchableOpacity, 
        Switch,
        Platform,
        Button,
        Image,
    } from 'react-native';
import { TextInput } from 'react-native-paper';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const FormGiver = ({navigation}) => {
  const [desription, setDescription] =  useState('');
  const [amountKg, setAmountKg] =  useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [text, setText] = useState('');
  const [textP, setTextP] = useState('');

  // const [image, setImage] = useState(null);
  // const pickImage = async () => {
  //   // No permissions request is necessary for launching the image library
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImage(result.uri);
  //   }
  // }
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
    let tempDate = new Date(currentDate)
    let fDate = 'תאריך: ' + tempDate.getDate() + '/' + (tempDate.getMonth()+1)+'/'+ tempDate.getFullYear(); 
    let fTime;
    if( tempDate.getMinutes() == 0 && tempDate.getHours() == 0 ){
      fTime = 'שעה: 0'+ tempDate.getHours() + ':0' + tempDate.getMinutes();
          // alert("jj")
    }
    else if(tempDate.getMinutes() > 0 && tempDate.getMinutes() < 10 ){
      if(tempDate.getHours() == 0){
        fTime = 'שעה: 0'+ tempDate.getHours() + ':0' + tempDate.getMinutes();

      }
      if( tempDate.getHours() > 9 && tempDate.getHours() < 25) {
        // alert("hu")
        fTime = 'שעה: '+ tempDate.getHours() + ':0' + tempDate.getMinutes();
      }
      else if(tempDate.getHours()>0 && tempDate.getHours() < 10){
        fTime = 'שעה: ' + '0'+ tempDate.getHours() + ':0' + tempDate.getMinutes();
          // alert("yes")
      }
    }
    else{
      // alert("1")
      if(tempDate.getHours() == 0){
        // alert("2")
        fTime = 'שעה: 0'+ tempDate.getHours() + ':' + tempDate.getMinutes();
      }
      else if( tempDate.getHours() > 9 && tempDate.getHours() < 25) {
        if(tempDate.getMinutes() > 9)
         fTime = 'שעה: ' + tempDate.getHours() + ':' + tempDate.getMinutes();
        // alert("k")
        else {
          fTime = 'שעה: ' + tempDate.getHours() + ':0' + tempDate.getMinutes();

        }
      }
      else if ( tempDate.getHours() > 1 && tempDate.getHours() < 10) {  
        if(tempDate.getMinutes < 10)
        fTime = 'שעה: 0' + tempDate.getHours() + ':' + tempDate.getMinutes();
        else if (tempDate.getMinutes() == 0){
         
          alert("yhnj")
          fTime = 'שעה: 0' + tempDate.getHours() + ':0' + tempDate.getMinutes();
        }
        else{
          // console.log(tempDate.getMinutes())
          // alert("jtj")
                  fTime = 'שעה: 0' + tempDate.getHours() + ':' + tempDate.getMinutes();

        }
      }
      else{
               fTime = 'שעה: ' + tempDate.getHours() + ':' + tempDate.getMinutes();

      }
    }
  
    setText(fDate +' , '+ fTime)
    console.log(fDate + ' (' + fTime + ')')
    };
 
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  // const showDatepicker = () => {
  //   showMode('date');
  // };

  // const showTimepicker = () => {
  //   showMode('time');
  // };
  
  // const [setShowComponent, showComponent] = useState(false)

  // const check = ()=>{

  //   if (isEnabled){
  //     alert("true")
  //     setTextP("המיקום הנוכחי הוא:" + locationLat + ','+ locationLon)
      
  //     // setShowComponent(true)
  //   }
  //    else{    
  //     // alert("false")
  //     setTextP("")
  //     // setShowComponent(false)
  //   }
  // }

    
  const [locationLat, setLocationLat] = useState(null);
  const [locationLon, setLocationLon] = useState(null);

  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let address = await Location.reverseGeocodeAsync(location.coords)
      console.log(location.coords.latitude,location.coords.longitude)
      // setLocation(location.coords.latitude,  location.coords.longitude);
      setLocationLat(location.coords.latitude)
      setLocationLon(location.coords.longitude)
      
    })();
  }, []);

  // let text = 'Waiting..';
  // if (errorMsg) {
  //   text = errorMsg;
  // } else if (location) {
  //   text = JSON.stringify(location);
  //   console.log(text)
  // }
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => {
    setIsEnabled(previousState => !previousState)
    if (!isEnabled){
      alert("true")
      setTextP("המיקום הנוכחי הוא: " + locationLat + ','+ locationLon)
      
      // setShowComponent(true)
    }
     else{    
      // alert("false")
      setTextP("")
      // setShowComponent(false)
    }
    };
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
  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [itemTags, setItemTags] = useState([
    {label: 'כשרות רגילה', value: 'כשרות רגילה'},
    {label: 'כשרות בד"ץ', value: 'כשרות בד"ץ'},
    {label: 'טבעוני', value: 'טבעוני'},
    {label: 'חלבי', value: 'חלבי'},
    {label: 'בשרי', value: 'בשרי'},
    {label: 'גלם', value: 'גלם'},
    {label: 'חלאל', value: 'חלאל'},
    {label: 'צמחוני', value: 'צמחוני'},    
    {label: 'תוצרת בית', value: 'תוצרת בית'},
    {label: 'גורמה', value: 'גורמה'},
    {label: 'חטיפים', value: 'חטיפים'},
    {label: 'אוכל מהיר', value: 'אוכל מהיר'},
    {label: 'בריא', value: 'בריא'},
    {label: 'מזון על', value: 'מזון על'},
    {label: 'משקאות', value: 'משקאות'},
    
]);
const [openStatus, setOpenStatus] = useState(false);
const [valueStatus, setValueStatus] = useState([]);
const [itemStatus, setItemStatus] = useState([
  {label: 'חברה בע"מ', value: 'חברה בע"מ'},
  {label: 'עוסק מורשה/פטור', value: 'עוסק מורשה/פטור'},
  {label: 'עמותה', value: 'עמותה'},
  {label: 'מתנדב', value: 'מתנדב'},

]);
const [openTypeFood, setOpenTypeFood] = useState(false);
const [valueTypeFood, setValueTypeFood] = useState([]);
const [itemTypeFood, setItemTypeFood] = useState([
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
  {label: 'הכל', value: 'הכל'}

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
const [valueWhen, setValueWhen] = useState([]);
const [itemWhen, setItemWhen] = useState([
  {label: '3 שעות ', value: '3'},
  {label: '6 שעות ', value: '6'},
  {label: '12 שעות ', value: '12'},
  {label: '24 שעות ', value: '24'},
  {label: '48 שעות ', value: '48'},
]);
const handleSignUpCon = () =>{
  if (auth.currentUser) {
    const userid = auth.currentUser.uid;

   if (userid) {
      //  db.ref('users/'+userid).update({ //שם הכל ביחד עם התכונות של השאלון לאותו משתמש
        db.ref('users/'+userid+'/Form').set({// מפריד את תכונות השאלון לקטגוריה נפרדת
            desription: desription,
            catogary: valueCa,
            tags: valueTags,
            status : valueStatus,
            typeFood: valueTypeFood,
            timePick: valueTimePick,
            when: valueWhen,
            location: textP,
            Time : text,
            amount : amountKg,
            // email: email,
            // phone: phone, 
            // password: password,
            // type:checked,
            
       })
       navigation.navigate('SignInScreen')           

    }
  }
}

  return (
   <ScrollView> 
        
    <View style={{ paddingTop:20, margin:20,}}>
        <Text  style={{marginVertical:10}}>תיאור קצר</Text>
    <View>
      <TextInput
      value={desription}
      onChangeText={(desription) => setDescription(desription)}
      placeholder="הסבר קצר על הארגון"
      style = {Styles.textInput}
      multiline={true}
      selectionColor={"black"}
      autoFocus ={true}
      activeUnderlineColor="white"
      underlineColor='white'
     />
     
     <Text  style={{marginVertical:20}}>קטגוריה</Text>
     {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View> */}
    <DropDownPicker 
      open={openCato}
      value={valueCa}
      items={itemCato}
      setOpen={setOpenCato}
      setValue={setValueCa}
      setItems={setItemCato}
      zIndex={3000}
      zIndexInverse={1000}
      placeholder= {'אנא בחר את הקטגוריה המתאימה'} 
      listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
      }}
        closeAfterSelecting={true}
    ></DropDownPicker>
    </View>
   
    <Text  style={{marginVertical:20}}>תגים</Text>

    <View>
      <DropDownPicker 
        open={openTags}
        value={valueTags}
        items={itemTags}
        setOpen={setOpenTags}
        setValue={setValueTags}
        setItems={setItemTags}
        multiple={true}
        multipleText="תודה שבחרת את התגים המתאימים"
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
        }}
        // onChangeItem={itemsI => setValues(itemsI.value)}
        placeholder= {'אנא בחר את התגים המתאימים'}
        zIndex={2000}
        zIndexInverse={2000}
        onChangeValue={(item) => {
          console.log("selected value",item);
          
        }}

        // onSelectItem ={(item) => {
        //   console.log("selected value",item[0].label);
        //   // console.log("selected Index",index);
        // }}
       
        // onChangeItem={item =>({ currency: item.value })}

     ></DropDownPicker>
    </View>
    <Text  style={{marginVertical:20}}>סטטוס</Text>

    <View>
    <DropDownPicker 
      open={openStatus}
      value={valueStatus}
      items={itemStatus}
      setOpen={setOpenStatus}
      setValue={setValueStatus}
      setItems={setItemStatus}
      zIndex={1000}
      zIndexInverse={3000}
      placeholder= {'אנא בחר את הסטטוס'}    
      closeAfterSelecting={true}
      listMode="SCROLLVIEW"
      scrollViewProps={{
        nestedScrollEnabled: true,
      }}
      
    ></DropDownPicker>
        <Text  style={{fontSize:20, margin:20,textAlign:'center'}}>ההצעה שלך</Text>
        <Text  style={{marginVertical:20}}>צרף תמונה להמחשת ההצעה</Text>
        <Text  style={{ marginVertical:20}}>סוג האוכל</Text>

       
        <DropDownPicker 
        open={openTypeFood}
        value={valueTypeFood}
        items={itemTypeFood}
        setOpen={setOpenTypeFood}
        setValue={setValueTypeFood}
        setItems={setItemTypeFood}
        multiple={true}
        multipleText="תודה שבחרת"
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
        }}
        // onChangeItem={itemsI => setValues(itemsI.value)}
        placeholder= {'אנא בחר את סוג האוכל המתאים'}
        zIndex={3000}
        zIndexInverse={1000}
      
     ></DropDownPicker>
      <Text  style={{ marginVertical:20}}>כמות האוכל? (בק"ג)</Text>

     <TextInput
        value={amountKg}
        onChangeText={(amountKg) => setAmountKg(amountKg)}
        placeholder="אנא הזן מספר"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        style = {[Styles.textInput,{height:45,},]}
        activeUnderlineColor="white"
        underlineColor='white'
        //   ={true}
        // underlineColorAndroid={"transparent"}
        selectionColor={"black"}

      />
      <Text  style={{ marginVertical:20}}>יום איסוף</Text>
      < DropDownPicker
        open={openTimePick}
        value={valueTimePick}
        items={itemTimePick}
        setOpen={setOpenTimePick}
        setValue={setValueTimePick}
        setItems={setItemTimePick} 
        zIndex={2000}
        zIndexInverse={2000}
        multiple = {true}
        multipleText="תודה שבחרת"
        placeholder= {'אנא בחר יום איסוף'} 
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
      }}
        // closeAfterSelecting={true}
   > 
   </DropDownPicker>
      {/* <TextInput 
        style = {[Styles.textInput,{height:45,},]}
        placeholder="אנא בחר זמן מתאים"
      ></TextInput> */}
        <Text  style={{ marginVertical:20}}>יש לצרוך עד</Text>

      < DropDownPicker
        open={opeמWhen}
        value={valueWhen}
        items={itemWhen}
        setOpen={setOpenWhen}
        setValue={setValueWhen}
        setItems={setItemWhen} 
        zIndex={1000}
        zIndexInverse={3000}
        multipleText="תודה שבחרת"
        placeholder= {'אנא בחר תוך כמה זמן יש לצרוך את האוכל'} 
        listMode="SCROLLVIEW"
          scrollViewProps={{
            nestedScrollEnabled: true,
      }}></DropDownPicker>
    <Text  style={{ marginVertical:20}}>הזמן הכי טוב לאיסוף</Text>

     <View style={{ flexDirection: "row", justifyContent:'center',margin:10,}}>
    <TouchableOpacity style={Styles.conTime} onPress={()=> showMode('date')}><Text style = {{color:'#009387',fontSize: 17}}>בחר תאריך</Text></TouchableOpacity>
    
      
    <TouchableOpacity style={Styles.conTime} onPress={()=> showMode('time')}><Text style = {{color:'#009387',fontSize: 17}}>בחר זמן</Text></TouchableOpacity> 
        {show && (
          <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
            is24Hour={true}
            // format="DD-MM-YYYY"
            
            display="default"
            onChange={onChange}
            />
            )}
      </View>

            <Text>{text}</Text>

      <Text  style={{marginVertical:20}}>מיקום</Text>
      <View style = {{}}>
      <TextInput
      placeholder="הכנס את הכתובת המלאה שלך או שתלחץ 'השתמש במיקום הנוכחי שלי'"
      style = {Styles.textInput}
      multiline={true}
      selectionColor={"black"}
      // autoFocus ={true}
      activeUnderlineColor="white"
      underlineColor='white'
      // value={()=>check()}
     />
     
     </View> 
    
      <View style = {{flexDirection:'row',  justifyContent:'flex-start',}}>
      <Text style = {{marginVertical:20,}}>
        השתמש במיקום הנוכחי שלי:  </Text>
         <Switch
          trackColor={{ false: "#767577", true: "#78CECC" }}
          thumbColor={isEnabled ? "#009387" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={()=> toggleSwitch()}
          value={isEnabled}
          
          // style = {{flexDirection:"row"}}
      />

    </View>
    <Text>
     {textP}
    </Text>
      {/* <Text>
      המיקום הנוכחי הוא: {locationLat},{locationLon}
    </Text> */}
    </View>
 
    <View style = {{ alignItems:'center'}}>
    <TouchableOpacity onPress={()=>{handleSignUpCon();}}
    // {()=> navigation.navigate('SignInScreen')}
                style={Styles.conTouch} 
            ><Text style = {[Styles.textColor,{fontSize: 20,}]}>המשך</Text></TouchableOpacity> 
    </View> 
    </View>
    
    </ScrollView>
  );
}
export default FormGiver;
const Styles = StyleSheet.create({
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
    conTime :{
      borderWidth:2,
      borderColor:'#009387',
      alignItems:'center',
      justifyContent:'center',
      width:120,
      height:50,
      // backgroundColor:'#009387',
      borderRadius:10,
      margin:10,
      },
    textInput:{
      borderWidth:1,
      borderColor: 'black',
      backgroundColor: 'white',
      // padding:10,
      // marginBottom:20,
      borderTopEndRadius:5,
      borderTopStartRadius:5, 
      textAlignVertical: 'top',
      // width: '100%',
      textAlign:'right',
     

    },

});