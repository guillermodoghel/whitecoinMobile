import React, {Component} from "react";
import {
    Button,
    Container,
    Text,

} from "native-base";

import styles from "./styles";
import {Dimensions, View, ScrollView, RefreshControl} from "react-native";
import {normalize} from "../../utils/visualUtils";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

class Home extends Component {
    constructor() {
        super();
        this.state = {
            refreshing: false,
        };
    }

    _refreshListView() {
        //Start Rendering Spinner
        this.setState({refreshing: true});

        this.setState({refreshing: false}); //Stop Rendering Spinner
    }


    render() {

        return (
            <Container style={styles.container}>
                <View style={{
                    width: deviceWidth,
                    backgroundColor: "black",

                }}>
                    <Text style={{
                        fontSize: normalize(16),
                        textAlign: "left",
                        marginTop: 20,
                        marginBottom: 10,
                        marginLeft: 20,
                        position: "relative",
                        color: "white"
                    }}>White coin wallet</Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={() => this._refreshListView()}/>}>
                    <View style={{
                        marginTop: 20,
                        width: deviceWidth * 7 / 8,
                        borderWidth: 1,
                        borderColor: "black",
                        borderStyle: "solid",

                    }}>
                        <Text style={{
                            fontSize: normalize(10),
                            textAlign: "left",
                            marginTop: 20,
                            marginLeft: 20,
                            position: "relative"
                        }}>0x70f059b538d6765e83938f36c3a6d7b25d29618e</Text>
                        <Text style={{
                            fontSize: normalize(16),
                            textAlign: "left",
                            marginTop: 5,
                            marginLeft: 20,
                            position: "relative"
                        }}>+5491124058295</Text>
                        <Text style={{
                            fontSize: normalize(28),
                            textAlign: "right",
                            marginTop: 60,
                            marginBottom: 20,
                            marginRight: 20,
                            position: "relative"
                        }}> ẅ 23.456.789,00</Text>
                    </View>
                    <View style={{
                        marginTop: 20,
                        width: deviceWidth * 7 / 8,
                        borderWidth: 0,
                        borderColor: "black",
                        borderStyle: "solid",
                        flexDirection: "row",
                        alignItems: "center",

                        justifyContent: "center"

                    }}>
                        <Button rounded
                                dark
                                onPress={() => this.props.navigation.push("ScanScreen")}
                                style={{
                                    width: deviceWidth * 3 / 8,
                                    textAlign: "right",
                                    marginTop: 20,
                                    marginBottom: 20,
                                    position: "relative"

                                }}>
                            <Text style={{textAlign: "center", width: "100%"}}>Send</Text>
                        </Button>
                        <View style={{
                            width: deviceWidth * 1 / 16,
                            marginTop: 20,
                            marginBottom: 20,

                        }}>
                        </View>
                        <Button rounded dark style={{
                            width: deviceWidth * 3 / 8,
                            textAlign: "right",
                            marginTop: 20,
                            marginBottom: 20,
                            position: "relative"
                        }}>
                            <Text style={{textAlign: "center", width: "100%"}}>Receive</Text>
                        </Button>
                    </View>
                    <View style={{
                        marginTop: 20,
                        width: deviceWidth * 7 / 8,
                        borderWidth: 1,
                        borderColor: "black",
                        borderStyle: "solid",
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,

                    }}>

                        {this.createTable()}
                    </View>
                </ScrollView>
            </Container>
        );
    }

    createTable = () => {
        let table = [];

        for (var i = 0; i < 20; i++) {
            table.push(
                <View style={{
                    key: {i},
                    marginTop: 20,
                    width: deviceWidth * 12 / 16,
                    height: 100,
                    borderWidth: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"

                }}>

                </View>
            );
        }

        ;
        return table;
    };
}

export default Home;
