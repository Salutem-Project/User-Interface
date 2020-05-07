import React, { useState } from 'react';
import Draggable from 'react-native-draggable';
import { Image } from 'react-native';

const baseStationFactor = 15;

const BaseStation = props => {
    let content = [];
    if (props.stationsUpdated) {
        for (let i = 0; i < props.baseStations.length; i++) {
            content.push(
                <Draggable
                    x={props.baseStations[i].x_cord}
                    y={props.baseStations[i].y_cord}
                    minX={-props.baseStationDimensions.width / (baseStationFactor * 2)}
                    minY={-props.baseStationDimensions.height / (baseStationFactor * 2)}
                    maxX={props.floorPlanDimensions.width + props.baseStationDimensions.width / (baseStationFactor * 2)}
                    maxY={props.floorPlanDimensions.height + props.baseStationDimensions.height / (baseStationFactor * 2)}
                    onShortPressRelease={props.handleSetRoom.bind(this, props.baseStations[i].s_id)}
                    onLongPress={props.removeStation.bind(this, props.baseStations[i].s_id)}
                    onDragRelease={props.updateLocation.bind(this, props.baseStations[i].s_id)}
                >
                    <Image
                        style={{ width: props.baseStationDimensions.width / baseStationFactor, height: props.baseStationDimensions.height / baseStationFactor }}
                        source={props.baseStationSrc}
                    />
                </Draggable>
            );
        }
    } else {
        props.askUpdate();
    }
    return content;
};

export default BaseStation;