import React from 'react';
import BaseStation from './BaseStation';
import { StyleSheet, ScrollView, Image } from 'react-native';
import TrackingDot from './TrackingDot';

const ZoomableImage = props => {
    const baseStationDimensions = Image.resolveAssetSource(props.baseStationSrc);
    const trackingDotDimensions = Image.resolveAssetSource(props.trackingDotSrc);

    return (
        <ScrollView style={styles.scrollStyle} minimumZoomScale={1} maximumZoomScale={5}>
            <Image source={props.floorPlanSrc} style={{resizeMode: 'stretch', width: props.windowDimensions.width, height: props.windowDimensions.height}} />
            <TrackingDot isTrackingMode={props.isTrackingMode} updateTrackingCoords={props.updateTrackingCoords} trackingDotDimensions={trackingDotDimensions} coords={props.trackerCoords} trackingDotSrc={props.trackingDotSrc} floorPlanDimensions={props.windowDimensions} />
            <BaseStation
                floorPlanDimensions={props.windowDimensions} 
                baseStationDimensions={baseStationDimensions} 
                baseStationSrc={props.baseStationSrc}
                baseStations={props.baseStations}
                handleSetRoom={props.handleSetRoom}
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