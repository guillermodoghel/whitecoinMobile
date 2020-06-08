import React, {Component} from "react";
import {
    View,
    Dimensions
} from "react-native";

import Video from "react-native-video";
import styles from "./styles";
import {Button, Container, H3, Text} from "native-base";

const backgroundVideo = require("../../../assets/MessyDangerousFeline-mobile.mp4");
const deviceWidth = Dimensions.get("window").width;

class Welcome extends Component {
    render() {
        return (
            <Container>
                <Video
                    source={backgroundVideo}
                    style={styles.backgroundVideo}
                    muted={true}
                    repeat={true}
                    resizeMode={"cover"}
                    rate={1.0}
                    ignoreSilentSwitch={"obey"}
                />


                <View
                    style={styles.logoContainer}
                >
                    <Text style={styles.title}>White Coin</Text>
                    <View style={{marginTop: 8}}/>
                    <H3 style={styles.text}>your private coin wallet</H3>
                    <View style={{marginTop: 8}}/>
                </View>
                <View style={{marginBottom: 20}}>
                    <Button rounded dark
                            style={{alignSelf: "center", width: deviceWidth * 3 / 4}}
                            onPress={() => this.props.navigation.navigate('Signup')}
                    >
                        <Text style={{textAlign: "center",width: "100%"}}>Sign up / Log in</Text>
                    </Button>
                </View>
            </Container>

        );
    }
}

export default Welcome;


