import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert
} from 'react-native';
import {auth} from '../FirebaseConfig';
import { color } from '../utils';

const ForgotPassword = ({navigation}) => {
  //state for email
    const [email, setEmail] = useState('');

  //function for reset the password + validation-alert error
    const handleForgotPassword = () => {
        auth.sendPasswordResetEmail(email)
        .then(() => {
           Alert.alert('', "איפוס סיסמא נשלח לכתובת המייל שהזנת",[,,{text:"אישור"}])

        }, (error) => {
          // alert(error.message)
          switch(error.message) {
            case 'Firebase: Error (auth/missing-email).':
              Alert.alert('', "הודעת שגיאה: כתובת האימייל חסרה, אנא הזן אותה",[,,{text:"אישור"}])
                  break;
            case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
              Alert.alert('', "הודעת שגיאה: כתובת אימייל לא תקינה",[,,{text:"אישור"}])
              break;
            case 'The email address is badly formatted.':
              Alert.alert('', "הודעת שגיאה: כתובת אימייל לא תקינה",[,,{text:"אישור"}])
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
      <View style={styles.container}>
          <Text  style = {styles.text}>אנא הזן את כתובת האימייל שלך על מנת לאפס את הסיסמא</Text>
          <TextInput
              value={email}
              onChangeText={(email) => setEmail(email)}
              placeholder="אימייל"
              autoFocus={true}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style = {styles.textInput}
              />

          <View>
            <TouchableOpacity  onPress={handleForgotPassword}>
              <Text style = {[styles.text,{fontSize:18},]} >איפוס סיסמא</Text>
            </TouchableOpacity> 
            <TouchableOpacity  onPress={()=> navigation.navigate('LoginScreen')}>
              <Text style = {[styles.text,{fontSize: 18},]} >חזור למסך כניסה</Text>
            </TouchableOpacity> 

          </View>
      </View> 
  )
}
  export default ForgotPassword;

  //styling
  const styles = StyleSheet.create({  
    container: {
      backgroundColor: color.TURQUOISE,
      flex: 1,
      paddingTop:'60%',
      alignItems: 'center',
      alignContent:'center',
    },
    textInput:{
        borderWidth:1.5,
        borderColor: color.GRAY,
        backgroundColor: color.WHITE_GRAY,
        padding:10,
        borderRadius:5,
        width: '85%',
        marginVertical:20,
        textAlign:'right',
      },
      text:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
        marginHorizontal:20,
        paddingBottom:10,
        color:color.BLACK
      },   
  })