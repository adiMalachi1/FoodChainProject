import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { color } from '../utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// a single message componenent for chat
const SingleMessage = (props) => {
    const { sender, item, sendTime } = props; //get params

    return (
        <View style ={{flex:1}}>
            <View
                style={[styles.TriangleShape,
                sender ?
                    styles.right
                    :
                    [styles.left]
                ]}
            />
            <View
                style={[styles.msgBubble, {
                    ...Platform.select({
                        ios: {
                            alignSelf: sender ? 'flex-start' : 'flex-end',

                        },
                        android:{
                         
                            alignSelf: sender ? 'flex-end' : 'flex-start',
                        },
                      }),
                    backgroundColor: sender ? color.TURQUOISE : color.WHITE_GRAY
                }]}>

                <Text style={[styles.msg, {
                        color:  sender ?color.WHITE_GRAY :color.BLACK,
                  }]}>
                    {item.message}
                </Text>
                <View
                    style={[styles.mainView, {
                        justifyContent: sender?'flex-end':"flex-start",
                        color:  sender ?color.WHITE_GRAY :color.BLACK,

                    }]}>
                    <Text style={[styles.sendTime,{color: sender ? color.WHITE_GRAY : color.BLACK}]}>
                        {sendTime}
                    </Text>
                    <MaterialCommunityIcons name={"check-all"} size={22} color={color.WHITE_GRAY} style={{color: item.seen ? color.BLACK : color.WHITE_GRAY , fontSize: 15, marginLeft: 5}}/>
                </View>   
            </View>
        </View>
    );
};

//define styling
const styles = StyleSheet.create({
    msgBubble: {
        alignSelf: 'flex-end',
        marginHorizontal: 10,
        minWidth: 80,
        maxWidth: '80%',
        paddingHorizontal: 10,
        marginVertical: 5,
        paddingTop: 5,
        borderRadius: 8
    },

    TriangleShape: {
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 15,
        borderRightWidth: 5,
        borderBottomWidth: 20,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    },
    left: {
        ...Platform.select({
            ios: {
                borderBottomColor: color.WHITE_GRAY,
                right: 2,
                // top:0,
                bottom: 10,
                transform: [{ rotate: '50deg' }]
            },
            android:{
                borderBottomColor: color.WHITE_GRAY,
                left: 2,
                bottom: 10,
                transform: [{ rotate: '0deg' }]
            },
          }),
    },
   
    right: {
        ...Platform.select({
            ios: {
                borderBottomColor: color.TURQUOISE,
                left: 2,
                bottom: 10,
                transform: [{ rotate: '0deg' }]
            },
            android:{
                borderBottomColor: color.TURQUOISE,
                right: 2,
                bottom: 5,
                transform: [{ rotate: '150deg' }]
            },
          }),    
    },
    flex: {
        ...Platform.select({
            ios: {
                alignSelf:'flex-start'
            },
            android:{
                alignSelf:'flex-end'

            },
          }),
    },
    mainView: {
        alignItems: 'center',
        marginBottom: 2,
        ...Platform.select({
            ios: {
                flexDirection: 'row-reverse',
             
            },
            android:{
                flexDirection: 'row',

            },
          }),
    },
    msg:{
         paddingLeft: 5,
          fontSize:12.5 ,
          ...Platform.select({
            ios: {
                textAlign:'right',
             
            },
            android:{
                textAlign:'left',

            },
          }),
    },
    
    sendTime:{
        fontSize: 7,
        textAlign:'right',
        writingDirection:'rtl',
        ...Platform.select({
            ios: {
                marginLeft:5,

            },
            android:{
                marginRight:5,

            },
            }),
    },
});

//make this component available to the app
export default SingleMessage;