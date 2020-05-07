import React from 'react';
import { View, Button, Text, StyleSheet, FlatList } from 'react-native';

import Remote from '../components/Remote';

const ViewRemotesScreen = props => {
    return (
        <View style={styles.screen}>
            <Text style={styles.heading}>Remotes</Text>
            <FlatList
                keyExtractor={(item, index) => item.r_id}
                data={props.remotes}
                renderItem={itemData => <Remote id={itemData.item.r_id} name={itemData.item.u_id} onRemoveRemote={props.onRemoveRemote} />}
            />
            <View style={styles.buttonContainer}>
                <Button
                    title="Return"
                    onPress={props.onCancelViewRemotes}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center'
    },
    heading: {
        padding: 50,
        color: '#2196F3'
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'center'
    }
});

export default ViewRemotesScreen;