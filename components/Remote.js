import React from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';

const Remote = props => {
    return (
        <View style={styles.remoteSpace}>
            <View style={styles.textView}>
                <Text style={styles.textStyle}>
                    {props.name}
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <View style={styles.newEmployeeButton}>
                    <Button
                        title="Assign New Employee"
                    />
                </View>
                <View style={styles.deleteButton}>
                    <Button
                        title="Delete"
                        onPress={props.onRemoveRemote.bind(this, props.id)}
                    />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    remoteSpace: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
    },
    textView: {
        width: '50%',
        alignItems: 'center'
    },
    textStyle: {
        color: 'black',
    },
    buttonContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    newEmployeeButton: {
        padding: 10
    },
    deleteButton: {
        padding: 10
    }
});

export default Remote;