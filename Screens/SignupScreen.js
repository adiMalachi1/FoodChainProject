
import React, {useState} from 'react';
import { RadioButton } from 'react-native-paper';


import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    TextInput,
} from 'react-native';

const SignUpScreen = ({navigation}) => {
    const [checked, setChecked] = React.useState('first');
    const [user, setUser] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [phone, setPhone] = useState();

    const [confirmPassword, setConfirmPassword] = useState('')
   
    const check = () => {
        if(checked === 'first'){
            // alert('שאלון לעמותה')
            navigation.navigate('FormGetter')

        }
        else{
            // alert('שאלון לעסק')
            navigation.navigate('FormGiver')

        }
    }
    return (
    <View style ={Styles.container}>
        <Text style = {Styles.textDetail}>נא הזן את הפרטים שלך</Text>
        <TextInput
        value={user}
        onChangeText={(userName) => setUser(userName)}
        placeholder="שם תורם/נתרם"
        autoCapitalize="none"
        textAlign='right'
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <TextInput
        value={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholder="אימייל"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <TextInput
        value={phone}
        onChangeText={(userPhone) => setPhone(userPhone)}
        placeholder="מס' פלאפון"
        keyboardType="numeric"
        autoCapitalize="none"
        autoCorrect={false}
        style = {Styles.textInput}
      />
       <TextInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholder="סיסמה" 
        textAlign='right'
        secureTextEntry={true}
        style = {Styles.textInput}
      />
       <TextInput
        value={confirmPassword}
        onChangeText={(userConfirmPassword) => setConfirmPassword(userConfirmPassword)}
        placeholder="אימות סיסמה" 
        textAlign='right'
        secureTextEntry={true}
        style = {Styles.textInput}
      />
       
    <View style={{ flexDirection: 'row', justifyContent: 'center' , paddingBottom:10,}}>
        <View>
        <Text style ={Styles.text}>תורם</Text>
            <RadioButton
            value="second"
            name = "תורם"
            status={ checked === 'second' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('second')}
            />
            
        
        </View>
        <View>
           
            <Text style ={Styles.text}>נתרם</Text>
            <RadioButton
            value="first"
            title = "נתרם"
            status={ checked === 'first' ? 'checked' : 'unchecked' }
            onPress={() => setChecked('first')}
            
            />
        </View>
        </View>
        <View style = { Styles.center}>
        <TouchableOpacity
            onPress={()=>check()}
            // onPress = {()=> alert(checked)}
                style={Styles.conTouch} 
            ><Text style = {[Styles.textColor,{fontSize: 20,}]}>המשך</Text></TouchableOpacity>
        </View>

    </View>

    );
};

export default SignUpScreen;
const Styles = StyleSheet.create({
    container: {
        backgroundColor: '#009387',
        flex: 1,
        paddingTop:75,
        
        // justifyContent: 'center',
        // alignItems: 'center',
        padding: 20,
      },
    textInput:{
        borderWidth:1,
        borderColor: 'gray',
        backgroundColor: 'white',
        padding:10,
        marginBottom:20,
        borderRadius:5,
      },
    text:{
        fontWeight: 'bold',
        color: 'white',
        fontSize: 20,
        paddingHorizontal:10,
        textAlign:'center'
      },
    textDetail:{
    textAlign:'center',
    fontSize:25,
    fontWeight:'bold',
    paddingBottom:25,

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
    center:{
        alignItems:'center',
        alignContent:'center',
        // textAlign: 'center',
        padding: 20,
        paddingBottom:100,
       },
    //    centerRadio:{
    //     alignItems:'center',
    //     alignContent:'center',
    //     // textAlign: 'center',
    //     flexDirection: 'row',
    //     justifyContent: 'center' ,
    //     paddingBottom:20
    //     // padding: 20,
    //     // paddingBottom:100,
    //    },
    })