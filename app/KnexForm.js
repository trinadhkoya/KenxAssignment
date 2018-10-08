import React, {Component} from 'react';
import {ActivityIndicator, Button, NetInfo, PermissionsAndroid, StyleSheet, Text, TextInput, View} from 'react-native';
import {Icon} from 'react-native-elements'

import {connect} from 'react-redux';

import {connectionState, savePerson, saveUserFromOfflineQue} from './actions';
import {getUnixTimestamp, isEmpty} from "./_globals";

class KnexForm extends Component {


    saveUserInfo = (personIndex) => {
        this.props.dispatch(savePerson({
            index: personIndex,
            name: this.state.name,
            latitude: !isEmpty(this.state.latitude) ? this.state.latitude : null,
            longitude: !isEmpty(this.state.longitude) ? this.state.longitude : null,
            time_rec: getUnixTimestamp(),
            time_trans: getUnixTimestamp()
        }));
    };


    _handleConnectionChange = (isConnected) => {
        const {dispatch, actionQueue} = this.props;
        dispatch(connectionState({status: isConnected}));

        if (isConnected && actionQueue.length > 0) {
            actionQueue.forEach((item) => {
                this.props.dispatch(saveUserFromOfflineQue({
                    index: item.index,
                    name: item.name,
                    latitude: item.latitude,
                    longitude: item.longitude,
                    time_rec: item.time_rec,
                    time_trans: item.time_trans
                }))
            })
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            name: null,
            longitude: '', latitude: '', error: null, loading: true
        };
        this.saveUserInfo = this.saveUserInfo.bind(this);
    }

    async requestLocationPermission() {
        try {
            const granted = await
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'Location Permission',
                        'message': 'This app needs access to your location',
                    }
                );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location")
            } else {
                console.log("Location permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    }

    clearState() {
        this.setState({longitude: '', latitude: '', name: '', loading: true});
        this.getLocation();

    }

    componentWillMount() {
        this.requestLocationPermission();
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('change', this._handleConnectionChange);
        this.getLocation();
    }

    getLocation() {
        console.log(navigator);
        this.watchId = navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(position)
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    loading: false
                });
            },
            (error) => this.setState({error: error.message}),

            {enableHighAccuracy: true, timeout: 20000, maximumAge: 100, distanceFilter: 10},
        );
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
        NetInfo.isConnected.removeEventListener('change', this._handleConnectionChange);

    }

    render() {
        const {message, actionQueue, personIndex, isConnected} = this.props;
        const {loading, latitude, longitude} = this.state;


        return (
            <View style={{flex: 1}}>


                <View style={styles.form}>


                    <TextInput
                        style={styles.inputStyle}
                        onChangeText={(name) => this.setState({name})}
                        value={this.state.name}
                        placeholder={'Please enter your name'}
                    />

                    <View style={{flexDirection: 'row', paddingVertical: 10}}>
                        <Text numberOfLines={1}>
                            Latitude:
                        </Text>
                        {!loading ?
                            <Text numberOfLines={1}>
                                {latitude}
                            </Text> : <ActivityIndicator size="small"/>
                        }
                    </View>

                    <View style={{flexDirection: 'row', paddingVertical: 10}}>
                        <Text numberOfLines={1}>
                            Longitude:
                        </Text>
                        {!loading ?
                            <Text numberOfLines={1}>
                                {longitude}
                            </Text> : <ActivityIndicator size='small'/>
                        }
                    </View>

                    {this.props.loading ? <ActivityIndicator size='small'/> : <Button
                        title="Submit"
                        color="#841584"
                        onPress={() => {
                            this.saveUserInfo(personIndex);
                            this.clearState();
                        }}
                    />}

                </View>

                <View>
                    <Text>{!isEmpty(message) ? "Record created with " + message + " Successfully " : null}</Text>
                    <Text>{!isEmpty(actionQueue) && actionQueue.length > 0 ? "No of queued  Requests:" + actionQueue.length : null}</Text>
                </View>

                <Icon
                    type={'material-community'}
                    raised
                    name={isConnected ? 'wifi' : 'perm-scan-wifi'}
                    color='#51b9d3'
                    reverse

                    containerStyle={{position: 'absolute', right: 20, bottom: 20}}
                />

            </View>
        );
    }
}

const mapStateToProps = (state) => {

    console.log(state.isConnected);

    return {
        people: state.people,
        personIndex: state.personIndex,
        actionQueue: state.actionQueue,
        isConnected: state.isConnected,
        loading: state.loading,
        message: state.message

    };
};


const styles = StyleSheet.create({

    form: {
        marginVertical: 25,
        marginHorizontal: 20
    },
    titleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    inputStyle: {height: 40, borderColor: 'gray', borderWidth: 1}

});


export default connect(mapStateToProps)(KnexForm);
