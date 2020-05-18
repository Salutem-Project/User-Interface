import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Animated
} from 'react-native';

import MainMenu from './screens/MainMenu';
import AddRemoteScreen from './screens/AddRemoteScreen';
import ViewRemotesScreen from './screens/ViewRemotesScreen';
// import DocumentPicker from 'react-native-document-picker';

// When more base stations are made, Add their mac addresses here.
let availableStations = ['30:AE:A4:9E:20:47', '24:0A:C4:26:75:DF'];
let availableRemotes = ['24:6f:28:a1:e4:fa'];
const window = Dimensions.get("window");
const remotesEndpoint = 'http://athena.matthewpogue.com:1080/remote';
const stationsEndpoint = 'http://athena.matthewpogue.com:1080/station';

const sendHttpRequest = (method, url, data) => {
    // console.log(url);
    // console.log(JSON.stringify(data));
    return fetch(url, {
        method: method,
        body: JSON.stringify(data),
        headers: data ? { 'Content-Type': 'application/json' } : {}
    }).then(response => {
        return response.json();
    });
};

const App = () => {
    const [stationsUpdated, setStationsUpdated] = useState(true);
    const [dimensions, setDimensions] = useState(window);
    const [baseStations, setBaseStations] = useState([]);
    const [remotes, setRemotes] = useState([]);
    const [isAddRemoteMode, setIsAddRemoteMode] = useState(false);
    const [isViewRemotesMode, setIsViewRemotesMode] = useState(false);
    const [pullStations, setPullStations] = useState(true);
    const [pullRemotes, setPullRemotes] = useState(true);
    const [isAssignNewEmployeeMode, setIsAssignNewEmployeeMode] = useState(false);
    const [assignToRemote, setAssignToRemote] = useState(0);
    const [isTrackingMode, setIsTrackingMode] = useState(true);


    if (pullStations) {
        // API WORK
        let databaseStations = [];
        let url = stationsEndpoint + 's';
        const response = sendHttpRequest('GET', url);
        response.then(stations => {
            for (let i = 0; i < stations.stations.length; i++) {
                const databaseStation = stations.stations[i];
                let newStation = {
                    s_id: databaseStation.s_id,
                    x_cord: Number(databaseStation.x_cord),
                    y_cord: Number(databaseStation.y_cord),
                    additional_data: {
                        location: databaseStation.location,
                        updateOnSave: databaseStation.updateOnSave
                    }
                };

                databaseStations.push(newStation);
            }
            setBaseStations(databaseStations);
        });

        setPullStations(false);
    }

    if (pullRemotes) {
        // API WORK
        let url = remotesEndpoint + 's';
        const response = sendHttpRequest('GET', url);
        console.log(response.then(remotes => {
            for (let i = 0; i < remotes.remotes.length; i++) {
                availableRemotes.filter(remote => remote.r_id !== remotes.remotes.r_id);
            }
            setRemotes(remotes.remotes);
        }));
        setPullRemotes(false);
    }

    const printDimensions = (type, dimensions) => {
        console.log(type + ": " + dimensions.width + " X " + dimensions.height);
    };

    const printCoordinates = (type, coordinates) => {
        console.log(type + ": (" + coordinates.x_cord + ", " + coordinates.y_cord + ")");
    };

    const onChange = ({ window }) => {
        const updatedBaseStations = baseStations;

        for (let i = 0; i < updatedBaseStations.length; i++) {
            updatedBaseStations[i].x_cord = (window.width * updatedBaseStations[i].x_cord) / dimensions.width;
            updatedBaseStations[i].y_cord = (window.height * updatedBaseStations[i].y_cord) / dimensions.height;
        }
        setBaseStations(updatedBaseStations);
        setDimensions(window);
        setStationsUpdated(false);
    };

    useEffect(() => {
        Dimensions.addEventListener("change", onChange);
        return () => {
            Dimensions.removeEventListener("change", onChange);
        };
    });

    const addBaseStationHandler = () => {
        if (availableStations.length > 0) {
            const MAC = availableStations[availableStations.length - 1];
            const newBaseStation = {
                s_id: MAC,
                x_cord: 0,
                y_cord: 0,
                additional_data: {
                    location: 'A',
                    updateOnSave: false
                }
            };

            const url = stationsEndpoint + '/' + newBaseStation.s_id;
            console.log(sendHttpRequest('POST', url, newBaseStation));
            setBaseStations(currentBaseStations => [
                ...currentBaseStations,
                newBaseStation
            ]);
            setStationsUpdated(false);
            availableStations.pop();
        } else {
            alert("You have no more base stations to add");
        }
    };

    const removeBaseStationHandler = stationId => {
        // API WORK
        console.log("Removing base station: " + stationId);
        const url = stationsEndpoint + '/' + stationId;
        console.log(sendHttpRequest('DELETE', url));
        setBaseStations(currentBaseStations => {
            return currentBaseStations.filter(station => station.s_id !== stationId);
        });
        setStationsUpdated(false);
        availableStations.push(stationId);
    }

    const updateLocation = (stationId, gestureState) => {
        // For debugging the zoom drag event
        // console.log("PageX: " + gestureState.nativeEvent.pageX);
        // console.log("pageY: " + gestureState.nativeEvent.pageY);
        // console.log("locationX: " + gestureState.nativeEvent.locationX);
        // console.log("locationY: " + gestureState.nativeEvent.locationY);
        // For debugging the zoom drag event
        const x_cord = gestureState.nativeEvent.pageX - gestureState.nativeEvent.locationX;
        const y_cord = gestureState.nativeEvent.pageY - gestureState.nativeEvent.locationY;
        const updatedBaseStations = baseStations;
        console.log("Moving: " + stationId + " to: (" + x_cord + ", " + y_cord + ")");
        for (let i = 0; i < updatedBaseStations.length; i++) {
            if (updatedBaseStations[i].s_id === stationId) {
                updatedBaseStations[i].x_cord = Math.round(x_cord);
                updatedBaseStations[i].y_cord = Math.round(y_cord);
                updatedBaseStations[i].additional_data.updateOnSave = true;
            }
        }
        setBaseStations(updatedBaseStations);
        setStationsUpdated(false);
    };

    const handleUpdate = () => {
        setStationsUpdated(true);
    };

    const saveStationsHandler = () => {
        var url = "";
        baseStations.forEach(station => {
            if (station.additional_data.updateOnSave) {
                station.additional_data.updateOnSave = false;
                url = stationsEndpoint + '/' + station.s_id;
                console.log("Saving station");
                console.log(sendHttpRequest('DELETE', url));
                console.log(sendHttpRequest('POST', url, station));
                console.log(station);
            }
        });
    };

    const addRemoteHandler = name => {
        if (name.length === 0) {
            return;
        }

        if (availableRemotes.length > 0) {
            const id = availableRemotes[availableRemotes.length - 1];
            const newRemote = {
                r_id: id,
                u_id: name,
                additional_data: {}
            };

            const url = remotesEndpoint + '/' + newRemote.r_id;
            setRemotes(currentRemotes => [
                ...currentRemotes,
                newRemote
            ]);
            console.log(sendHttpRequest('POST', url, newRemote));
            availableRemotes.pop();
        } else {
            alert("You have no remoes to add");
        }
        setIsAddRemoteMode(false);
    };

    const cancelRemoteHandler = () => {
        setIsAddRemoteMode(false);
    };

    const cancelViewRemotesHandler = () => {
        setIsViewRemotesMode(false);
    };

    const removeRemoteHandler = remoteId => {
        // API WORK
        const url = remotesEndpoint + '/' + remoteId;
        sendHttpRequest('DELETE', url);
        console.log("Removing remote: " + remoteId);
        setRemotes(currentRemotes => {
            return currentRemotes.filter(remote => remote.r_id !== remoteId);
        });
        availableRemotes.push(remoteId);
    };

    const onClickAddRemoteHandler = () => {
        setIsAddRemoteMode(true);
    };

    const onClickViewRemotesHandler = () => {
        setIsViewRemotesMode(true);
    };

    const assignNewEmployeeHandler = remoteId => {
        console.log('assigning new employee');
        setAssignToRemote(remoteId);
        setIsAssignNewEmployeeMode(true);
    };

    const saveNewEmployeeHandler = (remoteId, name) => {
        for (let i = 0; i < remotes.length; i++) {
            if (remotes[i].r_id === remoteId) {
                remotes[i].u_id = name;
                const url = remotesEndpoint + '/' + remotes[i].r_id;
                console.log(sendHttpRequest('DELETE', url, remotes[i]));
                console.log(sendHttpRequest('POST', url, remotes[i]));
            }
        }
        setIsAssignNewEmployeeMode(false);
    };

    const cancelSaveNewEmployeeHandler = () => {
        setIsAssignNewEmployeeMode(false);
    };

    const setRoomHandler = stationId => {
        // console.log("I WANT TO SET THE LOCATION");
        // for (let i = 0; i < updatedBaseStations.length; i++) {
        //     if (updatedBaseStations[i].s_id === stationId) {
        //         updatedBaseStations[i].x_cord = Math.round(x_cord);
        //         updatedBaseStations[i].y_cord = Math.round(y_cord);
        //     }
        // }
    };

    // async function pickDocumentHandler() {
    //     try {
    //         const res = await DocumentPicker.pick({
    //             type: [DocumentPicker.types.images],
    //         });
    //         console.log(
    //             res.uri,
    //             res.type, // mime type
    //             res.name,
    //             res.size
    //         );
    //     } catch (err) {
    //         if (DocumentPicker.isCancel(err)) {
    //             // User cancelled the picker, exit any dialogs or menus and move on
    //         } else {
    //             throw err;
    //         }
    //     }
    // };

    let content = <MainMenu
        dimensions={dimensions}
        baseStations={baseStations}
        removeBaseStationHandler={removeBaseStationHandler}
        updateLocation={updateLocation}
        stationsUpdated={stationsUpdated}
        askUpdate={handleUpdate}
        handleSetRoom={setRoomHandler}
        addBaseStationHandler={addBaseStationHandler}
        saveStationsHandler={saveStationsHandler}
        setAddRemoteMode={onClickAddRemoteHandler}
        setViewRemotesMode={onClickViewRemotesHandler}
        isTrackingMode={isTrackingMode}
    />;

    if (isAddRemoteMode) {
        content = <AddRemoteScreen
            onAddRemote={addRemoteHandler}
            onCancelRemoteAddition={cancelRemoteHandler}
        />;
    } else if (isViewRemotesMode) {
        content = <ViewRemotesScreen
            assignNewEmployeeMode={isAssignNewEmployeeMode}
            onSaveNewEmployee={saveNewEmployeeHandler}
            onCancelSaveNewEmployee={cancelSaveNewEmployeeHandler}
            remoteId={assignToRemote}
            remotes={remotes}
            onAssignNewEmployee={assignNewEmployeeHandler}
            onCancelViewRemotes={cancelViewRemotesHandler}
            onRemoveRemote={removeRemoteHandler}
        />;
    }

    return (
        <View style={styles.screen}>
            {content}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    }
});

export default App;
