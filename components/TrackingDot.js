import React, { useState } from 'react';
import { View, Image, Animated } from 'react-native';

const remotesEndpoint = 'http://athena.matthewpogue.com:1080/remote';
const trackingDotFactor = 5;
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
const TrackingDot = props => {
    const [location, setLocation] = useState([0, 0]);
    const [callAPI, setCallAPI] = useState(true);

    if (callAPI) {
        setInterval(() => {
            const url = remotesEndpoint + 's';
            const response = sendHttpRequest('GET', url);
            response.then(remotes => {
                if (location !== remotes.remotes[0].location) {
                    setLocation(remotes.remotes[0].location);
                }
                console.log(remotes.remotes);
            });
        }, 6000);
        setCallAPI(false);
    }

    let content = <View></View>;
    if (props.isTrackingMode) {
        content =
            <Image
                style={{
                    width: props.trackingDotDimensions.width / trackingDotFactor,
                    height: props.trackingDotDimensions.height / trackingDotFactor,
                    left: location[0] - (props.trackingDotDimensions.width / trackingDotFactor / 2),
                    top: location[1] - (props.trackingDotDimensions.height / trackingDotFactor / 2),
                    position: 'absolute'
                }}
                source={props.trackingDotSrc}
            />;
    }

    return content;
};

export default TrackingDot;