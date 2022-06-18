import { 
    View, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    TouchableWithoutFeedback,
    FlatList, 
    TextInput,
} from 'react-native';
import {Icon} from 'react-native-elements'
import {color} from '../utils';
import {auth, db,} from '../FirebaseConfig';
import React, { useState, useEffect } from 'react'
import {getPreciseDistance } from 'geolib';

const SearchUser = ({navigation}) => {

  const [search, setSearch] = useState('');
  const [filteredDataSource, setFilteredDataSource] = useState([]); //for search
  const [data, setData] = useState([]);
  const [dataUser, setDataUser] = useState([]);
  const [ spinner, setSpinner ] = useState(true);
 
  useEffect(() => {
    getData()
    setTimeout(() => {       
      setSpinner(false)}, 1000)

  }, [])
  
  const searchFilterFunction = (text) => {  //handler function to search name and typefood 
    if (text) {
          const newData = filteredDataSource.filter(
            function (item) {
              const itemData = item.name
                ? item.name.toUpperCase()
                : ''.toUpperCase();
              const textData = text.toUpperCase();
              const arr =[]
              item.food.map((food) => {
                if (food.indexOf(text.toLowerCase()) >= 0){
                    return (item)
                }
              })
              for (var i=0; i < item.food.length; i++) {
                if(item.food[i].includes(text)){
                    return(item.food[i].includes(text))
                }
              }
                return (itemData.indexOf(textData) > -1)
          });
      setData(newData);
      setSearch(text);
    } 
    else {
      // Inserted text is blank
      // Update data with FilteredDataSource
      setData(filteredDataSource);
      setSearch(text);
    }
  };

    
  const getData = () => { //get data from firebase - take data of current user and all users that in different type from current user
      const userid = auth.currentUser.uid;
      var type,latitudeTemp,longitudeTemp
      db.ref(`users/`+userid).once('value', function (snapshot) {
        type =  (snapshot.val().type);
        //get latitude and longitude from current user to calculate the distance in km between him and the other users
        latitudeTemp = snapshot.val().Form.latitude 
        longitudeTemp = snapshot.val().Form.longitude
        setDataUser({'type':(snapshot.val().type),'key':userid,'name': (snapshot.val().userName),'email': (snapshot.val().email),'image':(snapshot.val().image), 'phone':(snapshot.val().phone)})
      
      });

      db.ref(`users/`).on('value',  (snapshot) =>{
          var users =[]
          snapshot.forEach((child)=>{
              if(type === 'giver'){ 
                if(child.val().type =="getter"){
                var pdis = getPreciseDistance(
                  { latitude:latitudeTemp, longitude: longitudeTemp },
                  { latitude: child.val().Form.latitude, longitude:child.val().Form.longitude }
                );
                
                      users.push({
                        image:child.val().image,
                        key:child.key,
                        type:"נתרם",
                        pdis:pdis,
                        expoPush:child.val().expoPushToken,
                        name:child.val().userName,
                        food: child.val().Form.typeFood,
                        tags: child.val().Form.tags,
                        catogary: child.val().Form.catogary,
                        other:child.val().Form.other,
                        number: child.val().Form.numberPeople,
                        latitudeUser:latitudeTemp,
                        longitudeUser:longitudeTemp,
                        latitude: child.val().Form.latitude,
                        longitude: child.val().Form.longitude,
                        Time: child.val().Form.Time,
                        TimePick: child.val().Form.timePick,
                        phone: child.val().phone

                      })
                      setData(users)
                      setFilteredDataSource(users)
                  }
            }
              else{
                  if(child.val().type == "giver"){
                    var pdis1 = getPreciseDistance(
                      { latitude:latitudeTemp, longitude: longitudeTemp },
                      { latitude: child.val().Form.latitude, longitude:child.val().Form.longitude }
                    );
                      
                      users.push({
                        image:child.val().image,
                        key:child.key,
                        type:"תורם",
                        pdis:pdis1,
                        expoPush:child.val().expoPushToken,
                        name:child.val().userName,
                        food: child.val().Form.typeFood,
                        tags: child.val().Form.tags,
                        catogary: child.val().Form.catogary,
                        other:child.val().Form.other,
                        amount:child.val().Form.amount,
                        phone: child.val().phone,
                        latitudeUser:latitudeTemp,
                        longitudeUser:longitudeTemp,
                        latitude: child.val().Form.latitude,
                        longitude: child.val().Form.longitude,
                        Time: child.val().Form.Time,
                        TimePick: child.val().Form.timePick,

                      })
                      setData(users)
                      setFilteredDataSource(users)

              }}
          })

      })
          
  };
    
  const goChat = (data) => { // get roomid of each user and current user and navigate to single chat
    
    db.ref('/chatlist/' + dataUser.key + '/' + data.key)
      .once('value')
      .then(snapshot => {
         navigation.navigate("צ'אט פרטי", {receiverData: data, roomId:snapshot.val().roomId,dataUser:dataUser,expoPush:data.expoPush});
      });
  };
  
  const  renderSeparator = () => { //seperator between each item
    return (
      <View
        style={{
          height: 2,
          width: '90%',
          backgroundColor: color.BLACK,
          marginLeft: '5%',
        }}
      />
    )
  }
   
  const renderItem = (({ item } ) => (  // how shows items - image+typeFood+ Chat, and pass params to showProfiles screen
    <View>
      <TouchableWithoutFeedback onPress={() =>{navigation.navigate('הצגת פרופיל',{
          itemId: item.key,
          itemName: item.name,
          itemImage: item.image ? item.image || item.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png",
          itemTags : item.tags,
          itemCatogary : item.catogary,
          itemOther:item.other,
          itemType : item.type,
          itemFood: item.food,
          itemAmount: item.amount,
          itemNumber: item.number,
          itemTime: item.Time,
          itemPickTime: item.TimePick,
          itemPhone: item.phone,
          itemExpoPush: item.expoPush,
          itemLatitude: item.latitude,
          itemLongitude: item.longitude,
          itemLatitudeUser: item.latitudeUser,
          itemLongitudeUser: item.longitudeUser,
          nameCurrentUser: dataUser.name,
        });}}>
      <View style ={{width:'100%', padding:10,alignItems:'center',justifyContent:'center'}}>
          <Image
          source={{
            uri: item.image
              ? item.image ||
              item.image : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"

          }}
          style={{height: 80, width: 80,borderRadius: 50}}>
        </Image> 
        <Text style={{color:color.BLACK,fontSize:18,fontWeight:'bold',textAlign:'center',margin:3}}> 
            {item.name}          
        </Text>
        <Text style={{color:color.BLACK,fontSize:16,backgroundColor:color.TURQUOISE2}}>למעבר לפרופיל</Text>
        <Text style={{color:color.BLACK,fontSize:16,}}>
            {item.pdis / 1000} ק"מ
        </Text> 
        {item.food.map((food) => {
            return(
            <View>
                <Text style={{color:color.BLACK,fontSize:16,}}>{food} </Text>   
            </View>
          )
        })}
      </View>
      </TouchableWithoutFeedback>
      <TouchableOpacity style={styles.userBtn} onPress={() => goChat(item)}>
              <Text style={styles.userBtnTxt}>לצ'אט</Text>
      </TouchableOpacity >
    </View>
  ))
  
  return (
    <View style ={styles.container}>
      <View style={styles.inputContainer2}>
        <TextInput
        style={styles.textInputStyle}
        // autoFocus={true}
        onChangeText={(text) => searchFilterFunction(text)}
        value={search}
        autoCapitalize="none"
        autoCorrect={false}
        placeholder={'חיפוש'}
        placeholderTextColor={'#666'} 
        />
        <Icon
            type = "material"
            name = "search"
            color = "#009387"
            size = {30}
        />
      </View>
      <FlatList
      data={data}
      extraData={data.sort((a, b) => a.pdis - b.pdis)}
      style={{width:'90%',margin:10,}}
      renderItem = {renderItem}
      ListEmptyComponent={
        <Text style={{ fontWeight: 'bold' , fontSize:25,textAlign:'center'}}> לא נמצאו משתמשים מתאימים לחיפוש זה</Text>
      }
      keyExtractor = {(item)=>item.key}
      ItemSeparatorComponent = {renderSeparator}/>   
    </View>
  );
};

//make this component available to the app
export default SearchUser;

//define styling
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: color.WHITE_GRAY,
      alignItems: 'center',
      justifyContent:'center',
      alignContent:'center',
      paddingTop: 55, 
    },
  inputContainer2: {
    backgroundColor: color.WHITE,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
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
  userBtn: {
    borderColor: color.WHITE_GRAY,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 8,
    marginBottom: 5,
    backgroundColor:color.TURQUOISE,
    width:'90%', 
    alignSelf:'center',
    alignItems:'center',

  },
  userBtnTxt: {
    color: color.WHITE_GRAY,
    fontSize:16,
  },
}) 