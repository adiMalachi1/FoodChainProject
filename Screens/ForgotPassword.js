import React, {useEffect, useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Alert
} from 'react-native';

import {auth} from '../FirebaseConfig';


const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        auth.sendPasswordResetEmail(email)
        .then(() => {
           Alert.alert('', "איפוס סיסמא נשלח לכתובת המייל שהזנת",[,,{text:"אישור"}])

            // alert("איפוס סיסמא נשלח לכתובת המייל שהזנת");
        }, (error) => {
          alert(error.message)
          switch(error.message) {
            case 'Firebase: Error (auth/missing-email).':
              Alert.alert('', "הודעת שגיאה: כתובת האמייל חסרה, אנא הזן אותה",[,,{text:"אישור"}])
                  break;
            case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
              Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[,,{text:"אישור"}])
              break;
            case 'The email address is badly formatted.':
              Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[,,{text:"אישור"}])
              break;
            case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
              Alert.alert('', "הודעת שגיאה: כתובת זו אינה נמצאת במערכת, אנא נסה שנית",[,,{text:"אישור"}])
              break;
            case 'There is no user record corresponding to this identifier. The user may have been deleted.':
              Alert.alert('', "הודעת שגיאה: כתובת זו אינה נמצאת במערכת, אנא נסה שנית",[,,{text:"אישור"}])
              break;
         }
            console.log(error.message);
        });
    }

return(
    <View style={Styles.container}>
        <Text  style = {Styles.text}>אנא הזן את כתובת האמייל שלך על מנת לאפס את הסיסמא</Text>
    <TextInput
        value={email}
        onChangeText={(email) => setEmail(email)}
        placeholder="אימייל"
        // iconType="user"
        // onBlur={()=>emailValidate()}
        autoFocus={true}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
        />

        <View>
        <TouchableOpacity  onPress={handleForgotPassword}><Text style = {[Styles.text,{fontSize: 18,color:'#414141'},]} >איפוס סיסמא</Text></TouchableOpacity> 
        <TouchableOpacity  onPress={()=> navigation.navigate('LoginScreen')}><Text style = {[Styles.text,{fontSize: 18,color:'#414141'},]} >חזור למסך כניסה</Text></TouchableOpacity> 

        </View>
   </View> 

    
  )
}
  export default ForgotPassword;

  const Styles = StyleSheet.create({
     
    container: {
      backgroundColor: '#009387',
      flex: 1,
      paddingTop:200,
      alignItems: 'center',
      alignContent:'center',
    //   justifyContent:'center',
    },
    textInput:{
        borderWidth:1,
        borderColor: 'gray',
        backgroundColor: 'white',
        padding:10,
        marginBottom:20,
        borderRadius:5,
        width: '80%',
        // writingDirection:'rtl'
      },
      text:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
        marginLeft:20,
        marginRight:20,
        paddingBottom:20,

      },
  })