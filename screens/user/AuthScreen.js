import React from 'react'
import {
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    Button
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

import Input from '../../components/UI/Input'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors';

const AuthScreen = (props) => {
    return (
        <KeyboardAvoidingView
            behavior="padding"
            keyboardVerticalOffset={50}
            style={styles.screen}
        >
            <LinearGradient colors={['#ffffff', '#e6ffff', '#ccffff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input
                            id="email"
                            label="E-mail"
                            keyboardType="email-address"
                            required//not a in built function see Input.js for reference
                            email//not a in built function see Input.js for reference
                            autoCapitalize="none"
                            errorMessage="please enter a valid email address"
                            onInputChange={() => { }}
                            initialValue=""
                        />

                        <Input
                            id="password"
                            label="Password"
                            keyboardType="default"
                            secureTextEntry
                            required//not a in built function see Input.js for reference
                            minLength={5}//not a in built function see Input.js for reference
                            autoCapitalize="none"
                            errorMessage="please enter a valid password of minimun 5 characters"
                            onInputChange={() => { }}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            <Button
                                title="Login"
                                color={Colors.primary}
                                onPress={() => { }}
                            />
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                title="SignUp"
                                color={Colors.accent}
                                onPress={() => { }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Authenticate'
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,

    },
    authContainer: {
        width: "80%",
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        margin: 10,
        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
        elevation: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        overflow: "hidden"
    }
})

export default AuthScreen