import React from 'react';
import { View, Button, StyleSheet, FlatList } from 'react-native';

import Remote from '../components/Remote';

const ViewRemotesScreen = props => {
    return (
        <View style={styles.screen}>
            <FlatList
                keyExtractor={(item, index) => item.id}
                data={props.remotes}
                renderItem={itemData => <Remote id={itemData.item.id} name={itemData.item.employeeName} onRemoveRemote={props.onRemoveRemote} />}
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
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'center',
    }
});

export default ViewRemotesScreen;