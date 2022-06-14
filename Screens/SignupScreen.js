import React, {useState,useRef} from 'react';
import {auth, db} from '../FirebaseConfig';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    TextInput,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Pressable,
    StatusBar,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Recaptcha from 'react-native-recaptcha-that-works';
import { color } from '../utils';
import Checkbox from 'expo-checkbox';

const SignUpScreen = ({navigation}) => {
    //set state for data we needed
    const [isGetter, setIsGetter] = useState(false);
    const [isGiver, setIsGiver] = useState(false);
    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordVisibility, setPasswordVisibility] = useState(true);
    const [passwordConfirmVisibility, setPasswordConfirmVisibility] = useState(true);
    const [rightIcon, setRightIcon] = useState('eye-off'); // for hide password
    const [rightConfirmIcon, setRightConfirmIcon] = useState('eye-off'); // for hide password
    const $recaptcha = useRef(); //"i'm not a robot"

    const handlePasswordVisibility = () => { //handle function to show/not show password
        if (rightIcon === 'eye') {
          setRightIcon('eye-off');
          setPasswordVisibility(!passwordVisibility);  
        } else if (rightIcon === 'eye-off') {
          setRightIcon('eye');
          setPasswordVisibility(!passwordVisibility);
        }
      };

    const handleConfirmPasswordVisibility = () => { //handle function to show/not show password
        if(rightConfirmIcon === 'eye') {
            setRightConfirmIcon('eye-off');
            setPasswordConfirmVisibility(!passwordConfirmVisibility);
        } else if (rightConfirmIcon === 'eye-off') {
            setRightConfirmIcon('eye');
            setPasswordConfirmVisibility(!passwordConfirmVisibility);
        }
    };

    function ValidatePhoneNumber(phoneNumber) { // check if the cell phone number is valid for israel
        var regex = /^05\d([-]{0,1})\d{7}$/;
        var phone = phoneNumber.match(regex);
        if (phone) {
          return true;
        }
        return false;
    }
    
    const onVerify = token => { //navigate to appropriate screen depend on type user
        console.log('success!', token);
        if(isGiver === true){
            navigation.navigate('שאלון תורם')           
        }
        else{
            navigation.navigate('שאלון נתרם')
        }
    }
    //handler function for check box - can select only one, cant together 
    const giver = ()=>{
        if(isGiver === false){
          setIsGiver(true)
          setIsGetter(false)
        }
    }
    const getter = ()=>{
        if(isGetter === false){
          setIsGetter(true)
          setIsGiver(false)
        }  
    }

    const onExpire = () => {
        console.warn('expired!');
    }

    const handleSignUp = () =>{ //handler function for sign up with firebase with validation
        var type 
        if(isGiver === true)
            type = "giver"
        if(isGetter === true)
            type = "getter"
        // alert(type)
        if(user == "" ||  email== "" || phone == "" || password == "" || confirmPassword == "" ){ //error if field is empty
            if(user == ""){
                 Alert.alert('', "הודעת שגיאה: שם ארגון הינו שדה חובה, אנא הזן אותו",[,,{text:"אישור"}])
                 return;
            }
            if(email == ""){
                Alert.alert('', "הודעת שגיאה: אימייל הינו שדה חובה, אנא הזן אותו",[,,{text:"אישור"}])
                return;
           }
           if(phone == "" || ValidatePhoneNumber(phone)=== false){ //phone validation
                if(phone == ""){
                    Alert.alert('', "הודעת שגיאה: מס' פלאפון הינו שדה חובה, אנא הזן אותו",[,,{text:"אישור"}])
                    return;
                }
                else{
                    Alert.alert('', "הודעת שגיאה: מס' הפלאפון אינו תקין, אנא הזן את המספר הסלולרי שלך",[,,{text:"אישור"}])
                    return;
                }
           }
           if(password == "" || password.length < 6  ){ //password validation
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
       
        else if(confirmPassword !== password){ // the passwords dont the same
            Alert.alert('', "הודעת שגיאה: הסיסמאות אינן תואמות, אנא נסה שנית",[,,{text:"אישור"}])
            return;
        }
        else if(ValidatePhoneNumber(phone)=== false){
            Alert.alert('', "הודעת שגיאה: מס' הפלאפון אינו תקין, אנא הזן את המספר הסלולרי שלך",[,,{text:"אישור"}])
            return;
        }
        else if(isGetter === false && isGiver === false){
            Alert.alert('', "הודעת שגיאה: עליך לבחור האם אתה תורם או נתרם",[,,{text:"אישור"}])
            return;
        }
        else{
            /// after validation,create an account-user and put all field under current user in realtime db firebase
            auth.createUserWithEmailAndPassword(email,password)
                .then((res) => {
                    if (auth.currentUser) {
                        const userid = auth.currentUser.uid;
                        if (userid) {
                            db.ref('users/' + res.user.uid ).set({
                                userName: user,
                                email: email,
                                phone: phone, 
                                password: password,
                                type:type,
                                
                            })
                             $recaptcha.current.open();
                        } 
                        else{
                            Alert.alert('', "הודעת שגיאה: זהו לא המזהה הנכון",[,,{text:"אישור"}])
                        }
                    }
                    else{
                        Alert.alert('', "הודעת שגיאה: זהו אינו משתמש פעיל במערכת, יתכן כי משתמש זה כבר מחובר ממכשיר אחר, אנא התנתק ונסה שנית",[,,{text:"אישור"}])
                    } 
                })
                .catch((error) => {
                    console.log(error.message);
                    switch(error.message) {
                        case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
                        Alert.alert('', "הודעת שגיאה: כתובת אימייל לא תקינה",[,,{text:"אישור"}])
                        break;
                        case 'The email address is badly formatted.':
                        Alert.alert('', "הודעת שגיאה: כתובת אימייל לא תקינה",[,,{text:"אישור"}])
                        break;
                        case 'Firebase: The email address is already in use by another account. (auth/email-already-in-use).':
                        Alert.alert('', "הודעת שגיאה: כתובת אימייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
                        break;
                        case 'The email address is already in use by another account.':
                        Alert.alert('', "הודעת שגיאה: כתובת אימייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
                        break;
                        case 'Firebase: The email address is already in use by another account.':
                        Alert.alert('', "הודעת שגיאה: כתובת אימייל זו כבר קיימת במערכת",[,,{text:"אישור"}])
                        break;
                }}) 
        }
    }
return (
    <ScrollView>
        <View style ={styles.container}>
            <Text style = {styles.textDetail}>נא הזן את הפרטים שלך</Text>
            <Text  style={{marginVertical:15, writingDirection:'rtl'}}>שם הארגון</Text>
            <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : null}
                    keyboardVerticalOffset={Platform.select({ ios: 30, android: 50 })}>
            <View style={styles.inputContainer2}>

            <TextInput
            value={user}
            onChangeText={(userName) => setUser(userName)}
            placeholder="שם תורם/נתרם"
            autoCapitalize="none"
            textAlign='right'
            autoCorrect={false}
            style = {styles.textInput}
            autoFocus = {true}
            />
            <MaterialCommunityIcons name={"account"} size={22} color={color.ICONEYE} />
            </View>

            <Text  style={{marginVertical:10,writingDirection:'rtl'}} >אימייל</Text>
            <View style={styles.inputContainer2}>

            <TextInput
                value={email}
                onChangeText={(userEmail) => setEmail(userEmail)}
                placeholder="אימייל"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style = {styles.textInput}
                />
                <MaterialCommunityIcons name={"email"} size={22} color={color.ICONEYE} />
            </View>
             <Text  style={{marginVertical:10,writingDirection:'rtl'}}>פלאפון סלולרי</Text>
             <View style={styles.inputContainer2}>

            <TextInput
                value={phone}
                onChangeText={(userPhone) => setPhone(userPhone)}
                placeholder="מס' פלאפון"
                keyboardType="numeric"
                autoCapitalize="none"
                autoCorrect={false}
                style = {styles.textInput}
                />
            <MaterialCommunityIcons name={"phone"} size={22} color={color.ICONEYE} />
            </View>
           <Text  style={{marginVertical:10,writingDirection:'rtl'}}>סיסמא</Text>
       {/* <KeyboardAvoidingView   
                 behavior={Platform.OS === 'ios'? 'padding' : null} keyboardVerticalOffset="70" enabled > */}

            <View style={styles.inputContainer2}>
                <TextInput
                    value={password}
                    onChangeText={(userPassword) => setPassword(userPassword)}
                    placeholder="סיסמא"
                    textAlign='right'
                    secureTextEntry={passwordVisibility}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style = {styles.textInput}
                    />
                <Pressable onPress={handlePasswordVisibility}>
                    <MaterialCommunityIcons name={rightIcon} size={22} color={color.ICONEYE} />
                </Pressable>
            </View>
            <Text  style={{marginVertical:10,writingDirection:'rtl'}}>אימות סיסמא</Text>
            <View style={styles.inputContainer2}>
                <TextInput
                    value={confirmPassword}
                    onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
                    placeholder="אימות סיסמא" 
                    textAlign='right'
                    secureTextEntry={passwordConfirmVisibility}
                    autoCapitalize="none"
                    autoCorrect={false}
                    style = {styles.textInput}
                    />
                <Pressable onPress={handleConfirmPasswordVisibility}>
                    <MaterialCommunityIcons name={rightConfirmIcon} size={22} color={color.ICONEYE} />
                </Pressable>
            </View>
            <View style={styles.section}>  
                <Text style={styles.paragraph}>נתרם</Text>
                <Checkbox
                style={styles.checkbox}
                value={isGetter}
                onValueChange={getter}
                color={isGetter ? color.TURQUOISE : undefined}
                />
                <Text style={[styles.paragraph,{paddingLeft:10}]}>תורם</Text>
                <Checkbox
                style={styles.checkbox}
                value={isGiver}
                onValueChange={giver}
                color={isGiver ? color.TURQUOISE : undefined}
                />
            </View>
            <Recaptcha
            ref={$recaptcha}
            lang="iw"//for hebrew
            siteKey="6Lful3YeAAAAAO13Y30Zsnx33PuTG0ms3xJ6-VXN"
            baseUrl="http://127.0.0.1"
            onError={(err) => {
                // alert('שגיאה');
                console.warn(err);
            }}
            onVerify={onVerify}
            onExpire={onExpire} />
            <View style = { styles.center}>
                <TouchableOpacity
                    onPress={handleSignUp}
                    style={styles.conTouch}  >
                 <Text style = {[styles.textColor,{fontSize: 20,}]}>המשך</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    </View>
    </ScrollView>
    );
};

//make this component available to the app
export default SignUpScreen;

//define styling
const styles = StyleSheet.create({
    container: {
        backgroundColor: color.WHITE_GRAY,
        flex: 1, 
        marginVertical:'10%',
        marginHorizontal:'5%',
    },
    inputContainer2: {
        borderColor:color.GRAY,
        backgroundColor: color.WHITE,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth: 1.5,
        ...Platform.select({
            ios: {
                flexDirection: 'row',

            },
            android:{
                flexDirection: 'row-reverse',
            },

        }),
    },
    textInput:{
        backgroundColor: color.WHITE,
        padding:10,
        borderColor:color.GRAY,
        textAlign:'right',
        borderRadius:5,
        width:'90%',
     },
    textDetail:{
        textAlign:'center',
        fontSize:25,
        fontWeight:'bold',
        paddingTop:35,
        paddingBottom:10,
    },
    textColor:{
        fontWeight: 'bold',
        color: color.WHITE_GRAY,
      },
    conTouch :{
        borderColor:color.WHITE_GRAY,
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
    },
    section: {
        alignItems: 'center',
        alignSelf:'center',
        marginVertical:25,
        ...Platform.select({
            ios: {
              flexDirection: 'row',
            },
          android: {
            flexDirection: 'row-reverse',
          }}),
      },
    paragraph: {
    fontSize: 18,
    },
    checkbox: {
    margin: 8,
    borderRadius:10,
    }, 
})