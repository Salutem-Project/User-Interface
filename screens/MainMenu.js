import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

import ZoomableImage from '../components/ZoomableImage';

const MainMenu = props => {
    return (
        <View style={styles.screen}>
            <ZoomableImage
                windowDimensions={props.dimensions}
                floorPlanSrc={require('../photos/sampleFloorPlan.jpg')}
                baseStationSrc={require('../photos/baseStation.png')}
                baseStations={props.baseStations}
                handleSetRoom={props.handleSetRoom}
                removeStation={props.removeBaseStationHandler}
                updateLocation={props.updateLocation}
                stationsUpdated={props.stationsUpdated}
                askUpdate={props.askUpdate}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Add Base Station"
                    color='green'
                    onPress={props.addBaseStationHandler}
                />
                <Button
                    title="Save Stations"
                    color='#007ACC'
                    onPress={props.saveStationsHandler}
                />
                <Button
                    title="Add Remote"
                    color='green'
                    onPress={props.setAddRemoteMode}
                />
                <Button
                    title="View Remotes"
                    color='red'
                    onPress={props.setViewRemotesMode}
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
    screen: {
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
    }
});

export default MainMenu;