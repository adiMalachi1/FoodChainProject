import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Button
} from 'react-native';

const FormGiver = () => {
    return (
        <View style ={Styles.container}>
            <Text style= {Styles.text}> שלום תורם יקר, תודה שהצטרפת אלינו! אנא מלא את השאלון והפרופיל שלך.</Text>
            {/* <Button
                title = "Clicked Me!"
                onPress = {()=>alert("button Clicked!")}
            /> */}
              <View
                style = {{
                    backgroundColor:'white',
                    width:300,
                    height:380,
                    padding: 20,
                    paddingTop:50,
                    borderRadius:5,

                }}
            />
        </View>

    );
};

export default FormGiver;
const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#009387',
        alignItems: 'center',
        paddingTop: 100, 
      },
      text:{
        textAlign:'center',
        fontSize:23,
        fontWeight:'bold',
        paddingBottom:50,

      }
    })