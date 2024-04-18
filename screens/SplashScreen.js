import { View, Image, StyleSheet } from "react-native";
import logo from "../assets/images/OnboardingLogo200.png";

export default function SplashScreen() {
    return (
        <View style={styles.container}>
            <Image source={logo} alt="Little Lemon Logo"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
});