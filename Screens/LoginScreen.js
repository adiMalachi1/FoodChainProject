import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    Platform, 
    StyleSheet,
    Image,
    Button
} from 'react-native';
import { I18nManager } from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [emailError, setEmailError] = useState();
  const passwordVal = ()=>{
    if(password === ""){
      alert("סיסמא הינה שדה חובה")
      navigation.navigate('LoginScreen')
    
     }
     else{
      setPassword("")
      navigation.navigate('LoginScreen')
  }
    // if(password.trim().length < 6){
    //   alert("הסיסמא צריכה להיות בעלת 6 תווים לפחות")
    // }
  }
  const emailValidate = () =>
    {
        if(email=== ""){
            alert("אמייל הינו שדה חובה")
            navigation.navigate('LoginScreen')
        }
        else{
            setEmailError("")
            navigation.navigate('LoginScreen')

            // this.setState({emailError:""})

        }
    } 
  return(
    <View style={Styles.container}>
    <View style =  {Styles.center}>
    <Image
      source={require('../assets/logoFoodChain.png')}
      style={Styles.logo}
    />
     </View> 
    
    <Text style={Styles.textheader}>ברוכים הבאים!</Text>
    <TextInput
        value={email}
        onChangeText={(email) => setEmail(email)}
        placeholder="אימייל"
        // iconType="user"
        onBlur={()=>emailValidate()}
        autoFocus={true}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
        {/* <Text style={{color:'red'}} >{emailError}</Text> */}
       <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        onBlur={()=>passwordVal()}
        placeholder="סיסמה" 
        iconType="lock"
        textAlign='right'
        secureTextEntry={true}
        style = {Styles.textInput}
      />
         {/* <Button
            title = "SIGN IN"
            onPress={()=> navigation.navigate('SignInScreen')}
            style={Styles.conTouch} 
            /> 
         <Text style = {Styles.text} onPress={()=> navigation.navigate('SignUpScreen')} >create an account</Text> */}
         <View style = {Styles.center}>
         <TouchableOpacity onPress={()=> navigation.navigate('SignInScreen')}
                style={Styles.conTouch} ><Text style = {[Styles.textColor,{fontSize: 20,}]}>כניסה\LOGIN</Text></TouchableOpacity>
            <Text style = {Styles.text} onPress={()=> navigation.navigate('SignUpScreen')} >צור חשבון</Text>
         </View> 
    </View> 
    
    
  )}
  export default LoginScreen;
  const Styles = StyleSheet.create({
          container: {
            backgroundColor: '#009387',
            flex: 1,
            paddingTop:100,
            padding: 20,
          },
          center:{
            justifyContent: 'center',
            alignItems: 'center',
            padding:20,
          },
          textInput:{
            borderWidth:1,
            borderColor: 'gray',
            backgroundColor: 'white',
            padding:10,
            marginBottom:20,
            borderRadius:5,
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
            },
          logo: {
            height: 85,
            width: 85,
            resizeMode: 'cover',
            justifyContent: 'center',
            borderRadius: 5,
          },
          textheader:{
            fontWeight: 'bold',
            color: 'white',
            fontSize: 35,
            paddingBottom:40,
            textAlign:'center'
          },
          textColor:{
            fontWeight: 'bold',
            color: 'white',
          },
          text: {
            fontSize: 18,
            marginTop:10,
            marginBottom: 10,
            color: 'black',
            fontWeight: 'bold',
          },
          navButton: {
            marginTop: 15,
          },
          forgotButton: {
            marginVertical: 35,
          },
          navButtonText: {
            fontSize: 18,
            fontWeight: '500',
            color: '#2e64e5',
            fontFamily: 'arial',
          },

        })