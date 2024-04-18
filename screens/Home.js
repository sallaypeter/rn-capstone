import { View, Text, StyleSheet, Button } from "react-native";
import { useEffect } from "react";

export default function Home( {navigation} ) {

    useEffect( () => {
        navigation.setOptions({
            headerRight: () => (
                <Button title="Profile" onPress={() => navigation.navigate("Profile")}/>
            ),
        });
    }, [navigation]);

    return (
        <View style={styles.container}>
            <Text>Home Screen</Text>
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