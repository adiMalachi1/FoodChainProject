import React, {useEffect, useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Pressable,
    TextInput,
    ColorPropType,
    
} from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {createUserWithEmailAndPassword } from "firebase/auth";
import {auth,db} from '../FirebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from '../utils';
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState();
  const [passError, setpassError] = useState();
  // const [passwordVisible, setPasswordVisible] = useState(true);
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye-off');


  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };


  const handleLogin =()=>{
   
      if(email==="" || password ==="" || (password.length < 6)){

        if(email=== ""){
          Alert.alert('', "הודעת שגיאה: אמייל הינו שדה חובה",[,,{text:"אישור"}])

          // return;
        }
        else{
          setEmailError("")
          // return;

        }
        if (password === ""){
          Alert.alert('', "הודעת שגיאה: סיסמה הינה שדה חובה",[,,{text:"אישור"}])

        }
        else if (password.length < 6){
          Alert.alert('', "הודעת שגיאה: על הסיסמא להיות בעלת 6 תווים לפחות",[,,{text:"אישור"}])
        }
        else{
          setpassError("")

        }
      }

     else{
      setpassError("")
      auth.signInWithEmailAndPassword(email,password)
      .then(userCredentials => {
        var type
        const user = userCredentials.user;
        const userid = userCredentials.user.uid;
        db.ref(`users/`+userid).on('value', function (snapshot) {
          type = (snapshot.val().type)
          if (type === 'giver'){
            navigation.navigate("Tabs")
          } 
          else{
            navigation.navigate("TabsGetter")
  
          }
        })

  
        console.log('Logged in with:',user.email)
       

      })
        // .catch(error=>alert(error.message))
        //  return;
      .catch(error => {   
        console.log(error)
        alert(error.message)
        // throw new Error(error.message);
        switch(error.message) {
          case "Can't find variable: db":
            Alert.alert('', "הודעת שגיאה",[,,{text:"אישור"}])
            break;
          case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
                Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[,,{text:"אישור"}])
                break;
          case 'The email address is badly formatted.':
            Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[,,{text:"אישור"}])
            break;
          case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
                Alert.alert('', "הודעת שגיאה: כתובת אמייל זו אינה קיימת, אנא צור חשבון קודם",[,,{text:"אישור"}])
                break;
          case 'There is no user record corresponding to this identifier. The user may have been deleted.':
            Alert.alert('', "הודעת שגיאה: כתובת אמייל זו אינה קיימת, אנא צור חשבון קודם",[,,{text:"אישור"}])
            break;
          case 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).':
                Alert.alert('', "הודעת שגיאה: הסיסמא אינה תקינה, אנא נסה שנית",[,,{text:"אישור"}])
                break;
          case 'The password is invalid or the user does not have a password.':
            Alert.alert('', "הודעת שגיאה: הסיסמא אינה תקינה, אנא נסה שנית",[,,{text:"אישור"}])
            break;
          case 'A network error (such as timeout, interrupted connection or unreachable host) has occurred.':
            Alert.alert('', "הודעת שגיאה: אירעה שגיאת רשת, אנא בדוק ונסה שנית",[,,{text:"אישור"}])
            break;
           
       }
     })
      // .catch(error=>alert(error.message))
      //    return;
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

    <View style={Styles.inputContainer}>
    <View style={Styles.inputContainer2}>

    <TextInput
        value={email}
        onChangeText={(email) => setEmail(email)}
        placeholder="אימייל"
        activeUnderlineColor="white"
        underlineColor='white'
        selectionColor={"black"}
        autoFocus={true}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
        
      />
      <MaterialCommunityIcons name={"email"} size={22} color="#232323" />

      </View>
        <Text style={Styles.errorMsg} >{emailError}</Text>
        <View style={Styles.inputContainer2}>
       <TextInput
        value={password}
        onChangeText={(password) => setPassword(password)}
        placeholder="סיסמה" 
        iconType="lock"
        activeUnderlineColor="white"
        underlineColor='white'
        selectionColor={"black"}
        secureTextEntry={passwordVisibility}

        style = {Styles.textInput}
       
        />
               
        <Pressable onPress={handlePasswordVisibility}>
    <MaterialCommunityIcons name={rightIcon} size={22} color="#232323" />
          </Pressable>
        </View>
         <Text style={Styles.errorMsg} >{passError}</Text>

         </View> 
         <View style = {Styles.center}>
         <TouchableOpacity onPress={handleLogin}
                style={Styles.conTouch} ><Text style = {[Styles.textColor,{fontSize: 25,}]}>כניסה</Text></TouchableOpacity>
         <TouchableOpacity  onPress={()=> navigation.navigate('SignUpScreen')}><Text style = {[Styles.textFor,{fontSize: 18,}]} >צור חשבון</Text></TouchableOpacity> 
         <TouchableOpacity  onPress={()=> navigation.navigate('ForgotPassword')}><Text style = {Styles.textFor} >שכחת סיסמא?</Text></TouchableOpacity> 

         </View> 
    </View> 
    
    
  )}
  export default LoginScreen;
  const Styles = StyleSheet.create({
     
          container: {
            backgroundColor: color.TURQUOISE,
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
            backgroundColor: color.WHITE,
            padding:10,
            // marginBottom:10,
            textAlign:'right',
            borderRadius:5,
            width:'90%',
            
           
          },
       
          inputContainer2: {
            backgroundColor: color.WHITE,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#d7d7d7',
          },
          conTouch :{
            borderWidth:2,
            color: color.WHITE,
            alignItems:'center',
            justifyContent:'center',
            borderColor:color.WHITE,
            width:150,
            height:50,
            backgroundColor:color.TURQUOISE,
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
            color: color.WHITE,
            fontSize: 35,
            paddingBottom:40,
            textAlign:'center'
          },
          textColor:{
            fontWeight: 'bold',
            color: color.WHITE,
            
          },
          // text: {
          //   fontSize: 18,
          //   marginTop:10,
          //   marginBottom: 10,
          //   color: color.BLACK,
          //   fontWeight: 'bold',
          // },
          textFor: {
            fontSize: 15,
            marginTop:10,
            marginBottom: 10,
            color: color.BLACK,
            fontWeight: 'bold',
          },
          errorMsg: {
            color: '#FF0000',
            fontSize: 14,
        },
        })
