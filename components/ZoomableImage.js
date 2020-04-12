import React from 'react';
import BaseStation from './BaseStation';
import { StyleSheet, ScrollView, Image, View, ShadowPropTypesIOS } from 'react-native';

const ZoomableImage = props => {
    const baseStationDimensions = Image.resolveAssetSource(props.baseStationSrc);

    return (
        <ScrollView style={styles.scrollStyle} minimumZoomScale={1} maximumZoomScale={5}>
            <Image source={props.floorPlanSrc} style={{resizeMode: 'stretch', width: props.windowDimensions.width, height: props.windowDimensions.height}} />
            <BaseStation
                floorPlanDimensions={props.windowDimensions} 
                baseStationDimensions={baseStationDimensions} 
                baseStationSrc={props.baseStationSrc}
                baseStations={props.baseStations}
                removeStation={props.removeStation}
                updateLocation={props.updateLocation}
                stationsUpdated={props.stationsUpdated}
                askUpdate={props.askUpdate}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollStyle: {
        flex: 1
    }
});

export default ZoomableImage;