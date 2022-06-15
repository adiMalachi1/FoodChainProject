import { 
    View, 
    TouchableOpacity, 
    StyleSheet,
    TextInput,
    Platform,
    Linking,
    KeyboardAvoidingView, 
} from 'react-native';

import React, {useEffect, useState} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {FlatList} from 'react-native';
import {db} from '../FirebaseConfig';
import {color } from '../utils';
import moment from 'moment';
import SingleMessage from '../ChatComponents/SingleMessage';
import ChatHeader from '../ChatComponents/ChatHeader';
import Matching from '../ChatComponents/Matching'
import 'moment/locale/he'

// import 'moment/min/locales'
const SingleChat = ({navigation,route}) => {
  moment.locale(); // hebrew
  const {receiverData,roomId,dataUser,expoPush} = route.params; //get params with data we needed
  const [msg, setMsg] = useState('');
  const [disabled, setdisabled] = useState(false);
  const [allChat, setallChat] = useState([]); 
  const [ spinner, setSpinner ] = useState(true);
 
  useEffect(() => {
      const onChildAdd = db
        .ref('/messages/'+ roomId)
        .on('child_added', snapshot => {
          // console.log('A new node has been added', snapshot.val());
          setallChat((state) => [snapshot.val(),...state]);
        });
        // console.log(allChat)
      // Stop listening for updates when no longer required
      setTimeout(() => {       
        setSpinner(false)}, 1000)
        return () => db.ref('/messages'+ roomId).off('child_added', onChildAdd);
  }, [roomId]);
    
  const msgvalid = txt => txt && txt.replace(/\s/g, '').length;// cant send just spaces
  
  const sendMsg = () => {
    if (msg == '' || msgvalid(msg) == 0) { // validation- cant send an empty messages or space
      return false;
    }
    setdisabled(true);
    let msgData = {
      roomId: roomId,
      message: msg,
      from: dataUser?.key,
      to: receiverData.key,
      sendTime: moment().format('LLLL'),
      msgType: 'text',
    };
    
    const newRef = db.ref('/messages/' + roomId).push();//for store every messasge right
    msgData.id = newRef.key;
    newRef.set(msgData).then(() => {
      let updateListChat = {
        lastMsg: msg,
        sendTime: msgData.sendTime,
      };
      db.ref('/chatlist/' + receiverData?.key + '/' + dataUser?.key)//updating the last message
        .update(updateListChat)
        .then(() => console.log('Data updated.'));
      db.ref('/chatlist/' + dataUser?.key + '/' + receiverData?.key)
        .update(updateListChat)
        .then(() => console.log('Data updated.'));
        setMsg('');//after send 
        setdisabled(false);
    });
       
    sendPushNotification(expoPush,dataUser.name); // send push notification that the user in the other side knows that sending to him messages
          
  };

  const pressCall=()=>{ //recieved phone number and connect to call in device to this phone number
    const numberPhone = receiverData.phone
    const url='tel://'+numberPhone
    Linking.openURL(url)
  }
     
  return (
    <View style ={styles.container}>
      <View style ={styles.chatHeaderStyle} >
        <ChatHeader data={receiverData} />
        <Matching  receiverData={receiverData} dataUser={dataUser}/>
        <TouchableOpacity 
                  onPress={pressCall}>
          <MaterialCommunityIcons name={"phone"} size={25} color={color.TURQUOISE} style={{margin:5}} />
        </TouchableOpacity>
      </View>
      <FlatList
      style={{flex: 1}}
      data={allChat}
      showsVerticalScrollIndicator={false}
      keyExtractor = {(item)=>item.key}
      inverted
      renderItem={({item}) => {
          return (
          <SingleMessage
              sender={item.from == dataUser.key}
              item={item}
              sendTime = {item.sendTime}
          />
          );
      }}
      />
      <KeyboardAvoidingView   
        behavior={Platform.OS === "ios" ? "padding" : null} keyboardVerticalOffset="70" enabled
        style={styles.keyBoard}>
        <TextInput
          style={styles.input}
              selectionColor={color.BLACK}
              autoFocus ={true}
              placeholder="הקלד הודעה"
              placeholderTextColor={color.BLACK}
              multiline={true}
              value={msg}
              onChangeText={val => setMsg(val)}
          />

        <TouchableOpacity disabled={disabled} onPress={sendMsg}>
            <MaterialCommunityIcons name={"send"} size={25} color={color.WHITE_GRAY} style={{ transform: [{ scaleX: -1 }]}}/>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

//make this component available to the app
export default SingleChat;

async function sendPushNotification(expoPushToken,name) {//send push notification from current user to chosen user in chat 
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'התראות FoodChain',
    body:'אנא הכנס לצאט, נשלחה אליך הודעה מאת ' +name,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

//define styling
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: color.TURQUOISE2,
  },
  chatHeaderStyle:{
      width:'100%',
      paddingHorizontal:5,
      backgroundColor:color.TURQUOISE2,
      // flexDirection :'row-reverse',
      justifyContent:'space-between',
      alignItems:'center',
      ...Platform.select({
        ios: {
          flexDirection: 'row-reverse',
        },
      android: {
        flexDirection: 'row',
      }}),
  },
  keyBoard:{
    backgroundColor: color.TURQUOISE,
    elevation: 5,
    alignItems: 'center',
    paddingVertical: 7,
    justifyContent: 'space-evenly',
        ...Platform.select({
        ios: {
            flexDirection: 'row-reverse',

        },
        android:{
            flexDirection: 'row',
            padding: 6,
        },
      }), 
  },
  input:{
    backgroundColor: color.WHITE_GRAY,
    width: '85%',
    borderRadius: 25,
    // borderWidth: 2,
    borderColor:color.TURQUOISE,
    color: color.BLACK,
    padding:15,
    fontSize:16,
    textAlign:'right',
    direction:'rtl',
    writingDirection:'rtl',
    paddingTop:10,
    marginVertical:10,
  }
  
}) 
