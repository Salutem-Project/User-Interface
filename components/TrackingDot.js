import React from 'react';
import { View, Image, Animated } from 'react-native';

import Draggable from 'react-native-draggable';

const trackingDotFactor = 5;

const TrackingDot = props => {

    let content = <View></View>;
    console.log(props.isTrackingMode);
    if (props.isTrackingMode) {
        // props.updateTrackingCoords();
        content =
            <Draggable
                x={props.coords.x_cord}
                y={props.coords.y_cord}
                minX={-800 / (trackingDotFactor * 2)}
                minY={-800 / (trackingDotFactor * 2)}
                maxX={props.floorPlanDimensions.width + 800 / (trackingDotFactor * 2)}
                maxY={props.floorPlanDimensions.height + 800 / (trackingDotFactor * 2)}
            >
                <Image
                    style={{
                        width: props.trackingDotDimensions.width / trackingDotFactor,
                        height: props.trackingDotDimensions.height / trackingDotFactor,
                    }}
                    source={props.trackingDotSrc}
                />
            </Draggable>;
        console.log(content);
    }

    return content;
};

export default TrackingDot;