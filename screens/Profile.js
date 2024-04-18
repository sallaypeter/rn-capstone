import { StyleSheet, View, Text, Button } from "react-native";
import { useContext, useEffect } from "react";
import AppDataContext from "../AddDataContext";

export default function Profile( {navigation} ) {

    const {appData, setAppData} = useContext(AppDataContext);

    useEffect( () => {
        navigation.setOptions({
            headerRight: () => (
                <Button
                    title="Logout"
                    onPress={() => {
                        setAppData(() => ({
                            isOnboardingCompleted: false
                        }));
                    }}
                />
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text>User Data</Text>
            <Text>First Name: {appData.firstName}</Text>
            <Text>Email: {appData.email}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    }
});

