import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Picker,
    StyleSheet,
    Image,
    Button
} from 'react-native';
import {Icon} from 'react-native-elements'
import {auth} from '../FirebaseConfig';

const SignInScreen = ({navigation}) => {
    const [selectedValue, setSelectedValue] = useState("java");

    const handleSignOut = () => {
        auth
          .signOut()
          .then(() => {
            navigation.replace("HomeScreen")
          })
          .catch(error => alert(error.message))
      }
    return (
        <View style ={Styles.container}>
          <View style = {Styles.head}>    
            <View style = {[{ alignItems:'center',
                            justifyContent: 'center',
                           }]}>
              <Text style = {Styles.text}>עמוד הבית</Text>
            </View>
            <View style = {[{alignItems:'center',
                            justifyContent: 'center'}]}>
            <Icon
               type = "material-community"
               name = "menu"
               color = "#009387"
               size = {30}

            />
            </View>
          </View>
                <Picker
                selectedValue={selectedValue}
                style={{ height: 50, width: 150 }}
                onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
            >
                <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" />
            </Picker>
            <Text>SignIn Screen</Text>
            <Text>Email: {auth.currentUser?.email}</Text>
            <TouchableOpacity
                onPress={handleSignOut}
                style={Styles.button}
            >
                <Text style={Styles.buttonText}>Sign out</Text>
            </TouchableOpacity>
        </View>

    );
};

export default SignInScreen;
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#009387',
        backgroundColor: "#fff",
        margin:10,
        // alignItems: 'center',
        paddingTop: 10, 
      },
      button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
      },
      buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
      },
      head: {
      // alignItems: 'flex-start',
        justifyContent: 'space-between', 
      flexDirection: 'row',
       margin:20,
      },
      text:{
        fontWeight: 'bold',
        color: '#009387',
        fontSize: 22,

      },
    })