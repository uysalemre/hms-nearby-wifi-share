import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  NativeEventEmitter,
  ToastAndroid,
  Image,
  Alert,
  PermissionsAndroid
} from 'react-native';
import { styles } from './Styles';
import { HMSWifiShare, HMSApplication } from '@hmscore/react-native-hms-nearby';

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isWifiShareStarted: false,
      tintColor: 'black',
      endpointId: ''
    };
  }

  componentDidMount() {
    this.requestPermissions();

    this.eventEmitter = new NativeEventEmitter(HMSWifiShare);

    this.eventEmitter.addListener(HMSWifiShare.WIFI_ON_FOUND, (event) => {
      this.setState({ endpointId: event.endpointId });
      Alert.alert(
        "Wifi Requester Found",
        "Do you want to share wifi with requester ?",
        [
          {
            text: "NO",
            onPress: () => { this.stopWifiShare(); }
          },
          {
            text: "YES",
            onPress: () => { this.shareWifiConfig(); }
          }
        ],
        { cancelable: false }
      );
    });

    this.eventEmitter.addListener(HMSWifiShare.WIFI_ON_LOST, (event) => {
      this.setState({ endpointId: '' });
      ToastAndroid.show("Wifi Lost", ToastAndroid.SHORT);
    });

    this.eventEmitter.addListener(HMSWifiShare.WIFI_ON_FETCH_AUTH_CODE, (event) => {
      this.setState({ endpointId: event.endpointId });
      Alert.alert(
        "Verification",
        "Verify auth codes with the other phone. Code :" + event.authCode,
        [
          {
            text: "OK",
            onPress: () => null
          }
        ],
        { cancelable: false }
      )
    });

    this.eventEmitter.addListener(HMSWifiShare.WIFI_ON_RESULT, (event) => {
      if (event.statusCode == HMSApplication.SUCCESS) {
        ToastAndroid.show("Connection Established", ToastAndroid.SHORT);
      }
      else {
        ToastAndroid.show("Connection Failed", ToastAndroid.SHORT);
      }
      this.stopWifiShare();
    });
  }

  componentWillUnmount() {
    this.eventEmitter.removeAllListeners(HMSWifiShare.WIFI_ON_FOUND);
    this.eventEmitter.removeAllListeners(HMSWifiShare.WIFI_ON_LOST);
    this.eventEmitter.removeAllListeners(HMSWifiShare.WIFI_ON_FETCH_AUTH_CODE);
    this.eventEmitter.removeAllListeners(HMSWifiShare.WIFI_ON_RESULT);
  }

  async requestPermissions() {
    try {
      const userResponse = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]
      );
      if (
        userResponse["android.permission.ACCESS_FINE_LOCATION"] == PermissionsAndroid.RESULTS.DENIED ||
        userResponse["android.permission.ACCESS_FINE_LOCATION"] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        userResponse["android.permission.READ_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.DENIED ||
        userResponse["android.permission.READ_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        userResponse["android.permission.WRITE_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ||
        userResponse["android.permission.WRITE_EXTERNAL_STORAGE"] == PermissionsAndroid.RESULTS.DENIED
      ) {
        ToastAndroid.show("Please provide permissions to use this app", ToastAndroid.SHORT);
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  async startWifiShare(isShare) {
    try {
      var result = await HMSWifiShare.startWifiShare(isShare ? HMSWifiShare.SET : HMSWifiShare.SHARE);
      if (result.status == HMSApplication.SUCCESS) {
        ToastAndroid.show(isShare ? "Searching for a Wifi ..." : "Sharing Wifi ...", ToastAndroid.SHORT);
        this.setState({ isWifiShareStarted: true, tintColor: 'green' });
      }
      else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
        this.stopWifiShare()
          .then(() => { this.setState({ isWifiShareStarted: false, tintColor: 'black' }) });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async stopWifiShare() {
    try {
      var result = await HMSWifiShare.stopWifiShare();
      if (result.status == HMSApplication.SUCCESS) {
        ToastAndroid.show("Wifi share stopped", ToastAndroid.SHORT);
        this.setState({ isWifiShareStarted: false, tintColor: 'black', endpointId: '' })
      }
      else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async shareWifiConfig() {
    try {
      var result = await HMSWifiShare.shareWifiConfig(this.state.endpointId);
      if (result.status == HMSApplication.SUCCESS) {
        ToastAndroid.show("Wifi shared", ToastAndroid.SHORT);
      }
      else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT);
      }
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    return (
      <View style={styles.baseViewStyle}>
        <View style={styles.actionSelectionStyle}>
          <Text style={styles.textStyleHeader}>Nearby Wifi Share </Text>
          <View style={styles.operationSelectionStyle}>
            <TouchableOpacity
              style={styles.actionButtonStyle}
              onPress={() => { this.startWifiShare(true) }}
              disabled={this.state.isWifiShareStarted}>
              <Text style={styles.textStyle}>REQUEST</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionButtonStyle}
              onPress={() => { this.startWifiShare(false) }}
              disabled={this.state.isWifiShareStarted}>
              <Text style={styles.textStyle}>SHARE</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => { this.stopWifiShare() }}
            disabled={!this.state.isWifiShareStarted}>
            <Image
              style={{ ...styles.imageStyle, ...{ tintColor: this.state.tintColor } }}
              source={require('./images/ic_wifi.png')} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
