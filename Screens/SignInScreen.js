import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Button
} from 'react-native';

const SignInScreen = ({navigation}) => {
    return (
        <View style ={Styles.container}>
            <Text>SignIn Screen</Text>
            <Button
                title = "Clicked Me!"
                 onPress={()=> navigation.navigate('SignUpScreen')}
            />
        </View>

    );
};

export default SignInScreen;
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
        alignItems: 'center',
        paddingTop: 100, 
      },
    })