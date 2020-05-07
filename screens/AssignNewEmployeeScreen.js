import React, { useState } from 'react';
import { View, StyleSheet, Button, TextInput } from 'react-native';

const AssignNewEmployeeScreen = props => {
    const [enteredName, setEnteredName] = useState('');

    const nameInputHandler = enteredName => {
        setEnteredName(enteredName);
    };

    const saveNewEmployeeHandler = () => {
        props.onSaveNewEmployee(props.remoteId, enteredName);
        setEnteredName('');
    };

    const cancelAssignNewEmployeeHandler = () => {
        props.onCancelSaveNewEmployee();
        setEnteredName('');
    };

    console.log("Assigning new employee for remote: ", props.remoteId);

    return (
        <View style={styles.inputContainer}>
            <TextInput
                placeholderTextColor="black"
                placeholder="New Employee Name"
                style={styles.input}
                onChangeText={nameInputHandler}
                value={enteredName}
            />
            <View style={styles.buttonContainer} >
                <View style={styles.addButton} >
                    <Button title="SAVE" onPress={saveNewEmployeeHandler} />
                </View>
                <View style={styles.cancelButton} >
                    <Button title="CANCEL" onPress={cancelAssignNewEmployeeHandler} />
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

export default AssignNewEmployeeScreen;