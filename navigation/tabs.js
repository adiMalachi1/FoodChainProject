import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Dashboard from '../Screens/DashboardPage';
import MapUsers from '../Screens/MapUsers';
import SearchUser from '../Screens/SearchUser';
import ChatList from '../Screens/ChatList'
import {Alert,Platform, View,FlatList} from 'react-native';
import {auth,db} from '../FirebaseConfig';
import { color } from '../utils';
import React, { useState, useEffect } from 'react'
import uuid from 'react-native-uuid';

//create tab navigator
const Tab = createBottomTabNavigator();

const Tabs = ({navigation, route} ) =>{
    const {type} = route.params;
    let name
    // screen
    if(type === 'giver'){
      name = 'נתרמים'
    }
    else{
      name = 'תורמים'
    }
    // const [ spinner, setSpinner ] = useState(true);
    const [data, setData] = useState([]);
    const [dataUser, setDataUser] = useState([]);
    const [show, setShow] = useState(false);

    // const [chatList, setchatList] = useState([]);
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
                        expoPush:child.val().expoPushToken?child.val().expoPushToken:"",
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
            expoPush:dataUser.expoPush?dataUser.expoPush:"",
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
            expoPush:data.expoPush?data.expoPush:"",
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
          expoPush:dataUser.expoPush?dataUser.expoPush:"",
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
          expoPush:data.expoPush?data.expoPush:"",
        })

    });
  };

  useEffect(() => {
    let unmounted = false
    setTimeout(()=>{
      console.log("data loaded for page" )
      if(!unmounted){
      getData()
      // createChatList()
    
    }},1000)
  return()=>{
    unmounted = true
  }
  }, [])
   const renderItemNotShow = ({item}) => (
        <View>
        {createChatList(item)} 
        </View>
    );
    return(   

        <Tab.Navigator   
       
            initialRouteName={"איזור אישי"}   
            screenOptions={({ route }) => ({
            headerTitle: route.name,
            headerShown:true,
            headerTitleAlign:'center',
            headerStyle: {
              backgroundColor: color.TURQUOISE,
            },
            headerTintColor: color.WHITE_GRAY,  
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            tabBarHideOnKeyboard: true,
            tabBarActiveTintColor: color.TURQUOISE,
            tabBarInactiveTintColor: color.GRAY,
            tabBarLabelStyle: {
              fontSize: 10
            },
               
            tabBarItemStyle:{
              backgroundColor:'#f1f1f1',
              margin:3,
              borderRadius:10,
            },
          
           
            headerRight: () => (
              
              Platform.OS === 'ios'?
                  // console.log("ios")
                  <View  style = {{display: show ? "flex": "none"}}>

                  <FlatList
                    showsVerticalScrollIndicator={false}
                    keyExtractor = {(item)=>item.key}
                    data={data}
                    style={{width:'100%',margin:10,alignSelf:'center'}}
                    renderItem={renderItemNotShow}/>
             </View> 
                  // <MaterialCommunityIcons name={"arrow-right"} size={26} color={color.WHITE_GRAY} 
                  // style = {{right:10,}}
                  // onPress = {() => navigation.goBack()}
                  //   />
                  :
              <Ionicons
                name='log-out-outline'
                size = {26}
                style = {{right:10}}
                color ={color.WHITE_GRAY}
                onPress = {()=>
                  Alert.alert('יציאה','האם אתה בטוח שאתה רוצה לצאת?',[
                  {
                    text:'כן',
                    onPress: ()=>{ 
                      auth.signOut()
                      .then(() => {
                        navigation.navigate("LoginScreen")
                      })
                      .catch(error => alert(error.message))},
                    
                  },{
                    text:'לא',
                    onPress: ()=>{ 
                      return
                   },
                  }
                  ],
                  )
    
                }/>),
            
            headerLeft:()=>(
              Platform.OS === 'ios'?
              <Ionicons
              name='log-out-outline'
              size = {26}
              style = {{left:10}}
              color ={color.WHITE_GRAY}
              onPress = {()=>
                Alert.alert('יציאה','האם אתה בטוח שאתה רוצה לצאת?',[
                {
                  text: 'לא',
                  onPress: ()=>{ 
                      return
                     
                }},{
                  text: 'כן',
                  onPress: ()=>{ 
                        auth
                        .signOut()
                        .then(() => {
                          navigation.navigate("LoginScreen")
                      })
                      .catch(error => alert(error.message))
                    } 
                  
                }
                ],)}/>
              :
              // console.log("android")
              <View  style = {{display: show ? "flex": "none"}}>

              <FlatList
                showsVerticalScrollIndicator={false}
                keyExtractor = {(item)=>item.key}
                data={data}
                style={{width:'100%',margin:10,alignSelf:'center'}}
                renderItem={renderItemNotShow}/>
         </View> 
            
              // <MaterialCommunityIcons name={"arrow-right"} size={26} color={color.WHITE_GRAY} 
              //   style = {{left:10,}}
              //   onPress = {() => navigation.goBack()}
              //     />
            ),
                 
            
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
                if (route.name === "מפה") {
                  iconName = focused ? 'map' : 'map-outline'; } 
                else if (route.name === name) {
                  iconName = focused ? 'people' : 'people-outline';} 
                else if (route.name === "צ'אט") {
                  iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                }
                else if (route.name === "איזור אישי") {
                  iconName = focused ? 'person' : 'person-outline';
                }
                return <Ionicons name={iconName} size={size} color={color} />;
            },
          })}>

          <Tab.Screen name="מפה" component={MapUsers}  />
          <Tab.Screen name={name} component={SearchUser} />
          <Tab.Screen name="צ'אט" component={ChatList} initialParams={dataUser}/>
          <Tab.Screen name="איזור אישי" component={Dashboard}/>
        </Tab.Navigator>
    );
}  


export default Tabs;

