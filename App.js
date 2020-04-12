import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Button,
    Dimensions
} from 'react-native';

import ZoomableImage from './components/ZoomableImage';
// import DocumentPicker from 'react-native-document-picker';

const window = Dimensions.get("window");

const App = () => {
    const [stationsUpdated, setStationsUpdated] = useState(true);
    const [dimensions, setDimensions] = useState(window);
    const [baseStations, setBaseStations] = useState([]);

    const printDimensions = (type, dimensions) => {
        console.log(type + ": " + dimensions.width + " X " + dimensions.height);
    };

    const printCoordinates = (type, coordinates) => {
        console.log(type + ": (" + coordinates.xCoord + ", " + coordinates.yCoord + ")");
    };

    const onChange = ({ window }) => {
        const updatedBaseStations = baseStations;

        for (let i = 0; i < updatedBaseStations.length; i++) {
            updatedBaseStations[i].xCoord = (window.width * updatedBaseStations[i].xCoord) / dimensions.width;
            updatedBaseStations[i].yCoord = (window.height * updatedBaseStations[i].yCoord) / dimensions.height;
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
        setBaseStations(currentBaseStations => [
            ...currentBaseStations,
            {
                id: Math.random().toString(),
                xCoord: 0,
                yCoord: 0
            }
        ]);
        setStationsUpdated(false);
    };

    const removeBaseStationHandler = stationId => {
        console.log("Removing: " + stationId);
        setBaseStations(currentBaseStations => {
            return currentBaseStations.filter(station => station.id !== stationId);
        });
        setStationsUpdated(false);
    }

    const updateLocation = (stationId, gestureState) => {
        // For debugging the zoom drag event
        // console.log("PageX: " + gestureState.nativeEvent.pageX);
        // console.log("pageY: " + gestureState.nativeEvent.pageY);
        // console.log("locationX: " + gestureState.nativeEvent.locationX);
        // console.log("locationY: " + gestureState.nativeEvent.locationY);
        // For debugging the zoom drag event
        xCoord = gestureState.nativeEvent.pageX - gestureState.nativeEvent.locationX;
        yCoord = gestureState.nativeEvent.pageY - gestureState.nativeEvent.locationY;
        updatedBaseStations = baseStations;
        console.log("Moving: " + stationId + " to: (" + xCoord + ", " + yCoord + ")")
        for (let i = 0; i < updatedBaseStations.length; i++) {
            if (updatedBaseStations[i].id === stationId) {
                updatedBaseStations[i].xCoord = Math.round(xCoord);
                updatedBaseStations[i].yCoord = Math.round(yCoord);
            }
        }
        setBaseStations(updatedBaseStations)
        setStationsUpdated(false);
    };

    const handleUpdate = () => {
        setStationsUpdated(true);
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

    return (
        <View style={styles.background}>
            <ZoomableImage
                windowDimensions={dimensions}
                floorPlanSrc={require('./photos/sampleFloorPlan.jpg')}
                baseStationSrc={require('./photos/baseStation.png')}
                baseStations={baseStations}
                removeStation={removeBaseStationHandler}
                updateLocation={updateLocation}
                stationsUpdated={stationsUpdated}
                askUpdate={handleUpdate}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Add Base Station"
                    color='green'
                    onPress={addBaseStationHandler}
                />
                <Button
                    title="Settings"
                    color='#808080'
                    // onPress={pickDocumentHandler}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    buttonContainer: {
        width: '50%',
        flexDirection: 'row',
        position: 'absolute',
        justifyContent: 'center'
    },
    text: {
        padding: 30,
        color: 'blue'
    },
});

export default App;
