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

      // this.setState({emailError:""})

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
            // this.setState({emailError:"אמייל הינו שדה חובה"})
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
        // container: {
        //     flex: 1,
        //     backgroundColor: '#009387',
        //     // alignItems: 'center',
        //     // paddingTop: 100, 
        //   }, 
          container: {
            backgroundColor: '#009387',
            flex: 1,
            paddingTop:100,
            // justifyContent: 'center',
            // alignItems: 'center',
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
            // alignItems: 'center',
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
            // fontFamily: 'Kufam-SemiBoldItalic',
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
// const SignInScreen = ({navigation}) => {
//     return (
//         <View style ={Styles.container}>
//             <View> 
//             <Text style ={[Styles.textheader,  
//                 {alignItems:'center', 
//                 paddingTop: 100,
//                 // flex: 1,
//                 // justifyContent: 'flex-end',
//                 // paddingHorizontal: 20,
//                 // paddingBottom: 50
//                 }]}>Login!</Text>
//             </View>   
//             {/* <Text>SignIn Screen</Text>
//             <Button
//                 title = "Clicked Me!"
//                  onPress={()=> navigation.navigate('SignUpScreen')}
//             /> */}
//             <View style ={Styles.emailCon}>
//             <Text style ={Styles.emailText}>Email</Text>
//             {/* <View style={styles.action}> */}
//                 <FontAwesome 
//                     name="envelope"
//                     // color={colors.text}
//                     size={20}
//                 />
//                 <TextInput 
//                     placeholder="Your email"
//                     // paddingLeft = "10"
//                     // placeholderTextColor="#666666"
//                     // style={[styles.textInput, {
//                     //     color: colors.text
//                     // }]}
                  
//                 />
//             </View>  
//             <View style ={Styles.emailCon}>
//             <Text style ={Styles.emailText}>Email</Text>
//             {/* <View style={styles.action}> */}
//                 <FontAwesome 
//                     name="password"
//                     // color={colors.text}
//                     size={20}
//                 />
//                 <TextInput 
//                     placeholder="Your password"
//                     // paddingLeft = "10"
//                     // placeholderTextColor="#666666"
//                     // style={[styles.textInput, {
//                     //     color: colors.text
//                     // }]}
                  
//                 />
//             </View>  
            
            
//         </View>

//     );
// };

// export default SignInScreen;
// const Styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#009387',
//         // alignItems: 'center',
//         // paddingTop: 100, 
//       },
//       textheader:{
//         fontWeight: 'bold',
//         color: 'white',
//         fontSize: 40,
//         paddingBottom:100,
//         textAlign:'center'
//       },
//       emailCon:{
//         flex: 3,
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 30,
//         borderTopRightRadius: 30,
//         paddingHorizontal: 20,
//         paddingLeft:10,
//         paddingVertical: 30,
//       },
//       emailText:{
//         color: 'black',
//         fontSize: 18,
//       }
//     })