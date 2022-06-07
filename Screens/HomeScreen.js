import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
} from 'react-native';
import { StatusBar } from 'react-native';
import { color } from '../utils';
//the home screen of foodchain app with their logo organization
const HomeScreen = ({navigation}) => {
    return (
      
        <View style = {styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} />
            <Image
                source={require('../assets/logoFoodChain.png')}
                style={styles.logo}
            />
            <View style = {styles.center}>
                <Text style={styles.textSecondHeader}>ברוכים הבאים</Text>
                <Text style={styles.textSecondHeader}>לאפליקצית FoodChain!</Text>
            </View>
            <TouchableOpacity onPress={()=> navigation.navigate('LoginScreen')} style={styles.conTouch} >
                <Text style = {[styles.textColor,{fontSize: 20,}]}>המשך</Text>
            </TouchableOpacity>

        </View> 
    );
};

export default HomeScreen;
//styling
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.TURQUOISE,
        alignItems: 'center',
        paddingTop: 100, 
      },
      textColor:{
        fontWeight: 'bold',
        color: color.WHITE,
      },
      textheader:{
        fontWeight: 'bold',
        color: color.WHITE,
        fontSize: 40,
        paddingBottom:200,
      },
      center:{
        alignItems:'center',
        alignContent:'center',
        padding: 20,
        paddingBottom:100,
      },
      textSecondHeader:{
        fontWeight: 'bold',
        color: color.WHITE,
        fontSize: 30,
        paddingBottom:10,
      },
      logo: {
        height: 100,
        width: 100,
        borderRadius: 10,
        paddingBottom: 100,
        paddingVertical: 10,
        resizeMode: 'cover',
      },
      conTouch :{
        borderWidth:2,
        borderColor:color.WHITE,
        alignItems:'center',
        justifyContent:'center',
        width:150,
        height:50,
        backgroundColor: color.TURQUOISE,
        borderRadius:10,
        },
   
});