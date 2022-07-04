import { 
    View, 
    StyleSheet,
    FlatList, 
    TextInput,
    StatusBar,Text
} from 'react-native';
import {Icon} from 'react-native-elements'
import {color} from '../utils';
import {auth, db,} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'
import uuid from 'react-native-uuid';
import {ListItem, Avatar} from 'react-native-elements';

const ChatList = ({navigation,route}) => {
 
    //state we need to chat list 

    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);//for search
    const [chatList, setchatList] = useState([]);

    const searchFilterFunction = (text) => { //handler function to search names users in chat + get chat list
      
        if (text) {
            const newData = filteredDataSource.filter(
              function (item) {
                const itemData = item.name
                  ? item.name.toUpperCase()
                  : ''.toUpperCase();
                const textData = text.toUpperCase();
               
                 return (itemData.indexOf(textData) > -1)
            });
            // getChatlist()
            setchatList(newData);
            setSearch(text);
          } 
          else {
            // Inserted text is blank
            // Update data with FilteredDataSource
            // getChatlist()
            setchatList(filteredDataSource);
            setSearch(text);
          }
      };

    useEffect(() => {
      let unmounted = false
      setTimeout(()=>{
        console.log("data loaded for page" )
        if(!unmounted){
          getChatlist()
          console.log(chatList)
        }},1000)
      return()=>{
        unmounted = true
      }
    }, [])
    
    const getChatlist = async () => { //get chat list from firebase by userid
    db.ref('/chatlist/'+route.params.key)
    .on('value', snapshot => {
        if (snapshot.val() != null) {
        setchatList(Object.values(snapshot.val()))
        setFilteredDataSource(Object.values(snapshot.val()))
        }
    });
    }
 
    const renderItemShow = ({item}) => ( //show items - image + name + last message
        <ListItem 
            topDivider
            bottomDivider 
            activeOpacity={1}
            containerStyle={{padding:8,marginHorizontal:5,backgroundColor:color.WHITE_GRAY,direction:'rtl',width:'100%',}}
            onPress={()=>navigation.navigate("צ'אט פרטי",{receiverData:item,roomId:item.roomId, dataUser:route.params,expoPush:item.expoPush})}>
            <View style ={{flexDirection:'row', alignItems:'center',maxWidth:"90%"}}>
                <Avatar 
                source={{uri: item.image}} 
                rounded
                titleStyle={{color:color.BLACK}}
                size="medium" />
                <View style ={{flexDirection:'column',}}>
                    <ListItem.Title style={{fontSize:14,  writingDirection:'rtl',marginHorizontal:10,marginVertical:5}}>
                        {item.name}
                    </ListItem.Title>
                    <ListItem.Subtitle 
                    style={{fontSize:12,marginHorizontal:10,writingDirection:'rtl',marginBottom:5}}  numberOfLines={1}>
                        {item.lastMsg}
                    </ListItem.Subtitle> 
                </View>
            </View>
        </ListItem>
    );
  return (
    <View style={styles.container}>
    <StatusBar barStyle="dark-content" backgroundColor={color.TURQUOISE} /> 
        <View style={styles.inputContainer2}>
            <TextInput
            style={styles.textInputStyle}
            autoFocus={true}
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
            autoCapitalize="none"
            autoCorrect={false}
            onFocus={getChatlist}
            placeholder={"חיפוש"}
            placeholderTextColor={'#666'} 
            />
            <Icon
            type = "material"
            name = "search"
            color = "#009387"
            size = {30}/>
        </View>
       <FlatList
        showsVerticalScrollIndicator={false}
        keyExtractor = {(item)=>item.key}
        data={chatList}
        ListEmptyComponent={
          <Text style={{ fontWeight: 'bold' , fontSize:22,textAlign:'center'}}> לא נמצאו משתמשים מתאימים לחיפוש זה</Text>
        }        style={{width:'100%',marginHorizontal:10,marginTop:10,alignSelf:'center'}}
        renderItem={renderItemShow}
        />
    </View>
  );
};

//make this component available to the app
export default ChatList;

//define styling
const styles = StyleSheet.create({
  container: {
        flex: 1,
        backgroundColor: color.WHITE_GRAY,
        paddingTop: '15%', 
    },
  inputContainer2: {
    backgroundColor: color.WHITE,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf:'center',
    borderWidth: 2,
    borderColor: color.BORDER,
    position: 'absolute', 
    top: 10, 
    width: '90%' ,
  },
  textInputStyle: { 
    borderRadius: 10,
    padding: 10,
    color: '#000',
    backgroundColor: '#FFF',
    width:'90%',
    textAlign:'right', 
    fontSize: 18,   
  },


});