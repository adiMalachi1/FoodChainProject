import React, { useContext } from 'react';
import { View, Text,Image, StyleSheet } from 'react-native';


const HomeScreen = () => {
  return (   
    <View style={styles.container}>
      <Image
        source={require('../assets/logoFoodChain.png')}
        style={styles.logo}
      />
      <View>
      <Text style={[styles.textColor, {
            fontSize: 30,
            paddingBottom:20,
            paddingTop:20,
          }]}>Food chain app</Text>
      </View>
      <View> 
        <Text style ={styles.textheader}>Welcome!</Text>
      </View> 
    </View>
    
  );
}
export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#009387',
    alignItems: 'center',
    paddingTop: 100, 
  },
  textColor:{
    fontWeight: 'bold',
    color: 'white'
  },
  textheader:{
    fontWeight: 'bold',
    color: 'white',
    fontSize: 40
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 10,
    paddingBottom: 100,
    
  },

});
