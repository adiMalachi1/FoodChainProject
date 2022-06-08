import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
    Pressable,
    TextInput,
    StatusBar,
} from 'react-native';
import {auth,db} from '../FirebaseConfig';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { color } from '../utils';

const LoginScreen = ({navigation}) => {
  // const use states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState();
  const [passError, setpassError] = useState();
  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye-off'); // for hide password


  const handlePasswordVisibility = () => { //handle function to show/not show password
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };


  const handleLogin =()=>{ // handle function for login to app + validation
    
    if(email==="" || password ==="" || (password.length < 6)){ //cant empty field, and password needs al least 6 characters

          if(email=== ""){ // email is empty
            Alert.alert('', "הודעת שגיאה: אימייל הינו שדה חובה",[,,{text:"אישור"}])
            return;
          }
          else{
            setEmailError("")
            // return;

          }
          if (password === ""){ //password is empty
            Alert.alert('', "הודעת שגיאה: סיסמא הינה שדה חובה",[,,{text:"אישור"}])

          }
          else if (password.length < 6){ //password less that 6 characters
            Alert.alert('', "הודעת שגיאה: על הסיסמא להיות בעלת 6 תווים לפחות",[,,{text:"אישור"}])
          }
          else{
            setpassError("")
          }
      }

     else{
        setpassError("")
        auth.signInWithEmailAndPassword(email,password) // sign in to firebase
        .then(userCredentials => {
          var type
          const userid = userCredentials.user.uid;//get userid
          db.ref(`users/`+userid).on('value', function (snapshot) { // ref to this user in firebase
            type = (snapshot.val().type) //get the type of current user that sigin
              navigation.navigate("Tabs", {type})
        
          })
      })
       
        .catch(error => {    //catch error and show to user by alert
          console.log(error)
          // alert(error.message)
          switch(error.message) {
            case "Can't find variable: db":
              Alert.alert('', "הודעת שגיאה",[,,{text:"אישור"}])
              break;
            case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
                  Alert.alert('', "הודעת שגיאה: כתובת אימייל לא תקינה",[,,{text:"אישור"}])
                  break;
            case 'The email address is badly formatted.':
              Alert.alert('', "הודעת שגיאה: כתובת אימייל לא תקינה",[,,{text:"אישור"}])
              break;
            case 'Firebase: There is no user record corresponding to this identifier. The user may have been deleted. (auth/user-not-found).':
                  Alert.alert('', "הודעת שגיאה: כתובת אימייל זו אינה קיימת, אנא צור חשבון קודם",[,,{text:"אישור"}])
                  break;
            case 'There is no user record corresponding to this identifier. The user may have been deleted.':
              Alert.alert('', "הודעת שגיאה: כתובת אימייל זו אינה קיימת, אנא צור חשבון קודם",[,,{text:"אישור"}])
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
    
    }
  }

  return(
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
      <View style =  {styles.center}>
        <Image
          source={require('../assets/logoFoodChain.png')}
          style={styles.logo}/>
      </View> 
      <Text style={styles.textheader}>ברוכים הבאים!</Text>
      <View style={styles.inputContainer}>
        <View style={styles.inputContainer2}>
          <TextInput
              value={email}
              onChangeText={(email) => setEmail(email)}
              placeholder="אימייל"
              activeUnderlineColor={color.WHITE}
              underlineColor={color.WHITE}
              selectionColor={color.BLACK}
              autoFocus={true}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style = {styles.textInput}    
            />
            <MaterialCommunityIcons name={"email"} size={22} color={color.BLACK} />
        </View>
          <Text style={styles.errorMsg} >{emailError}</Text>
        <View style={styles.inputContainer2}>
          <TextInput
            value={password}
            onChangeText={(password) => setPassword(password)}
            placeholder="סיסמא" 
            iconType="lock"
            activeUnderlineColor={color.WHITE}
            underlineColor={color.WHITE}
            selectionColor={color.BLACK}
            secureTextEntry={passwordVisibility}
            style = {styles.textInput}    
            />          
          <Pressable onPress={handlePasswordVisibility}>
            <MaterialCommunityIcons name={rightIcon} size={22} color={color.BLACK} />
          </Pressable>
        </View>
      </View> 
      <View style = {styles.center}>
          <TouchableOpacity onPress={handleLogin} style={styles.conTouch} >
              <Text style = {[styles.textColor,{fontSize: 25,textAlign:'center'}]}>כניסה</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={()=> navigation.navigate('מסך הרשמה')}>
            <Text style = {[styles.textFor,{fontSize: 18,}]} >צור חשבון</Text>
          </TouchableOpacity> 
          <TouchableOpacity  onPress={()=> navigation.navigate('ForgotPassword')}>
            <Text style = {styles.textFor} >שכחת סיסמא?</Text>
          </TouchableOpacity> 
      </View> 

    </View> 
    
    
  )}
  export default LoginScreen;
  const styles = StyleSheet.create({
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
            alignItems: 'center',
            alignSelf:'center',
            padding:20,
          },
          textInput:{
            backgroundColor: color.WHITE_GRAY,
            padding:10,
            // marginBottom:10,
            textAlign:'right',
            borderRadius:5,
            width:'90%',
            
          },
          inputContainer2: {
            backgroundColor: color.WHITE_GRAY,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#d7d7d7',
          },
          conTouch :{
            marginTop:20,
            borderWidth:2,
            color: color.WHITE_GRAY,
            alignSelf:'center',
            width:150,
            height:50,
            borderColor: color.WHITE_GRAY,
            borderRadius: 10,
            backgroundColor:color.TURQUOISE,
            alignItems:'center',
            justifyContent:'center',
            alignContent:'center',
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
            color: color.WHITE_GRAY,
            fontSize: 35,
            paddingBottom:40,
            textAlign:'center'
          },
          textColor:{
            fontWeight: 'bold',
            color: color.WHITE_GRAY,
            
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
            // marginBottom: 5,
            color: color.BLACK,
            fontWeight: 'bold',
          },
          errorMsg: {
            color: '#FF0000',
            fontSize: 14,
        },
        })
