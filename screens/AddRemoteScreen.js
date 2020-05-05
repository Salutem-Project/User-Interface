import React, { useState } from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    Button,
} from 'react-native';

const AddRemoteScreen = props => {
    const [enteredName, setEnteredName] = useState('');

    const nameInputHandler = enteredName => {
        setEnteredName(enteredName);
    };

    const addRemoteHandler = () => {
        props.onAddRemote(enteredName);
        setEnteredName('');
    };

    const cancelRemoteAdditionHandler = () => {
        props.onCancelRemoteAddition();
        setEnteredName('');
    };

    return (
        <View style={styles.inputContainer}>
            <TextInput
                placeholderTextColor="black"
                placeholder="Employee Name"
                style={styles.input}
                onChangeText={nameInputHandler}
                value={enteredName}
            />
            <View style={styles.buttonContainer} >
                <View style={styles.addButton} >
                    <Button title="ADD" onPress={addRemoteHandler} />
                </View>
                <View style={styles.cancelButton} >
                    <Button title="CANCEL" onPress={cancelRemoteAdditionHandler} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    input: {
        color: 'black',
        width: '20%',
        borderColor: 'black',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '60%',
    },
    addButton: {
        width: '40%'
    },
    cancelButton: {
        width: '40%'
    }
});

export default AddRemoteScreen;