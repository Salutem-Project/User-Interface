import React from 'react';
import { View, Button, Text, StyleSheet, FlatList } from 'react-native';

import Remote from '../components/Remote';
import AssignNewEmployeeScreen from './AssignNewEmployeeScreen';

const ViewRemotesScreen = props => {
    let content;

    if (props.assignNewEmployeeMode) {
        content = <AssignNewEmployeeScreen
            remoteId={props.remoteId}
            onSaveNewEmployee={props.onSaveNewEmployee}
            onCancelSaveNewEmployee={props.onCancelSaveNewEmployee}
        />;
    } else if (props.remotes.length === 0) {
        console.log("here");
        content =
            <View style={styles.screen}>
                <View style={styles.heading}>
                    <Text style={styles.headingTitle}>Remotes</Text>
                </View>
                <View style={{flex:1, alignItems: 'center', padding: 100}}>
                    <Text style={{color: 'black', fontSize: 50}}>There is currently no remote information stored</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <Button
                        title="Return"
                        onPress={props.onCancelViewRemotes}
                    />
                </View>
            </View>;
    } else {
        content =
            <View style={styles.screen}>
                <View style={styles.heading}>
                    <Text style={styles.headingTitle}>Remotes</Text>
                </View>
                <FlatList
                    keyExtractor={(item, index) => item.r_id}
                    data={props.remotes}
                    renderItem={itemData => <Remote id={itemData.item.r_id} name={itemData.item.u_id} onAssignNewEmployee={props.onAssignNewEmployee} onRemoveRemote={props.onRemoveRemote} />}
                />
                <View style={styles.buttonContainer}>
                    <Button
                        title="Return"
                        onPress={props.onCancelViewRemotes}
                    />
                </View>
            </View>;
    }

    return content;
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'flex-end',
        // alignContent: 'flex-end'
    },
    heading: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2196F3'
    },
    headingTitle: {
        fontSize: 50,
        color: 'white'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
    }
});

export default ViewRemotesScreen;