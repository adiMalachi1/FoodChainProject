import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
} from 'react-native';


const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
   
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
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholder="אימייל"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <TextInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholder="סיסמה" 
        iconType="lock"
        textAlign='right'
        secureTextEntry={true}
        style = {Styles.textInput}
      />
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