import React, {useEffect, useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
} from 'react-native';

import {auth} from '../FirebaseConfig';


const ForgotPassword = ({navigation}) => {
    const [email, setEmail] = useState('');

    const handleForgotPassword = () => {
        auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("איפוס סיסמא נשלח לכתובת המייל שהזנת");
        }, (error) => {
            alert(error.message);
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