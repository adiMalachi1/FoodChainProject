import React, {useEffect, useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
// import AsyncStorage from '@react-native-community/async-storage'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from '../FirebaseConfig';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState();
  const [passError, setpassError] = useState();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       navigation.navigate("SignInScreen")
  //     }
  //   })

  //   return unsubscribe
  // }, [])

 

  const handleLogin =()=>{
    // if(email === ""){
      
    //   Alert.alert('שגיאה', 'אמייל הינו שדה חובה', [
    //     {
          
    //     },
    //     {
       
    //     },
    //     { text: 'אישור',
    //     //  onPress: () => console.log('OK Pressed'),
    //     textAlign:'center'
    //   },
    //   ]);
    // //  alert("אמייל הינו שדה חובה")
    //   return;

    // }
    
    // else if(password === ""){
    //   alert("סיסמא הינה שדה חובה")
    //     return;
    // }

      if(email==="" || password ==="" || (password.length < 6)){

        if(email=== ""){
          // alert("אמייל הינו שדה חובה")
          // navigation.navigate('LoginScreen')
          setEmailError("אמייל הינו שדה חובה")
          return;
        }
        else{
          setEmailError("")
          // return;

        }
        if (password === ""){
          setpassError("סיסמא הינה שדה חובה")
          // return;
        }
        else if (password.length < 6){
          setpassError("על הסיסמא להיות בעלת 6 תווים לפחות")
        }
        else{
          setpassError("")
          // return;

        }
      }

     else{
      setpassError("")
      auth.signInWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:',user.email)
        navigation.navigate("SignInScreen")

      })
        // .catch(error=>alert(error.message))
        //  return;
      .catch(error => {   
        // alert(error.message)
        // throw new Error(error.message);
        switch(error.message) {
          case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
                Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[{},{},{text:"אישור"}])
                break;
          case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
                Alert.alert('', "הודעת שגיאה: כתובת אמייל זו אינה קיימת, אנא צור חשבון קודם",[{},{},{text:"אישור"}])
                break;
          case 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).':
                Alert.alert('', "הודעת שגיאה: הסיסמא אינה תקינה, אנא נסה שנית",[{},{},{text:"אישור"}])
                break;
       }
     })
      // .catch(error=>alert(error.message))
      //    return;
      // navigation.navigate('SignInScreen')
    }
  }

  // const passwordVal = ()=>{
  //   if(password === ""){
  //     alert("סיסמא הינה שדה חובה")
  //     navigation.navigate('LoginScreen')
    
  //    }
  //    else{
  //     setPassword("")
  //     navigation.navigate('LoginScreen')
  //   }
  // }
  // const Validate = () =>
  //   {
  //       if(email=== ""){
  //           // alert("אמייל הינו שדה חובה")
  //           // navigation.navigate('LoginScreen')
  //           setEmailError("אמייל הינו שדה חובה")
  //       }
  //       else{
  //           setEmailError("")
  //           // navigation.navigate('LoginScreen')

  //           // this.setState({emailError:""})

  //       }
  //       // if 
  //   } 
  return(
    <View style={Styles.container}>
    <View style =  {Styles.center}>
    <Image
      source={require('../assets/logoFoodChain.png')}
      style={Styles.logo}
    />
     </View> 
    
    <Text style={Styles.textheader}>ברוכים הבאים!</Text>
    <View style={Styles.inputContainer}>
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
       {/* <Text style={Styles.errorMsg}>Username must be 4 characters long.</Text> */}
        <Text style={Styles.errorMsg} >{emailError}</Text>
       <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        // onBlur={()=>passwordVal()}
        placeholder="סיסמה" 
        iconType="lock"
        textAlign='right'
        secureTextEntry={true}
        style = {Styles.textInput}
      />
         <Text style={Styles.errorMsg} >{passError}</Text>

         </View> 
         <View style = {Styles.center}>
         <TouchableOpacity onPress={handleLogin}
                style={Styles.conTouch} ><Text style = {[Styles.textColor,{fontSize: 25,}]}>כניסה</Text></TouchableOpacity>
         <TouchableOpacity  onPress={()=> navigation.navigate('SignUpScreen')}><Text style = {Styles.text} >צור חשבון</Text></TouchableOpacity> 
         <TouchableOpacity  onPress={()=> navigation.navigate('ForgotPassword')}><Text style = {Styles.textFor} >שכחת סיסמא?</Text></TouchableOpacity> 

         </View> 
    </View> 
    
    
  )}
  export default LoginScreen;
  const Styles = StyleSheet.create({
     
          container: {
            backgroundColor: '#009387',
            flex: 1,
            paddingTop:100,
            alignItems: 'center',
          },
          inputContainer:{
             width:'90%',
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
            marginBottom:10,
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
            fontSize: 18,
            marginTop:10,
            marginBottom: 10,
            color: 'black',
            fontWeight: 'bold',
          },
          textFor: {
            fontSize: 15,
            marginTop:10,
            marginBottom: 10,
            color: 'black',
            fontWeight: 'bold',
          },
          errorMsg: {
            color: '#FF0000',
            fontSize: 14,
        },
        })
