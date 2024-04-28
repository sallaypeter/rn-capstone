const API_URL = "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const getLittleLemonMenuFromAPI = async () => {
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        return json.menu;
    } catch (error) {
        console.log(error);
    }
};