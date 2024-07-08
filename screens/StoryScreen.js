import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  Dimensions,
   Alert,
   Clipboard
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Speech from 'expo-speech';
import { FlatList } from 'react-native-gesture-handler';
import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import firebase from 'firebase'
import db from '../config'

let customFonts = {
  'Bubblegum-Sans': require('../assets/fonts/BubblegumSans-Regular.ttf'),
};

export default class c extends Component {
  constructor() {
    super();
    this.state = {
      fontsLoaded: false,
      speakerColor: 'gray',
      speakerIcon: 'volume-high-outline',
      final_data:[],
      light_theme:'',
    like:0
    };
  }

  async _loadFontsAsync() {
    await Font.loadAsync(customFonts);
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this._loadFontsAsync();
    this.fetchUser(),
    this.db1()
    
  }
   async fetchUser() {
    let theme;
    await firebase
      .database()
      .ref('/users/' + firebase.auth().currentUser.uid)
      .on('value', function (snapshot) {
        theme = snapshot.val().current_theme;
      });
    this.setState({
      light_theme: theme === 'light',
    });
  }

  db1 = async () => {
    //console.log('check db');
    var all_data = [];

    var bkresponse;
    const snapshot = await  db.collection('Data').get();
  
    snapshot.docs.map((doc) => {
      bkresponse = doc.data();
      all_data.push(bkresponse);
    });
    this.setState({ final_data: all_data});
    console.log(all_data);
  };
 


  render() {
    if (!this.state.fontsLoaded) {
      return <AppLoading />;
    } else {
      const Data = this.state.final_data
      return (
        <View style={this.state.light_theme ? styles.container2 : styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <View style={styles.appTitle}>
            <View style={styles.appIcon}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.iconImage}></Image>
            </View>
            <View style={styles.appTitleTextContainer}>
              <Text style={this.state.light_theme ? styles.appTitleText2 : styles.appTitleText}>Storytelling App</Text>
            </View>
          </View>
          <View style={styles.storyContainer}>
            <ScrollView style={this.state.light_theme ? styles.storyCard2 : styles.storyCard}>
            <FlatList
              data={Data}
              renderItem={({ item }) => {
                return(
                  <View>
              <Image
                source={{uri : item.image}}
                style={styles.image}></Image>

              <View style={styles.dataContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style={this.state.light_theme ? styles.storyTitleText2 : styles.storyTitleText}>
                    {item.title}
                  </Text>
                  <Text style={this.state.light_theme ? styles.storyAuthorText2 : styles.storyAuthorText}>
                    {item.name}
                  </Text>
                 
                </View>
                <View style={styles.iconContainer}>
                  <TouchableOpacity
                    onPress={() => {
                      const current_color = this.state.speakerColor;
                      this.setState({
                        speakerColor:
                          current_color === 'gray' ? '#ee8249' : 'gray',
                      });
                      if (current_color === 'gray') {
                        Speech.speak(`${item.title} by ${item.name}`);
                        Speech.speak(item.story);
                        Speech.speak('The moral of the story is!');
                        Speech.speak(item.moral);
                      } else {
                        Speech.stop();
                      }
                    }}>
                    <Ionicons
                      name={this.state.speakerIcon}
                      size={RFValue(30)}
                      color={this.state.speakerColor}
                      style={{ margin: RFValue(15) }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.storyTextContainer}>
                <Text style={this.state.light_theme ? styles.storyText2 : styles.storyText}>
                  {item.story}
                </Text>
                <Text style={styles.moralText}>
                  Moral - { item.moral}
                </Text>
                 <Text style={this.state.light_theme ? styles.date2 : styles.date}>
                    {item.date}
                  </Text>
                  <Text style={this.state.light_theme ? styles.date2 : styles.date}>
                    {item.time}
                  </Text>
              </View>
              <View style={styles.actionContainer}>
                <View style={{ flexDirection: 'row' }}>
                      <TouchableOpacity
                        onPress={
                          like = async () => {
                          this.setState({ like: this.state.like + 1 })
                            var snapshot = await db
                              .collection('Data')
                              .limit(100)
                              .where('name', '==', item.name)
                              .get();
                            const doc = snapshot.docs[0];
                            doc.ref.update({
                              like: this.state.like,
                            });
                          }
                        }>
                        <Image
                          source={{
                            uri:
                              item.like === 1
                                ? 'https://o.remove.bg/downloads/6fa10b7a-fc5c-4527-bb03-b74f59a55ad8/132-1324942_green-like-png-removebg-preview.png'
                                : 'https://o.remove.bg/downloads/ec0c3612-75e3-441e-bf85-548b86cd2e5b/like-button-social-media-image-facebook-messenger-png-favpng-YkquKiF4ePG3tMC0eT3hxUfgS-removebg-preview-removebg-preview.png',
                          }}
                          style={{ width: 50, height: 50, marginLeft: 50 }}
                        />
                      </TouchableOpacity>
                      <Text
                        style={
                          this.state.light_theme ? styles.des2 : styles.des
                        }>
                        {item.like}
                      </Text>
                      <TouchableOpacity onPress={()=>{ Alert.alert('link of app was copied to clipboard'),Clipboard.setString('https://snack.expo.dev/@hardik.123/story-telling-app-hardik-5')}}>
                        <Image
                          source={require('../png-transparent-computer-icons-share-icon-font-awesome-search-button-miscellaneous-angle-hand-removebg-preview.png')}
                          style={{ width: 50, height: 50, marginLeft: 80 }}
                        />
                      </TouchableOpacity>
                    </View>
              </View>
              </View>
              )}} />
            </ScrollView>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#15193c',
  },
  container2: {
    flex: 1,
    backgroundColor: 'white',
  },
  droidSafeArea: {
    marginTop:
      Platform.OS === 'android' ? StatusBar.currentHeight : RFValue(35),
  },
  appTitle: {
    flex: 0.07,
    flexDirection: 'row',
  },
  appIcon: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  appTitleTextContainer: {
    flex: 0.7,
    justifyContent: 'center',
  },
  appTitleText: {
    color: 'white',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  appTitleText2: {
    color: 'black',
    fontSize: RFValue(28),
    fontFamily: 'Bubblegum-Sans',
  },
  storyContainer: {
    flex: 1,
  },
  storyCard: {
    margin: RFValue(20),
    backgroundColor: '#2f345d',
    borderRadius: RFValue(20),
  },
  storyCard2: {
    margin: RFValue(20),
    backgroundColor: 'white',
    borderRadius: RFValue(20),
  },
  image: {
    width: '100%',
    alignSelf: 'center',
    height: RFValue(200),
    borderTopLeftRadius: RFValue(20),
    borderTopRightRadius: RFValue(20),
    resizeMode: 'contain',
  },
  dataContainer: {
    flexDirection: 'row',
    padding: RFValue(20),
  },
  titleTextContainer: {
    flex: 0.8,
  },
  storyTitleText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'white',
  },
  storyTitleText2: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(25),
    color: 'black',
  },
  storyAuthorText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'white',
  },
  storyAuthorText2: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(18),
    color: 'black',
  },
  iconContainer: {
    flex: 0.2,
  },
  storyTextContainer: {
    padding: RFValue(20),
  },
  storyText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(15),
    color: 'white',
  },
  storyText2: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(15),
    color: 'black',
  },
  moralText: {
    fontFamily: 'Bubblegum-Sans',
    fontSize: RFValue(20),
    color: 'white',
  },
  actionContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: RFValue(10),
  },
  des: {
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Bubblegum-Sans',
    color: 'white',
    margin: 2,
  },
  des2: {
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: 'Bubblegum-Sans',
    color: 'Black',
    margin: 2,
  },
  date: {
   color:'white',
       fontFamily: 'Bubblegum-Sans',
       fontSize: RFValue(15),
        
  },
  date2: {
   color:'Black',
       fontFamily: 'Bubblegum-Sans',
       fontSize: RFValue(15),
       
  }
});
//title//
//story//
//author//
//date//
