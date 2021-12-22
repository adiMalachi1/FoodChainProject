import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Button
} from 'react-native';

const SignUpScreen = () => {
    return (
        <View style ={Styles.container}>
            <Text>SignUp Screen</Text>
            <Button
                title = "Clicked Me!"
                onPress = {()=>alert("button Clicked!")}
            />
        </View>

    );
};

export default SignUpScreen;
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
        alignItems: 'center',
        paddingTop: 100, 
      },
    })