import { 
    View, 
    Text, 
    StyleSheet,
    Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { color } from '../utils';
import React from 'react'
import {StatusBar} from 'react-native';
import { Avatar} from 'react-native-elements';
const ChatHeader = (props) => {
    const { data } = props;
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} translucent={false} />
                <Avatar
                    source = {{uri: data.image}} 
                    rounded
                    size="medium"
                /> 
        
            <View style={styles.side}>
                <Text
                    numberOfLines={1}
                    style={{
                        color: color.BLACK,
                        fontSize: 16,
                        marginHorizontal:5,
                        textTransform:'capitalize'
                    }}>
                    {data.name}
                </Text>
                
            </View>
        </View>
    );
};
// define your styles
const styles = StyleSheet.create({
    container: {
        height:70,
        maxWidth:'50%',
        alignItems:'center',
        padding:10,
        ...Platform.select({
            ios: {
                flexDirection: 'row-reverse',
            },
            android:{
                flexDirection: 'row',
            },

        }),
    },
    side:{
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        maxWidth:'80%',

        ...Platform.select({
            ios: {
                flexDirection:'row',
            },
            android:{
                flexDirection: 'row-reverse',
            },

    }),
    }
});
//make this component available to the app
export default ChatHeader;