import { useContext, useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TextInput, Pressable, ImageBackground } from "react-native";
import logo from "../assets/images/Logo.png";
import hero from "../assets/images/HeroImage.png";
import AppDataContext from "../AddDataContext";

export default function Onboarding({navigation}) {
    const {appData, setAppData} = useContext(AppDataContext);
    const [formData, setFormData] = useState({
        firstName: '',
        email: ''
    });
    const [errors, setErrors] = useState({});
    const [isNextEnabled, setIsNextEnabled] = useState(false);

    useEffect( () => {
        navigation.setOptions({
            headerShown: false
        });
    }, [navigation]);

    const handleInputChange = (field, value) => {
        setFormData({
          ...formData,
          [field]: value,
        });

        switch (field) {
          case 'firstName':
            validateFirstName(value);
            break;
          case 'email':
            validateEmail(value);
            break;
          // Add more cases for additional input fields here
          default:
            break;
        }
    };

    const validateFirstName = (value) => {
        const newErrors = { ...errors };

        // Check if firstName is empty or contains non-string characters
        if (!value || value.length < 1 || !/^[a-zA-Z]+$/.test(value)) {
            newErrors.firstName = 'Cannot be empty and must contains letters only!';
        } else {
            delete newErrors.firstName;
        }

        setErrors(newErrors);
        setIsNextEnabled(Object.keys(newErrors).length === 0 && formData.email);
    };

    const validateEmail = (value) => {
        const newErrors = { ...errors };

        // Simple email validation using regex
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(value)) {
            newErrors.email = 'Must be valid email address!';
        } else {
            delete newErrors.email;
        }

        setErrors(newErrors);
        setIsNextEnabled(Object.keys(newErrors).length === 0 && formData.firstName.length >= 1);
    };

    const handleNextPress = () => {
        // Handle next button press
        // For example, navigate to the next screen or perform other actions
        // Change app state to logged in
        console.log('Next button pressed');
        setAppData( previousData => ({
            ...previousData,
            isOnboardingCompleted: true,
            firstName: formData.firstName,
            email: formData.email
        }));
    };

    return (
        <View style={styles.onboarding}>
            <View style={styles.header}>
                <Image source={logo} />
            </View>
            <View style={styles.main}>
                <Text style={{...styles.label, color: '#F4CE14'}}>Let us get to know you</Text>
                <View>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        placeholder="Enter your first name ..."
                        placeholderTextColor='#777777'
                        style={styles.input}
                        onChangeText={(text) => handleInputChange('firstName', text)}
                        value={formData.firstName}
                        autoCapitalize="words"
                    />
                    {errors.firstName ? <Text style={styles.error}>{errors.firstName}</Text> : <Text style={styles.error}>{' '}</Text>}
                </View>
                <View>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        placeholder="Enter your email ..."
                        placeholderTextColor='#777777'
                        style={styles.input}
                        value={formData.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                    {errors.email ? <Text style={styles.error}>{errors.email}</Text> : <Text style={styles.error}>{' '}</Text>}
                </View>
                <Pressable
                    disabled={!isNextEnabled}
                    style={isNextEnabled ? styles.buttonEnabled : styles.button}
                    onPress={handleNextPress}>
                    <Text style={isNextEnabled ? styles.buttonTextEnabled : styles.buttonText}>Next</Text>
                </Pressable>
            </View>
            <View style={styles.next}>
                <Image style={styles.hero} resizeMode="cover" source={hero} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    onboarding: {
        flex: 1,
        fontSize: 32,
    },
    header: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    main: {
        flex: 6,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        backgroundColor: '#495E57',
        padding: 16,
    },
    next: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 50,
        minWidth: "80%",
        padding: 8,
        borderRadius: 8,
        borderColor: '#EDEFEE',
        borderWidth: 2,
        color: '#EDEFEE',
        fontSize: 24,
    },
    button: {
        backgroundColor: 'darkgray',
        padding: 10,
        borderRadius: 8,
        minWidth: 150,
        marginTop: 24,
    },
    buttonEnabled: {
        backgroundColor: '#F4CE14',
        padding: 10,
        borderRadius: 8,
        minWidth: 150,
        marginTop: 24,
    },
    buttonText: {
        color: 'gray',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '500'
    },
    buttonTextEnabled: {
        color: '#495E57',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '500'
    },
    label: {
        color: '#EDEFEE',
        fontSize: 24,
        textAlign: 'center',
        margin: 8,
    },
    hero: {
        width: "100%",
        height: "100%"
    },
    error: {
        color: 'red',
        minHeight: 20,
        fontSize: 12,
        marginTop: 3,
    },
});
