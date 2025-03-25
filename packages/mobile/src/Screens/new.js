import {View,Text} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {useEffect} from "react";

export const New = ()=> {

    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = navigation
            .getParent('MyTabs')
            .addListener('tabPress', (e) => {
                // Do something
                alert('Tab pressed!');
            });

        return unsubscribe;
    }, [navigation]);
    return (
        <View style={{alignItems: "center",justifyContent:"center",flex : 1 , backgroundColor : "lightgray"}}>
            <Text>Home Screen</Text>
        </View>
    )
}
