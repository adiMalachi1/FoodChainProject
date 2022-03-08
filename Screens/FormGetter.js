import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Button,
    TextInput,
} from 'react-native';
import React, { useState, useEffect } from 'react'
import {auth, db} from '../FirebaseConfig';

import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
 
const FormGetter = ({navigation}) => {
  // const contactsDbRef = firebase.app().database().ref('contacts/');
  // console.log(timeStamp+"/"+insertKey);
  // contactsDbRef
  //      .child(insertKey)
  //     .set({
          
  //         name:name,
  //         number: number,
  //         email: email,
          
  //     },
  //     console.log("data added"),
  //         (error) => {
  //             if (error) {
  //                 console.log(error)
  //             } else {
                  
  //                 console.log("added successfully")
                 
  //             }
  //         });
  const [desription, setDescription] =  useState('');
  const [openCato, setOpenCato] = useState(false);
  const [valueCa, setValueCa] = useState('');
  const [itemCato, setItemCato] = useState([
    {label: 'בית תמחוי', value: 'בית תמחוי'},
    {label: 'שירות רווחה', value: 'שירות רווחה'},
    {label: 'בנק מזון', value: 'בנק מזון'},
    {label: 'מעונות יום לילדים', value: 'מעונות יום לילדים'},
    {label: 'בית ספר/צהרון', value: 'בית ספר/צהרון'},
    {label: 'ניצולי שואה', value: 'ניצולי שואה'},
    {label: 'מחנות פליטים', value: 'מחנות פליטים'},
    {label: 'מקלט לנשים', value: 'מקלט לנשים'},
    {label: 'בית יתומים', value: 'בית יתומים'},
    {label: 'מעון קשישים', value: 'מעון קשישים'},
    {label: 'תנועת נוער', value: 'תנועת נוער'},
    {label: 'בניין משרדים', value: 'בניין משרדים'},
    {label: 'שירות לאומי', value: 'שירות לאומי'},
    {label: 'יוזמה קהילתית', value: 'יוזמה קהילתית'},
    {label: 'העצמת מיעוטים', value: 'העצמת מיעוטים'},
    {label: 'אחר', value: 'אחר'}
  ]);

  const [openTags, setOpenTags] = useState(false);
  const [valueTags, setValueTags] = useState([]);
  const [itemTags, setItemTags] = useState([
    {label: 'כשרות רגילה', value: 'כשרות רגילה'},
    {label: 'כשרות בד"ץ', value: 'כשרות בדץ'},
    {label: 'חלבי', value: 'חלבי'},
    {label: 'בשרי', value: 'בשרי'},
    {label: 'חלאל', value: 'חלאל'},
    {label: 'טבעוני', value: 'טבעוני'},
    {label: 'צמחוני', value: 'צמחוני'}, 
    {label: 'בריא', value: 'בריא'},
]);

const [openStatus, setOpenStatus] = useState(false);
const [valueStatus, setValueStatus] = useState([]);
const [itemStatus, setItemStatus] = useState([
  {label: 'עמותה רשומה', value: 'עמותה רשומה'},
  {label: 'עמותה מורשית על פי סעיף 46', value: 'עמותה מורשית על פי סעיף 46'},
  {label: 'חברה ציבורית', value: 'חברה ציבורית'}

]);

const [openTypeFood, setOpenTypeFood] = useState(false);
const [valueTypeFood, setValueTypeFood] = useState([]);
const [itemTypeFood, setItemTypeFood] = useState([
  {label: 'פירות וירקות', value: 'פירות וירקות'},
//   {label: 'מוצרים ארוזים יבשים', value: 'מו'},
  {label: 'מנות מבושלות',value: 'מנות מבושלות'},
  {label: 'אוכל אצבעות', value: 'אוכל אצבעות'},
  {label: 'מוצרים בקירור', value: 'מוצרים בקירור'},
  {label: 'סלטים ותבלינים', value: 'סלטים ותבלינים'},
  {label: 'ארוחות ארוזות', value: 'ארוחות ארוזות'},
  {label: 'משקאות', value: 'משקאות'},
  {label: 'ממתקים וקינוחים', value: 'ממתקים וקינוחים'},
  {label: 'כריכים', value: 'כריכים'},
  {label: 'לחם ואפייה', value: 'לחם ואפייה'},
  {label: 'ארוחות קפואות', value: 'ארוחות קפואות'},
  {label: 'הכל', value: 'הכל'}

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
            // email: email,
            // phone: phone, 
            // password: password,
            // type:checked,
            
       }) .catch((error) => {
        alert(error.message);
    });
    }
  }
}
    return (
        // <View style ={Styles.container}>
        //     <Text style= {Styles.text}>שלום עמותה יקרה, שמחים שהצטרפת אלינו! אנא מלאי את השאלון והפרופיל שלך.</Text>
        //     {/* <Button
        //         title = "Clicked Me!"
        //         onPress = {()=>alert("button Clicked!")}
        //     /> */}
        //     <View
        //         style = {{
        //             backgroundColor:'white',
        //             width:300,
        //             height:380,
        //             padding: 20,
        //             paddingTop:50,
        //             borderRadius:5,

        //         }}
        //     />
        // </View>
        <ScrollView>
    <View style={{ paddingTop:20, margin:20,}}>
        <Text  style={{marginVertical:10}}>תיאור קצר</Text>
    <View>
      <TextInput
      value={desription}
      onChangeText={(desription) => setDescription(desription)}
      placeholder="הסבר קצר על הארגון/עמותה"
      style = {Styles.textInput}
      multiline={true}
      selectionColor={"black"}
      autoFocus ={true}
      activeUnderlineColor="white"
      underlineColor='white'
     />
     
     <Text  style={{marginVertical:20}}>קטגוריה</Text>

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

        onSelectItem ={(item) => {
          console.log("selected value",item[0].label);
          // console.log("selected Index",index);
        }}
       
        // onChangeItem={item =>({ currency: item.value })}

     ></DropDownPicker>
    </View>
    <Text  style={{marginVertical:20}}>סטטוס</Text>

{/* <View> */}
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
    <Text  style={{fontSize:20, margin:20,textAlign:'center'}}>הבקשה שלך</Text>
    <Text  style={{marginVertical:20}}>צרף תמונה להמחשת ההצעה</Text>
    <Text  style={{ marginVertical:20}}>סוג האוכל שתרצו לקבל</Text>

   
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
    zIndex={2000}
    zIndexInverse={2000}
  
 ></DropDownPicker>
  <Text  style={{ marginVertical:20}}>כמה אנשים מאכילים באופן קבוע?</Text>
  <TextInput
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
      <Text  style={{ marginVertical:20}}>הזמן הכי טוב לאיסוף</Text>
      <TextInput 
        style = {[Styles.textInput,{height:45,},]}
        placeholder="אנא בחר זמן מתאים"
      ></TextInput>
      <Text  style={{ marginVertical:20}}>יום איסוף</Text>
      < DropDownPicker
     open={openCato}
      value={valueCa}
      items={itemCato}
      setOpen={setOpenCato}
      setValue={setValueCa}
      // setItems={setItemCato}
      zIndex={3000}
      zIndexInverse={1000}
      placeholder= {'אנא בחר יום איסוף'} 
      listMode="SCROLLVIEW"
        scrollViewProps={{
          nestedScrollEnabled: true,
      }}
        closeAfterSelecting={true}
   > </DropDownPicker>
      <View style = {{ alignItems:'center'}}>
    <TouchableOpacity   onPress={()=>{handleSignUpCon();}}
                style={Styles.conTouch} 
            ><Text style = {[Styles.textColor,{fontSize: 20,}]}>המשך</Text></TouchableOpacity> 
    </View> 
    {/* </View> */}
    
    </View>
    </ScrollView>
    );
};

export default FormGetter;
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
        width:150,
        height:50,
        backgroundColor:'#009387',
        borderRadius:10,
        // margin:80,
        },
        textInput:{
          borderWidth:1,
          borderColor: 'black',
          backgroundColor: 'white',
          padding:10,
          
          // marginBottom:20,
          borderTopEndRadius:5,
          borderTopStartRadius:5, 
          textAlignVertical: 'top',
          // width: '100%',
          textAlign:'right',
         
    
        },
    })