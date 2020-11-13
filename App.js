/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {addLaunch, getLaunches} from './src/services/api';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';

const SCREENS = {
  LAUNCH_LIST: 'LAUNCH_LIST', //DEFAULT SCREEN
  CREATE_LAUNCH_SCREEN: 'CREATE_LAUNCH_SCREEN',
  LAUNCH_DETAIL_SCREEN: 'LAUNCH_DETAIL_SCREEN',
};

const App: () => React$Node = () => {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.LAUNCH_LIST);
  const [launches, setLaunches] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedLaunch, setSelectedLaunch] = useState();

  //create launch screen state
  const [launchName, setLaunchName] = useState('');
  const [launchDescription, setLaunchDescription] = useState('');
  const [missionPatch, setMissionPatch] = useState();

  useEffect(() => {
    getLaunches(pageNumber - 1).then((result) => {
      setLaunches(result);
    });
  }, []);

  const navigation = (screen) => {
    switch (screen) {
      case SCREENS.LAUNCH_LIST:
        return renderLaunchListScreen();
      case SCREENS.LAUNCH_DETAIL_SCREEN:
        return renderLaunchDetailsScreen(selectedLaunch);
      case SCREENS.CREATE_LAUNCH_SCREEN:
        return renderCreateLaunchScreen();
      default:
        return renderLaunchListScreen();
    }
  };

  const renderLaunchListScreen = () => {
    const renderLaunchListItem = ({item, index}) => {
      return (
        <Pressable
          style={styles.launchListItemContainer}
          onPress={() => {
            setCurrentScreen(SCREENS.LAUNCH_DETAIL_SCREEN);
            setSelectedLaunch(item);
          }}
          key={item.flight_number}>
          <Image
            style={{height: 100, width: 100}}
            source={{uri: item.links.mission_patch_small}}
          />
          <Text>{item.mission_name}</Text>
        </Pressable>
      );
    };

    const renderFAB = () => {
      return (
        <TouchableOpacity
          style={{
            backgroundColor: '#6d6d6d',
            width: 70,
            height: 70,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 23,
            position: 'absolute',
            bottom: 30,
            right: 50,
          }}
          onPress={() => {
            setCurrentScreen(SCREENS.CREATE_LAUNCH_SCREEN);
          }}>
          <Text style={{color: '#ffffff', fontWeight: '700', fontSize: 34}}>
            +
          </Text>
        </TouchableOpacity>
      );
    };

    const renderPagination = () => {
      let pageNumbers = [1, 2, 3, 4, 5];
      return (
        <View style={{justifyContent: 'center', flexDirection: 'row'}}>
          {pageNumbers.map((pgNo) => {
            return (
              <Text
                key={pgNo}
                onPress={() => {
                  setPageNumber(pgNo);
                  getLaunches(pgNo - 1).then((res) => {
                    setLaunches(res);
                  });
                }}
                style={{
                  fontSize: 17,
                  margin: 4,
                  color: pgNo === pageNumber ? 'blue' : 'black',
                }}>
                {pgNo}
              </Text>
            );
          })}
        </View>
      );
    };

    return (
      <>
        <FlatList
          style={styles.launchListContainer}
          data={launches}
          renderItem={renderLaunchListItem}
          keyExtractor={(item) => item.flight_number.toString()}
          scrollEnabled={false}
        />
        {renderFAB()}
        {renderPagination()}
      </>
    );
  };

  const renderLaunchDetailsScreen = (launch) => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ImageBackground
          source={{uri: launch.links.mission_patch}}
          style={{
            flex: 0.6,
            resizeMode: 'contain',
            justifyContent: 'flex-end',
          }}>
          <Text
            style={{
              color: 'black',
              fontSize: 32,
              fontWeight: '500',
              alignSelf: 'flex-end',
              marginBottom: 100,
              // paddingTop: 130,
            }}>
            {launch.mission_name}
          </Text>
        </ImageBackground>
        {renderBackButton()}
      </View>
    );
  };

  const renderCreateLaunchScreen = () => {
    const handleUploadImage = () => {
      //STUB as handled by a open source library
    };

    const handleSubmitLaunch = async () => {
      if ((launchName, launchDescription)) {
        const model = {
          mission_name: launchName,
          description: launchDescription,
          mission_patch: missionPatch,
        };
        const res = await addLaunch(model);
        if (res?.status === 200) {
          Alert.alert(
            'Launch Created',
            'Successfully created a launch',
            [
              {
                text: 'OK',
                onPress: () => {
                  setLaunchName('');
                  setLaunchDescription('');
                  setCurrentScreen();
                },
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert('Error Creating Launch', {cancelable: false});
        }
      } else {
        Alert.alert(
          'Invalid launch details',
          'Name and description cannot be empty',
          {cancelable: false},
        );
      }
    };

    return (
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <View>
          <TouchableOpacity
            style={{
              marginTop: 40,
              height: 150,
              width: 150,
              backgroundColor: '#cfcfcf',
              alignSelf: 'center',
            }}
            onPress={handleUploadImage}
          />
          <Text style={{alignSelf: 'center'}} onPress={handleUploadImage}>
            Click to add
          </Text>
        </View>
        <View style={{marginHorizontal: 20}}>
          <TextInput
            placeholder={'Name...'}
            value={launchName}
            onChangeText={setLaunchName}
          />
          <TextInput
            placeholder={'Description...'}
            value={launchDescription}
            onChangeText={setLaunchDescription}
          />
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {renderBackButton()}
          <TouchableOpacity
            onPress={handleSubmitLaunch}
            style={{
              width: 120,
              backgroundColor: '#d4d4d4',
              alignItems: 'center',
            }}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderBackButton = () => {
    return (
      <Text
        style={{marginLeft: 20}}
        onPress={() => {
          setCurrentScreen();
        }}>
        {'< Back'}
      </Text>
    );
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{flex: 1}}>{navigation(currentScreen)}</SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  launchListItemContainer: {
    flexDirection: 'row',
    flex: 1,
    margin: 10,
  },
  launchListContainer: {
    height: '100%',
  },
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
