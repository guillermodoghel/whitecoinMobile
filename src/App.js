import React from "react";
import {Root} from "native-base";
import {isSignedIn} from "./utils/authUtils";
import {createStackNavigator, createAppContainer, createSwitchNavigator} from "react-navigation";


import Welcome from "./screens/welcome/";
import Signup from "./screens/signup/";
import Home from "./screens/home/";
import ScanScreen from "./screens/scanScreen";

const AuthNavigator = createStackNavigator(
    {
        Welcome: {screen: Welcome},
        Signup: {screen: Signup},
    },
    {
        initialRouteName: "Welcome",
        headerMode: "none"
    }
);

const AppNavigator = createStackNavigator(
    {
        Home: {screen: Home},
        ScanScreen: {screen: ScanScreen},
        Welcome: {screen: Welcome},
        Signup: {screen: Signup},
    },
    {
        initialRouteName: "Home",
        headerMode: "none"
    }
);

const SwitchNavigator = createSwitchNavigator(
    {
        Auth: AuthNavigator,
        App: AppNavigator
    },
    {
        initialRouteName: isSignedIn() ? "App" : "Auth"
    }
);

const AppContainer = createAppContainer(SwitchNavigator);

export default () =>
    <Root>
        <AppContainer/>
    </Root>;
