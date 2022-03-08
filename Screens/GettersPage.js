import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Button
} from 'react-native';

const GettersPage = ({navigation}) => {
    return (
        <View style ={Styles.container}>
            <Text>GettersPage Screen</Text>
            <Button
                title = "Clicked Me!"
                onPress = {()=>alert("button Clicked!")}
            />
        </View>

    );
};

export default GettersPage;
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
        alignItems: 'center',
        paddingTop: 100, 
      },
    }) 