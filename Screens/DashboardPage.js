import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Button,
    
} from 'react-native';
import { useState, useEffect } from 'react'
import {auth, db, storage} from '../FirebaseConfig';
import { Avatar,Title,
    Caption, } from 'react-native-paper';
import { color } from '../utils';


const DashboardPage = ({navigation}) => {
    const [imageUrl, setImageUrl] = useState(undefined);
    const [userObj, setUserObj] = useState('');
    const [userObjForm, setUserObjForm] = useState('');
    // const [tags, setTags] = useState('')
    const [pick, setPick] = useState('')
    const [time,setTime] = useState('')
    const [food, setFood] = useState('')

    const handleSignOut = () => {
      auth
        .signOut()
        .then(() => {
          navigation.replace("HomeScreen")
        })
        .catch(error => alert(error.message))
    }

    const checkData =(value)=>{
      try{
        if(value.typeFood === undefined){
            setFood('')
        }
        else{
        let string = ""
        for (var i=0; i < value.typeFood.length; i++) {
           if(i !== value.typeFood.length-1 ){
            string += (value.typeFood[i]+', ')
          }
          else {
            string += (value.typeFood[i])
          }
         
        }
        setFood(string)
        
       }
      }
      catch(error){
        console.log(error)
      }

      // try{
        
      //   let string = ""
      //   if(value.tags=== undefined){
      //     setTags('')
      //   }
      //   else{
      //   for (var i=0; i < value.tags.length; i++) {
      //      if(i !== value.tags.length-1 ){
      //       string += (value.tags[i]+', ')
      //     }
      //     else {
      //       string += (value.tags[i])
      //     }
         
      //   }

      //   setTags(string)
      //   // alert(tags)
      //  }
      // }
      // catch(error){
      //   console.log(error)
      // }

      try{
        let string = ""
        if(value.timePick === undefined){
          setPick('')
        }
        else{
          for (var i=0; i < value.timePick.length; i++) {
            if(i !== value.timePick.length-1 ){
              string += (value.timePick[i]+', ')
            }
            else {
              string += (value.timePick[i])
            }
          
          }
          setPick(string)
        }
      }
      catch(error){
        console.log(error)
      }
      try{
        let string = ""
        if(value.Time === undefined){
          setTime('')
        }
        else{
          for (var i=0; i < value.Time.length; i++) {
            if(i !== value.Time.length-1 ){
              string += (value.Time[i]+', ')
            }
            else {
              string += (value.Time[i])
            }
          
          }
          setTime(string)
        }
      }
      catch(error){
        console.log(error)
      }
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
      }}}, []);

      
        useEffect(() => {
          if (auth.currentUser) {
            const userid = auth.currentUser.uid;
        
           if (userid) {
             db.ref('users/'+userid).on('value', (snapshot) => {
               setUserObj(snapshot.val()) 
              
           })
              db.ref('users/'+userid+'/Form').on('value', (snapshot) => {
              setUserObjForm(snapshot.val()) 
              checkData(snapshot.val())
            })
          
          }}}, []);
      let first,firstValue, second,secondValue
      if (userObj.type === 'getter'){
          first = 'לכמה אנשים?'
          firstValue = userObjForm.numberPeople
          second = 'סוג המזון'
          secondValue = food
         
      }
      else{
          first = 'סוג המזון'
          firstValue = food
          second = 'משקל (בק"ג)'
          secondValue = userObjForm.amount
  
  
      }
    return (
        <View style ={Styles.container}>
          
            {/* <Image style={{height: 50, width: 50}} source={{uri: imageUrl}} /> */}
            <View style={{paddingVertical:5,flexDirection:'column',justifyContent:'center', alignItems:'center'}}>
            <Image style={{height: 80, width: 80, borderRadius:50}} source={{uri: imageUrl}} />
                      <Title style={Styles.title}>{userObj.userName}</Title> 

                      <Caption style={{fontSize:14,}}>{userObjForm.catogary}</Caption> 
            </View>
           
          <View style ={{alignItems:'center',paddingTop:15,direction:'rtl'}} >
            <View style={Styles.infoBoxWrapper}>
            <Text style = {Styles.title}>{first}</Text>
              <Caption style={Styles.caption}>{firstValue} </Caption>
            </View>
            <View style={Styles.infoBoxWrapper}>
            <Text style = {Styles.title}>{second}</Text>
              <Caption style={Styles.caption}>{secondValue}</Caption>
            </View>
            <View style={Styles.infoBoxWrapper}>
              <Text style = {Styles.title}>מתי</Text>
              <Caption style={Styles.caption}>{pick}</Caption>
            </View>
            <View style={Styles.infoBoxWrapper}>
            <Text style = {Styles.title}>בין השעות</Text>
              <Caption style={Styles.caption}>{time}</Caption>
            </View>
            </View>
            <View style = {{ alignItems:'center'}}>

            <TouchableOpacity
                style={Styles.userBtn}
                onPress={() => {
                  navigation.navigate('EditProfile');
                }}>
                <Text style={Styles.userBtnTxt}>עריכת פרטי הטופס</Text>
              </TouchableOpacity>
              <TouchableOpacity style={Styles.userBtn} onPress={() => {
                  navigation.navigate('עריכת פרטים אישיים');
                }}>
                <Text style={Styles.userBtnTxt}>עריכת פרטים אישיים</Text>
              </TouchableOpacity >
              <TouchableOpacity style={Styles.userBtn} onPress={handleSignOut}>
                <Text style={Styles.userBtnTxt}>Logout</Text>
              </TouchableOpacity >
              </View>
            
        </View>

    );
};

export default DashboardPage;
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.WHITE,
        // alignItems: 'center',
        paddingTop: 10, 
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      caption: {
        fontSize: 15,
        fontWeight: 'bold',
        // padding:5,
        // margin:5,
        // lineHeight: 30,
      },
      infoBoxWrapper: {
        // borderBottomColor: '#dddddd',
        // borderBottomWidth: 1,
        flexDirection: 'column',
        alignItems:'flex-start',
        // height: '10%',
        // justifyContent:'space-between',
        padding:5,
        // height:'15%',
        width: '90%',
        borderTopColor: '#dddddd', 
        borderTopWidth: 2
      },
      infoBox: {
        width: '50%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      userBtn: {
        borderColor: 'black',
        borderWidth: 2,
        borderRadius: 3,
        paddingVertical: 8,
        marginVertical: 5,
        width:'50%', 
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        
      },
      userBtnTxt: {
        color: '#2e64e5',
      },
    }) 