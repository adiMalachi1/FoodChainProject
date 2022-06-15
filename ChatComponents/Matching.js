import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    Platform,   
    Modal,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import React, {useEffect, useState} from 'react';
import {db} from '../FirebaseConfig';
import {color } from '../utils';
import moment from 'moment';

const Matching = (props) => {
    //get params - user date and data of second user - who recieved the messages and מotifications
    const { receiverData,dataUser} = props;
    const [show,setShow] = useState(false)
    const [showText, setShowText] = useState(true);
    const [isChecked, setChecked] = useState(false);
    const [isCheckedNo, setCheckedNo] = useState(false);
    
    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
          setShowText((showText) => !showText);
        }, 700);
        return () => clearInterval(interval);
      }, []);

    const Yes = ()=>{ // if check box is yes 
      if(isChecked === false){
        setChecked(true)
        setCheckedNo(false)

      }
    }
    const No = ()=>{ // if check box is no 
      if(isCheckedNo === false){
        setCheckedNo(true)
        setChecked(false)

      }
     
    }
    const match = () => { //for 2 users push to firebase information if exchange made to the users
      setShow(false)
      db.ref('users/'+dataUser.key+'/match')
      .push({
          status:isChecked,
          date:moment().format('LLLL'),
          with: receiverData.name,
          rating:defaultRating,


      })
      db.ref('users/'+receiverData.key+'/match')
      .push({
        status:isChecked,
        date:moment().format('LLLL'),
        with:dataUser.name,
        rating:defaultRating
      })
    }

    //make rating feedback by star images 
    const [defaultRating, setDefaultRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1,2,3,4,5])
    const starImageEmpty = 'https://raw.githubusercontent.com/tranhonghan/images/main/star_corner.png'
    const starImageFilled = 'https://raw.githubusercontent.com/tranhonghan/images/46b0935e75d1a738b8457e6e95f821b861da3986/star_filled.png'
    const RatingStar = ()=>{
        return(
            <View style = {styles.ratingStarStyle}>
            {
            maxRating.map((item,key)=>{
                return (
                <TouchableOpacity
                    activeOpacity={0.7}
                    key = {item}
                    onPress = {()=> setDefaultRating(item)}
                    >
                <Image
                    style ={styles.starImageStyle}
                    source = {
                    item <= defaultRating 
                    ? {uri: starImageFilled}
                    : {uri:starImageEmpty}
                    }
                />
                </TouchableOpacity>
                )
            })
            }
            </View>
        )
    }
return(
    <View>
        <TouchableOpacity  
            style={{backgroundColor:color.TURQUOISE,borderRadius:10,
            display: showText ? 'none' : 'flex' }}
            onPress ={()=>{setShow(true)}}>
                <Text style ={{textAlign:'center', padding:10, fontSize:16}}>לחץ לעדכון החלפה</Text>               
        </TouchableOpacity>
        <Modal transparent={true} visible={show}>
            <View style ={{backgroundColor:color.WHITE_GRAY,margin:'10%',padding:30,borderRadius:10,borderColor:color.TURQUOISE1,borderWidth:2}}>
                <Text style={{alignSelf:'center',marginVertical:10,fontSize:20}}>האם בוצעה ההחלפה?</Text>
            <View style={styles.section}>
                <Text style={styles.paragraph}>כן</Text>
                <Checkbox
                style={styles.checkbox}
                value={isChecked}
                onValueChange={Yes}
                color={isChecked ? color.TURQUOISE : undefined}
                />
                <Text style={styles.paragraph}>לא</Text>
                <Checkbox
                style={styles.checkbox}
                value={isCheckedNo}
                onValueChange={No}
                color={isCheckedNo ? color.TURQUOISE : undefined}
                />
            </View>
            <View style ={{display: isChecked ? "flex": "none"}}>
                <RatingStar/>
            <Text style = {{textAlign:'center',marginVertical:5}}>
            {defaultRating + '/' + maxRating.length}
            </Text>
            </View>
            <View style = {{ alignItems:'center',}}>
            <TouchableOpacity  style={styles.userBtn} onPress={match}>
            <Text style={styles.userBtnTxt}>סגירה</Text></TouchableOpacity>
            </View>
            </View>
        </Modal>
    </View>
)}

//make this component available to the app
export default Matching;

//define styling
const styles = StyleSheet.create({
    
      ratingStarStyle:{
        justifyContent:'center',
        // flexDirection:'row-reverse',
        marginTop:20,
        marginBottom:10,
        ...Platform.select({
          ios: {
            flexDirection: 'row',
          },
        android: {
          flexDirection: 'row-reverse',
        }}),
      },
      starImageStyle:{
        width:30,
        height:30,
        resizeMode:'cover',
      },
      section: {
        // flexDirection: 'row-reverse',
        alignItems: 'center',
        alignSelf:'center',
        ...Platform.select({
            ios: {
              flexDirection: 'row-reverse',
            },
          android: {
            flexDirection: 'row',
          }}),
      },
      paragraph: {
        fontSize: 18,
      },
      checkbox: {
        margin: 10,
        
      },
      userBtn: {

        borderColor: color.WHITE_GRAY,
        borderWidth: 2,
        borderRadius: 10,
        paddingVertical: 8,
        marginVertical: 10,
        backgroundColor:color.TURQUOISE,
        width:'50%', 
        alignItems:'center',
        justifyContent:'center',
        alignContent:'center',
        
      },
      userBtnTxt: {
        color: color.WHITE_GRAY,
        fontSize:16,
      },
    }) 








