import { View, Text, StyleSheet, Pressable, Image, TextInput, FlatList, Alert, ScrollView } from "react-native";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useFonts, MarkaziText_400Regular, MarkaziText_500Medium, MarkaziText_600SemiBold, MarkaziText_700Bold} from "@expo-google-fonts/markazi-text";
import headerLogo from "../assets/images/Logo30.png";
import profileIcon from "../assets/images/Profile40.png";
import hero from "../assets/images/HeroImage.png";
import search from "../assets/images/search25.png";
import logo from "../assets/images/little-lemon-logo-small.png";
import noimage from "../assets/images/no_image.png";
import SplashScreen from "./SplashScreen";
import jsondata from "./capstone.json";
import { fetchLittleLemonMenuFromAPI } from "./little-lemon-api";
import { createTable, getMenuItems, saveMenuItems } from "./little-lemon-db";
import debounce from 'lodash.debounce';

export default function Home( {navigation} ) {
    let [fontsLoaded] = useFonts({
        MarkaziText_400Regular,
        MarkaziText_500Medium,
        MarkaziText_600SemiBold,
        MarkaziText_700Bold,
        "Karla": require("../assets/fonts/Karla-Regular.ttf"),
    });
    const [searchText, setSearchText] = useState('');
    const [queryText, setQueryText] = useState('');
    const [starters, setStarters] = useState(false);
    const [mains, setMains] = useState(false);
    const [desserts, setDesserts] = useState(false);
    const [drinks, setDrinks] = useState(false);
    const [specials, setSpecials] = useState(false);
    const [data, setData] = useState([]);

    useEffect( () => {
        navigation.setOptions({
            headerTitle: () => (
                <Image source={headerLogo} />
            ),
            headerRight: () => (
                <Pressable onPress={() => navigation.navigate("Profile")}>
                    <Image source={profileIcon} />
                </Pressable>
            ),
        });
    }, [navigation]);

    /*
    useEffect( () => {
        const menu = jsondata.menu.map(item => {
            let newObj = { ...item };
            return newObj;
        })
        setData(menu);
    }, []);
    */

    useEffect( () => {
        (async () => {
            try {
                await createTable();
                let menuItems = await getMenuItems('select * from menuitems');
                if (!menuItems.length) {
                    const menu = await fetchLittleLemonMenuFromAPI();
                    await saveMenuItems(menu);
                    menuItems = await getMenuItems('select * from menuitems');
                }
                setData(menuItems);
            } catch (error) {
                Alert.alert(error.message);
            }
        })();
    }, []);

    useEffect(() => {
        let query = "SELECT * FROM menuitems WHERE 1=1";
        if (queryText.length > 0) {
            query += ` AND (name LIKE '%${queryText}%')`;
        }
        if (starters || mains || desserts || drinks || specials) {
          let arrCategories = [];
          if (starters) { arrCategories.push('starters') }
          if (mains) { arrCategories.push('mains') }
          if (desserts) { arrCategories.push('desserts') }
          if (drinks) { arrCategories.push('drinks') }
          if (specials) { arrCategories.push('specials') }
          let categoriesText = "";
          for (let i = 0; i < arrCategories.length; i++) {
            categoriesText += `\'${arrCategories[i]}\'`;
            if (i === arrCategories.length - 1) { break }
            categoriesText += ", ";
          }
          query += ` AND category IN (${categoriesText})`;
        }
        getMenuItems(query)
        .then(data => setData(data))
        .catch(error => Alert.alert(error.message));
    }, [queryText, starters, mains, desserts, drinks, specials]);

    const lookup = useCallback((q) => {
        setQueryText(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchText(text);
        debouncedLookup(text);
      };

    const renderItem = ({ item }) => (
        <View style={styles.listRow}>
            <View style={styles.cell}>
                <Text style={styles.cellTitle}>{item.name}</Text>
                <Text style={styles.cellDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.cellPrice}>${item.price}</Text>
            </View>
            <Image
                style={styles.cellImage}
                source={{ uri: `https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`}}
                defaultSource={noimage}
            />
        </View>
    );

    return (
        fontsLoaded ? (
        <View style={styles.container}>
            <Text style={styles.title} >Little Lemon</Text>
            <View style={styles.heroView}>
                <View style={styles.heroTextView}>
                    <Text style={styles.subTitle}>Chicago</Text>
                    <Text style={styles.leadText}>
                        We are a family owned
                        Mediterranean restaurant,
                        focused on traditional
                        recipes served with a
                        modern twist.
                    </Text>
                </View>
                <Image style={styles.heroImage} source={hero}/>
            </View>
            <View style={styles.searchView}>
                <View style={styles.searchIconView}>
                    <Image source={search} />
                </View>
                <TextInput
                    style={styles.input}
                    value={searchText}
                    onChangeText={handleSearchChange}
                    placeholder="Search foods by name ..."
                    placeholderTextColor="gray"
                />
            </View>
            <Text style={styles.sectionTitle}>ORDER FOR DELIVERY!</Text>
            <View style={styles.filterView}>
                <ScrollView horizontal={true}>
                    <Pressable style={starters ? styles.filterTextViewSelected : styles.filterTextView} onPress={()=>setStarters(!starters)}>
                        <Text style={styles.filterText}>Starters</Text>
                    </Pressable>
                    <Pressable style={mains ? styles.filterTextViewSelected : styles.filterTextView} onPress={()=>setMains(!mains)}>
                        <Text style={styles.filterText}>Mains</Text>
                    </Pressable>
                    <Pressable style={desserts ? styles.filterTextViewSelected : styles.filterTextView} onPress={()=>setDesserts(!desserts)}>
                        <Text style={styles.filterText}>Desserts</Text>
                    </Pressable>
                    <Pressable style={drinks ? styles.filterTextViewSelected : styles.filterTextView} onPress={()=>setDrinks(!drinks)}>
                        <Text style={styles.filterText}>Drinks</Text>
                    </Pressable>
                    <Pressable style={specials ? styles.filterTextViewSelected : styles.filterTextView} onPress={()=>setSpecials(!specials)}>
                        <Text style={styles.filterText}>Specials</Text>
                    </Pressable>
                </ScrollView>
            </View>
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                ItemSeparatorComponent={(<View style={{height: 1, backgroundColor: '#EDEFEE'}}/>)}
            />
        </View>
        ) : (
            <SplashScreen />
        )
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        color: '#F4CE14',
        backgroundColor: '#495E57',
        fontFamily: "MarkaziText_500Medium",
        fontSize: 48,
        paddingLeft: 10,
        paddingBottom: 0,
    },
    heroView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#495E57',
        paddingTop: 0,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    heroTextView: {
        flex: 3,
        paddingTop: 0,
    },
    subTitle: {
        color: '#EDEFEE',
        fontFamily: "MarkaziText_400Regular",
        fontSize: 32,
        paddingBottom: 10,
    },
    leadText: {
        color: '#EDEFEE',
        fontWeight: "500",
        fontSize: 16,
        fontWeight: '500',
    },
    heroImage: {
        flex: 2,
        width: 'auto',
        height: 120,
        borderRadius: 20
    },
    searchView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        backgroundColor: '#495E57',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10,
    },
    searchIconView: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EDEFEE',
    },
    input: {
        flex: 1,
        height: 40,
        padding: 8,
        borderRadius: 8,
        borderColor: '#EDEFEE',
        borderWidth: 2,
        color: '#EDEFEE',
        fontSize: 20,
    },
    sectionTitle: {
        color: "black",
        fontWeight: "bold",
        fontSize: 20,
        paddingLeft: 10,
        paddingTop: 10,
    },
    scrollView: {
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    filterView: {
        flexDirection: 'row',
        gap: 16,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    filterTextView: {
        flex: 1,
        backgroundColor: "#EDEFEE",
        borderColor: '#EDEFEE',
        borderWidth: 1,
        borderRadius: 16,
        marginRight: 15,
    },
    filterTextViewSelected: {
        flex: 1,
        backgroundColor: "#F4CE14",
        borderColor: '#F4CE14',
        borderWidth: 1,
        borderRadius: 16,
        marginRight: 15,
    },
    filterText: {
        color: "#495E57",
        fontSize: 14,
        fontWeight: "bold",
        padding: 8,
        textAlign: 'center'
    },
    listRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
        padding: 10
    },
    cell: {
        flex: 1,
    },
    cellTitle: {
        color: '#333333',
        fontSize: 20,
        fontWeight: 'bold'
    },
    cellDescription: {
        color: '#495E57',
        fontSize: 14,
        marginTop: 5,
        marginBottom: 5,
    },
    cellPrice: {
        color: '#495E57',
        fontSize: 18,
        fontWeight: '500',
    },
    cellImage: {
        width: 70,
        height: 70
    }
});