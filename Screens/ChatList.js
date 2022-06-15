import { 
    View, 
    StyleSheet,
    FlatList, 
    TextInput,
    StatusBar,
} from 'react-native';
import {Icon} from 'react-native-elements'
import {color} from '../utils';
import {auth, db,} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'
import uuid from 'react-native-uuid';
import {ListItem, Avatar} from 'react-native-elements';

const ChatList = ({navigation}) => {
 
    //state we need to chat list 
    const [search, setSearch] = useState('');
    const [filteredDataSource, setFilteredDataSource] = useState([]);//for search
    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState([]);
    const [chatList, setchatList] = useState([]);
    const [ spinner, setSpinner ] = useState(true);
    const [show, setShow] = useState(false);

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
            getChatlist()
            setchatList(newData);
            setSearch(text);
          } 
          else {
            // Inserted text is blank
            // Update data with FilteredDataSource
            getChatlist()
            setchatList(filteredDataSource);
            setSearch(text);
          }
      };

    const getData = () => { //get from firebase data we need for chat
        const userid = auth.currentUser.uid;
        var type
        db.ref(`users/`+userid).once('value', function (snapshot) {
          type =  (snapshot.val().type);
          setDataUser({'type':(snapshot.val().type),'key':userid,'name': (snapshot.val().userName),'email': (snapshot.val().email),'image':(snapshot.val().image), 'phone':(snapshot.val().phone),'expoPush':snapshot.val().expoPushToken})
        
        });

        db.ref(`users/`).on('value',  (snapshot) =>{
            var users =[]
            snapshot.forEach((child)=>{
                if(type !== child.val().type){ 
                        users.push({
                          type:child.val().type,
                          key:child.key,
                          name:child.val().userName,
                          email: child.val().email,
                          image:child.val().image,
                          expoPush:child.val().expoPushToken,
                          phone: child.val().phone

                       })
                       setData(users)
                   }
              })
             
        })
     
    };
    
  const createChatList = (data) => { //create chat list to user with all user from the other type by their id  
    db.ref('/chatlist/' + dataUser.key + '/' + data.key)
      .once('value')
      .then(snapshot => {

        if (snapshot.val() == null) {
          let roomId = uuid.v4();
          let myData = {
              key: dataUser.key,
              name: dataUser.name,
              image:  dataUser.image
              ? dataUser.image ||
              dataUser.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
              phone: dataUser.phone,
              lastMsg: '',
              expoPush:dataUser.expoPush,
              roomId,
          };
          
          db.ref('/chatlist/' + data.key + '/' + dataUser.key)
            .update(myData)
            .then(() => console.log('Data updated.'));

          data.roomId = roomId;
          db.ref('/chatlist/' + dataUser.key + '/' + data.key)
            .update({
              key: data.key,
              name:data.name,
              image: data.image
              ? data.image ||
              data.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
              phone:data.phone,
              lastMsg:'',
              expoPush:data.expoPush,
              roomId: roomId,
            })
            .then(() => console.log('Data updated.'));
            
        }
        //if detail of user updated so update in firebase too
        let updateData = {
            name: dataUser.name,
            image:  dataUser.image
            ? dataUser.image ||
            dataUser.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
            phone: dataUser.phone,
            expoPush:dataUser.expoPush,
        };
        
        db.ref('/chatlist/' + data.key + '/' + dataUser.key)
          .update(updateData)
          .then(() => console.log('Data updated.'));

        db.ref('/chatlist/' + dataUser.key + '/' + data.key)
        .update({
            name:data.name,
            image: data.image
            ? data.image ||
            data.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
            phone:data.phone,
            expoPush:data.expoPush,
        })

      });
    };

    useEffect(() => {
        getData()
        setTimeout(() => {       
          setSpinner(false)}, 1000)

    }, [])
    
    const getChatlist = async () => { //get chat list from firebase by userid
    db.ref('/chatlist/'+dataUser?.key)
    .on('value', snapshot => {
        if (snapshot.val() != null) {
        setchatList(Object.values(snapshot.val()))
        setFilteredDataSource(Object.values(snapshot.val()))
        }
    });
    }
 
    const renderItemNotShow = ({item}) => (
        <View>
        {createChatList(item)} 
        </View>
    );
    const renderItemShow = ({item}) => ( //show items - image + name + last message
        <ListItem 
            topDivider
            bottomDivider 
            activeOpacity={1}
            containerStyle={{padding:8,marginHorizontal:5,backgroundColor:color.WHITE_GRAY,direction:'rtl',width:'100%',}}
            onPress={()=>navigation.navigate("צ'אט פרטי",{receiverData:item,roomId:item.roomId, dataUser:dataUser,expoPush:item.expoPush})}>
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
       <View  style = {{display: show ? "flex": "none"}}>
        <FlatList
            showsVerticalScrollIndicator={false}
            keyExtractor = {(item)=>item.key}
            data={data}
            style={{width:'100%',margin:10,alignSelf:'center'}}
            renderItem={renderItemNotShow}/>
       </View>
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
        style={{width:'100%',margin:10,alignSelf:'center'}}
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