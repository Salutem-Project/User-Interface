import React from 'react';
import { View, Animated } from 'react-native';

const trackingDotFactor = 5;

const TrackingDot = props => {

    let content = <View></View>;
    console.log(props.isTrackingMode);
    if (props.isTrackingMode) {
        content =
            <Animated.Image
                style={{
                    width: props.trackingDotDimensions.width / trackingDotFactor,
                    height: props.trackingDotDimensions.height / trackingDotFactor,
                    left: props.coords.x_cord,
                    top: props.coords.y_cord,
                    position: 'absolute'
                }}
                source={props.trackingDotSrc}
            />;
        console.log(content);
    }

    return content;
};

export default TrackingDot;