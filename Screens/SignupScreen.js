
import React, {useState,useRef} from 'react';
import { RadioButton } from 'react-native-paper';
import {auth, db} from '../FirebaseConfig';

import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    TextInput,
    Alert
} from 'react-native';
import Recaptcha from 'react-native-recaptcha-that-works';
import { color } from '../utils';

const SignUpScreen = ({navigation}) => {
    const [checked, setChecked] = React.useState('giver');
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const $recaptcha = useRef();

    // const check = () => {
     
    // }
    function ValidatePhoneNumber(phoneNumber) { // check if the cell phone number is valid for israel
        var regex = /^05\d([-]{0,1})\d{7}$/;
        var phone = phoneNumber.match(regex);
        if (phone) {
          return true;
        }
        return false;
      }
    const onVerify = token => {
        console.log('success!', token);
        if(checked === 'giver'){

            navigation.navigate('FormGiver')           

        }
        else{
            navigation.navigate('FormGetter')
        }
    
    }
    
    const onExpire = () => {
        console.warn('expired!');
    }
    const handleSignUp = () =>{

        if(user == "" ||  email== "" || phone == "" || password == "" || confirmPassword == "" ){
            if(user == ""){
                 Alert.alert('', "הודעת שגיאה: שם ארגון הינו שדה חובה, אנא הזן אותו",[,,{text:"אישור"}])
                 return;
            }
            if(email == ""){
                Alert.alert('', "הודעת שגיאה: אמייל הינו שדה חובה, אנא הזן אותו",[,,{text:"אישור"}])
                return;
           }
           if(phone == "" || ValidatePhoneNumber(phone)=== false){
            if(phone == ""){
                Alert.alert('', "הודעת שגיאה: מס' פלאפון הינו שדה חובה, אנא הזן אותו",[,,{text:"אישור"}])
                return;
            }
            else{
                Alert.alert('', "הודעת שגיאה: מס' הפלאפון אינו תקין, אנא הזן את המספר הסלולרי שלך",[,,{text:"אישור"}])
                return;
            }
           }
           if(password == "" || password.length < 6  ){
               if(password == ""){
                Alert.alert('', "הודעת שגיאה: סיסמא הינה שדה חובה, אנא הזן אותה",[,,{text:"אישור"}])
                return;
               }
                else{
                    Alert.alert('', "הודעת שגיאה: הסיסמא צריכה להיות בעלת 6 תווים לפחות",[,,{text:"אישור"}])
                    return;
                }
            }
            if(confirmPassword == "" ){  
              Alert.alert('', "הודעת שגיאה: אימות סיסמא הינה שדה חובה, אנא הזן אותה",[,,{text:"אישור"}])
              return;
            }
           
        }
       
        else if(confirmPassword !== password){
            Alert.alert('', "הודעת שגיאה: הסיסמאות אינן תואמות, אנא נסה שנית",[,,{text:"אישור"}])
            return;
        }
        else if(ValidatePhoneNumber(phone)=== false){
            Alert.alert('', "הודעת שגיאה: מס' הפלאפון אינו תקין, אנא הזן את המספר הסלולרי שלך",[,,{text:"אישור"}])
            return;
        }
        else{
            
            auth.createUserWithEmailAndPassword(email,password)
                .then((res) => {
                    if (auth.currentUser) {
                        const userid = auth.currentUser.uid;
                        if (userid) {
                            // alert("y")
                            db.ref('users/' + res.user.uid ).set({
                                userName: user,
                                email: email,
                                phone: phone, 
                                password: password,
                                type:checked,
                                
                            })
                            // alert("njk")
                $recaptcha.current.open();

                            } 

                    }})
                .catch((error) => {
                    console.log(error.message);
                    switch(error.message) {
                        case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
                        Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[,,{text:"אישור"}])
                        break;
                        case 'The email address is badly formatted.':
                        Alert.alert('', "הודעת שגיאה: כתובת אמייל לא תקינה",[,,{text:"אישור"}])
                        break;
                        case 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).':
                        Alert.alert('', "הודעת שגיאה: כתובת אמייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
                        break;
                        case 'The email address is already in use by another account.':
                        Alert.alert('', "הודעת שגיאה: כתובת אמייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
                        break;
                        case 'Firebase: The email address is already in use by another account.':
                        Alert.alert('', "הודעת שגיאה: כתובת אמייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
                        break;
                }})
   
        }
    }
    return (
    
    <View style ={Styles.container}>
    
        <Text style = {Styles.textDetail}>נא הזן את הפרטים שלך</Text>
        <Text  style={{marginVertical:10, writingDirection:'rtl'}}>שם הארגון</Text>

        <TextInput
        value={user}
        onChangeText={(userName) => setUser(userName)}
        placeholder="שם תורם/נתרם"
        autoCapitalize="none"
        textAlign='right'
        autoCorrect={false}
        style = {Styles.textInput}
        autoFocus = {true}
      />
       <Text  style={{marginVertical:10,writingDirection:'rtl'}} >אמייל</Text>

       <TextInput
        value={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholder="אימייל"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <Text  style={{marginVertical:10,writingDirection:'rtl'}}>פלאפון סלולרי</Text>

       <TextInput
        value={phone}
        onChangeText={(userPhone) => setPhone(userPhone)}
        placeholder="מס' פלאפון"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <Text  style={{marginVertical:10,writingDirection:'rtl'}}>סיסמא</Text>

       <TextInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholder="סיסמה" 
        textAlign='right'
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <Text  style={{marginVertical:10,writingDirection:'rtl'}}>אימות סיסמא</Text>

       <TextInput
        value={confirmPassword}
        onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
        placeholder="אימות סיסמה" 
        textAlign='right'
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
      
      
    <View style={{ flexDirection: 'row', justifyContent: 'center',margin:10,}}>
        <View>
        <Text style ={Styles.text}>נתרם</Text>
            <RadioButton
            value="getter"
            name = "נתרם"
            status={ checked === 'getter' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('getter')}
            />
            
        
        </View>
        <View>
           
            <Text style ={Styles.text}>תורם</Text>
            <RadioButton
            value="giver"
            title = "תורם"
            status={ checked === 'giver' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('giver')}
            
            />
        </View>
        </View>
        <Recaptcha
          ref={$recaptcha}
          lang="iw"//for hebrew
          siteKey="6Lful3YeAAAAAO13Y30Zsnx33PuTG0ms3xJ6-VXN"
          baseUrl="http://127.0.0.1"
          onError={(err) => {
            alert('onError event');
            console.warn(err);
          }}
          onVerify={onVerify}
          onExpire={onExpire}
          
         />
        <View style = { Styles.center}>
        <TouchableOpacity
                onPress={()=>{handleSignUp();}}
                style={Styles.conTouch}  >
            <Text style = {[Styles.textColor,{fontSize: 20,}]}>המשך</Text></TouchableOpacity>
        </View>

    </View>

    );
};

export default SignUpScreen;
const Styles = StyleSheet.create({
    container: {
        backgroundColor: color.WHITE,
        flex: 1, 
        // paddingTop:50,
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 20,
      },
    textInput:{
        borderWidth:1,
        borderColor: 'gray',
        backgroundColor: 'white',
        padding:10,
        // marginBottom:10,
        textAlign:'right',

        borderRadius:5,
      },
    text:{
        fontWeight: 'bold',
        color: color.BLACK,
        fontSize: 20,
        paddingHorizontal:10,
        textAlign:'center'
        },
    textDetail:{
        textAlign:'center',
        fontSize:25,
        fontWeight:'bold',
        // paddingBottom:15,
        paddingTop:15,

    },
    textColor:{
        fontWeight: 'bold',
        color: color.WHITE,
      },
    conTouch :{
        borderWidth:2,
        borderColor:color.WHITE,
        alignItems:'center',
        justifyContent:'center',
        width:150,
        height:50,
        backgroundColor:color.TURQUOISE,
        borderRadius:10,
        },
    center:{
        alignItems:'center',
        alignContent:'center',
        // textAlign: 'center',
        // padding: 20,
        paddingBottom:100,
    },
    })