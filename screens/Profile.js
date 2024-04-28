import { StyleSheet, View, Text, Button, Image, Pressable, ScrollView, TextInput, Alert } from "react-native";
import { useContext, useEffect, useState } from "react";
import { MaskedTextInput } from "react-native-mask-text";
import * as ImagePicker from 'expo-image-picker';
import AppDataContext from "../AddDataContext";
import headerLogo from "../assets/images/Logo30.png";
import backIcon from "../assets/images/back.png";
import saveIcon from "../assets/images/save.png";
import profileIcon from "../assets/images/Profile40.png";
import profilePlaceHolder from "../assets/images/Profile.png";
import checked from "../assets/images/checked_checkbox.png";
import unchecked from "../assets/images/unchecked_checkbox.png";
import { deleteTable } from "./little-lemon-db";

export default function Profile( {navigation} ) {
    const {appData, setAppData} = useContext(AppDataContext);
    const [orderStatuses, setOrderStatuses] = useState(false);
    const [passwordChanges, setPasswordChanges] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletters, setNewsletters] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect( () => {
        navigation.setOptions({
            headerLeft: () => (
                <Pressable onPress={() => navigation.goBack()}>
                    <Image source={backIcon} />
                </Pressable>
            ),
            headerTitle: () => (
                <Image source={headerLogo} />
            ),
            headerRight: () => (
                <Pressable onPress={null}>
                    <Image source={profileIcon} />
                </Pressable>
            ),
        });
        setFirstName(appData.firstName ? appData.firstName : '');
        setLastName(appData.lastName ? appData.lastName : '');
        setEmail(appData.email ? appData.email : '');
        setPhoneNumber(appData.phoneNumber ? appData.phoneNumber : '');
        setOrderStatuses(appData.orderStatuses ? appData.orderStatuses : false);
        setPasswordChanges(appData.passwordChanges ? appData.passwordChanges : false);
        setSpecialOffers(appData.specialOffers ? appData.specialOffers : false);
        setNewsletters(appData.newsletters ? appData.newsletters : false);
        setProfileImage(appData.profileImage ? appData.profileImage : null);
    }, [navigation]);

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
        });
        if (!result.canceled) {
          setProfileImage(result.assets[0].uri);
        } else {
          setProfileImage(null);
        }
    };

    const handleFirstName = (firstName) => {
        // Check if firstName is empty or contains non-string characters
        if (!firstName || firstName.length < 1 || !/^[a-zA-Z]+$/.test(firstName)) {
            setFirstNameError('Cannot be empty and must contains letters only!');
        } else {
            setFirstNameError('');
        }
        setFirstName(firstName);
    }

    const handleLastName = (lastName) => {
        setLastName(lastName);
    }

    const handleEmail = (email) => {
        // Simple email validation using regex
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            setEmailError('Must be valid email address!');
        } else {
            setEmailError('');
        }
        setEmail(email);
    }

    const handleLogout = () => {
        setAppData({ isOnboardingCompleted: false });
        deleteTable();
    }

    const handleDiscardChanges = () => {
        navigation.goBack();
    }

    const handleSaveChanges = () => {
        if (firstNameError.length > 0 || emailError.length > 0) {
            Alert.alert('Form Error', 'Invalid field(s)!\nPlease correct and then save again.', [
                {text: 'OK', onPress: () => console.log('OK Pressed')},
            ]);
            return;
        }
        let newData = {};
        newData.firstName = firstName;
        if (lastName.length > 0) {
            newData.lastName = lastName;
        }
        newData.email = email;
        if (phoneNumber.length > 0) {
            newData.phoneNumber = phoneNumber;
        }
        newData.orderStatuses = orderStatuses;
        newData.passwordChanges = passwordChanges;
        newData.specialOffers = specialOffers;
        newData.newsletters = newsletters;
        newData.profileImage = profileImage;
        setAppData(previousData => ({
            ...previousData,
            ...newData
        }));
        navigation.goBack();
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollview}>
                <Text style={styles.title}>Personal information</Text>
                <Text style={styles.label}>Avatar</Text>
                <View style={styles.avatarview}>
                    {
                        profileImage ? (
                            <Image
                            style={styles.profileimage}
                            source={{ uri: profileImage }}
                            />
                        ) : (
                            <View style={styles.placeholderimage}>
                                <Text style={styles.placeholdertext}>{firstName.charAt(0).toUpperCase()+lastName.charAt(0).toUpperCase()}</Text>
                            </View>
                        )
                    }
                    <Pressable onPress={pickImageAsync} style={styles.changebutton}>
                        <Text style={{color: '#EDEFEE', fontWeight:'bold'}}>Change</Text>
                    </Pressable>
                    <Pressable>
                        <Text onPress={() => setProfileImage(null) } style={styles.removebutton}>Remove</Text>
                    </Pressable>
                </View>
                <Text style={styles.label}>
                    First name
                    <Text style={styles.error}> {firstNameError}</Text>
                </Text>
                <TextInput style={styles.input} value={firstName} onChangeText={text => handleFirstName(text)}></TextInput>
                <Text style={styles.label}>Last name</Text>
                <TextInput style={styles.input} value={lastName} onChangeText={text => handleLastName(text)}></TextInput>
                <Text style={styles.label}>
                    Email
                    <Text style={styles.error}> {emailError}</Text>
                </Text>
                <TextInput style={styles.input} value={email} onChangeText={text => handleEmail(text)}></TextInput>
                <Text style={styles.label}>Phone number</Text>
                <MaskedTextInput
                    value={phoneNumber}
                    mask="(999) 999-9999"
                    onChangeText={(text, rawText) => {
                      setPhoneNumber(rawText);
                    }}
                    style={styles.input}
                />
                <Text style={styles.title}>Email notifications</Text>
                <Pressable style={styles.checkboxview} onPress={() => setOrderStatuses(!orderStatuses)}>
                    <Image source={orderStatuses ? checked : unchecked} />
                    <Text style={styles.checkboxtext}>Order statuses</Text>
                </Pressable>
                <Pressable style={styles.checkboxview} onPress={() => setPasswordChanges(!passwordChanges)}>
                    <Image source={passwordChanges ? checked : unchecked} />
                    <Text style={styles.checkboxtext}>Password Changes</Text>
                </Pressable>
                <Pressable style={styles.checkboxview} onPress={() => setSpecialOffers(!specialOffers)}>
                    <Image source={specialOffers ? checked : unchecked} />
                    <Text style={styles.checkboxtext}>Special Offers</Text>
                </Pressable>
                <Pressable style={styles.checkboxview} onPress={() => setNewsletters(!newsletters)}>
                    <Image source={newsletters ? checked : unchecked} />
                    <Text style={styles.checkboxtext}>Newsletters</Text>
                </Pressable>
                <Pressable onPress={handleLogout} style={styles.logoutbutton}>
                    <Text style={{ color: '#333333', fontWeight: 'bold', textAlign: 'center' }}>Logout</Text>
                </Pressable>
                <View style={{...styles.avatarview, justifyContent: 'center'}}>
                    <Pressable onPress={handleDiscardChanges}>
                        <Text style={styles.removebutton}>Discard Changes</Text>
                    </Pressable>
                    <Pressable onPress={handleSaveChanges} style={styles.changebutton}>
                        <Text style={{color: '#EDEFEE', fontWeight:'bold'}}>Save Changes</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollview: {
        padding: 10,
    },
    title: {
        color: "#495E57",
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        color: "#495E57",
        fontSize: 10,
        fontWeight: "bold",
        marginTop: 8,
    },
    error: {
        color: 'red',
    },
    input: {
        height: 'auto',
        padding: 8,
        borderRadius: 8,
        borderColor: '#333333',
        borderWidth: 1,
        color: '#333333',
        fontSize: 14,
        marginTop: 4,
        marginBottom: 8,
    },
    checkboxview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
        marginBottom: 8,
    },
    checkboxtext: {
        color: "#495E57",
        fontSize: 12,
        fontWeight: "bold",
    },
    avatarview: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 25,
        marginTop: 8,
        marginBottom: 8,
    },
    profileimage: {
        width: 75,
        height: 75,
        borderRadius: 50,
    },
    placeholderimage: {
        width: 75,
        height: 75,
        borderRadius: 50,
        backgroundColor: "#495E57",
        justifyContent: 'center',
        alignItems: 'center'
    },
    placeholdertext: {
        color: '#EDEFEE',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    changebutton: {
        color: '#EDEFEE',
        backgroundColor: "#495E57",
        padding: 10,
        borderWidth: 1,
        borderColor: "#495E57",
        borderRadius: 8,
        fontWeight: 'bold',
    },
    removebutton: {
        color: '#495E57',
        padding: 10,
        borderWidth: 1,
        borderRadius: 8,
        fontWeight: 'bold',
    },
    logoutbutton: {
        color: '#EDEFEE',
        backgroundColor: "#F4CE14",
        padding: 10,
        borderWidth: 1,
        borderColor: '#EE9972',
        borderRadius: 8,
        fontWeight: 'bold',
        marginBottom: 10,
    }
});

