import React, {Component} from "react";
import {
    Header,
    Title,
    Button,
    Container,
    Text,
    Right,
    Icon,
    Body, Spinner, Toast,
} from "native-base";

import {Dimensions, View, ScrollView, RefreshControl} from "react-native";
import Modal from "react-native-modal";
import {NavigationActions, StackActions} from "react-navigation";
import QRCode from "react-qr-code";
import AsyncStorage from "@react-native-community/async-storage";

import {normalize} from "../../utils/visualUtils";
import {onSignOut} from "../../api/users-api";
import {getHome} from "../../api/wallet-api";
import {getToken} from "../../utils/authUtils";

import styles from "../signup/styles";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const WAIT = "wait";
const HOME = "home";

class Home extends Component {
    constructor() {
        super();
        this.state = {
            screenStatus: WAIT,
            refreshing: false,
            modalVisible: false,
            home: {}
        };
    }

    async componentDidMount(): void {
        try {
            if (this.state.screenStatus === WAIT) {
                const oldHome = await AsyncStorage.getItem(HOME);
                console.log(oldHome);
                if (oldHome != null) {
                    this.setState({home: JSON.parse(oldHome)});
                    this.setState({screenStatus: HOME});
                }
                const token = await getToken();
                const home = await getHome(token);
                console.log(home);
                this.setState({home: home});
                this.setState({screenStatus: HOME});
                await AsyncStorage.setItem(HOME, JSON.stringify(home));
            }
        } catch (e) {

            console.log(e);
            if (e.message == 401) {
                Toast.show({
                    text: "Invalid token, login out..",
                    buttonText: "Okay",
                    type: "danger",
                    position: "top"
                });
                AsyncStorage.clear();
                this.props.navigation.dispatch(resetAction);
            }

        }
    }


    async _refreshListView() {
        try {
            this.setState({refreshing: true});
            const token = await getToken();
            const home = await getHome(token);
            this.setState({home: home});
            this.setState({refreshing: false}); //Stop Rendering Spinner
            await AsyncStorage.setItem(HOME, JSON.stringify(home));
        } catch (e) {
            if (e.message == 401) {
                Toast.show({
                    text: "Invalid token, login out..",
                    buttonText: "Okay",
                    type: "danger",
                    position: "top"
                });
                AsyncStorage.clear();
                this.props.navigation.dispatch(resetAction);
            }
        }

    }

    render() {
        if (this.state.screenStatus === HOME) {
            return this._renderHome(this.state.home);
        }
        if (this.state.screenStatus === WAIT) {
            return this._renderWait();
        }

    }

    _renderHome(home) {
        return (
            <Container>

                {this.header()}
                {this.modal(home)}
                {this.scrollableBody(home)}

            </Container>
        );
    }

    _renderWait() {
        return (
            <Container style={styles.container}>
                < Spinner color="black"/>
            </Container>
        );
    }


    header = () => {
        return (
            <Header style={{backgroundColor: "#000"}}
                    androidStatusBarColor="#000"
                    iosBarStyle="light-content">
                <Body>
                    <Title>White coin wallet</Title>
                </Body>
                <Right>
                    <Button transparent onPress={() => this.onLogoff()}>
                        <Icon type="AntDesign" name="logout"/>
                    </Button>
                </Right>
            </Header>
        );
    };

    scrollableBody = (home) => {
        return (
            <ScrollView
                style={{marginLeft: deviceWidth / 16}}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => this._refreshListView()}/>}>
                {this.account(home)}
                {this.mainActions()}
                {this.lineSeparator()}
                {this.activities(home)}
                {this.footer()}
            </ScrollView>
        );
    };
    account = (home) => {
        return (
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
                }}>{home.adress}</Text>
                <Text style={{
                    fontSize: normalize(16),
                    textAlign: "left",
                    marginTop: 5,
                    marginLeft: 20,
                    position: "relative"
                }}>{home.user}</Text>
                <Text style={{
                    fontSize: normalize(28),
                    textAlign: "right",
                    marginTop: 60,
                    marginBottom: 20,
                    marginRight: 20,
                    position: "relative"
                }}> ẅ {Math.round((home.balance * 100) / 100).toFixed(2)}</Text>
            </View>
        );
    };

    mainActions = () => {
        return (
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
                        onPress={() => this.props.navigation.navigate("ScanScreen")}
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
                <Button rounded dark
                        onPress={() => this.setModalVisible(true)}

                        style={{
                            width: deviceWidth * 3 / 8,
                            textAlign: "right",
                            marginTop: 20,
                            marginBottom: 20,
                            position: "relative"
                        }}>
                    <Text style={{textAlign: "center", width: "100%"}}>Receive</Text>
                </Button>
            </View>
        );
    };

    lineSeparator = () => {
        return (
            <View style={{
                marginTop: 20,
                width: deviceWidth * 7 / 8,
                borderWidth: 1,
                borderColor: "black",
                borderStyle: "solid",
                alignItems: "center",
                justifyContent: "center",
                flex: 1,

            }}/>
        );
    };

    footer = () => {
        return (
            <View style={{
                marginTop: 20,
                width: deviceWidth * 7 / 8,
                alignItems: "center",
                justifyContent: "center",
                flex: 1,

            }}/>
        );
    };


    modal = (home) => {
        return (
            <Modal isVisible={this.state.modalVisible}>
                <View style={{
                    height: deviceHeight / 8 * 4,
                    width: deviceWidth / 8 * 7,
                    backgroundColor: "white",
                    alignSelf: "center",
                    borderWidth: 1,
                    borderColor: "black",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <QRCode
                        value= {home.adress}
                        size={deviceWidth / 8 * 6}
                        color="black"
                        backgroundColor='white'/>
                    <Text style={{
                        fontSize: normalize(10),
                        textAlign: "center",
                    }}>{home.adress}</Text>
                    <Button rounded dark onPress={() => this.setModalVisible(false)}
                            style={{
                                alignSelf: "center",
                                width: deviceWidth * 3 / 8,
                                textAlign: "center",
                                marginTop: 20,
                                marginBottom: 20,
                            }}>
                        <Text style={{textAlign: "center", width: "100%"}}>Close</Text>
                    </Button>
                </View>

            </Modal>

        );
    };

    activities = (home) => {

        const localAdress = home.adress;
        const transactions = home.activities;

        const rows = [];
        for (var i = 0; i < transactions.length; i++) {
            rows.push(
                <View style={{
                    key: {i},
                    marginTop: 20,
                    width: deviceWidth * 7 / 8,
                    borderWidth: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                }}>
                    <Text style={{
                        fontSize: normalize(10),
                        textAlign: "left",
                        marginLeft: 5,
                    }}>From:{transactions[i].returnValues._from}</Text>
                    <Text style={{
                        fontSize: normalize(10),
                        textAlign: "left",
                        marginTop: 5,
                        marginLeft: 5,
                    }}>To:{transactions[i].returnValues._to}</Text>

                    <Text style={{
                        fontSize: normalize(20),
                        textAlign: "right",
                        marginTop: 15,
                        marginRight: 15,
                        position: "relative",
                        color: this.txcolor(localAdress, transactions[i].returnValues._from)
                    }}>
                        ẅ {this.txPrefix(localAdress, transactions[i].returnValues._from)}{Math.round((transactions[i].returnValues._value * 100) / 100).toFixed(2)}</Text>
                </View>
            );
        }
        return rows;
    };

    setModalVisible(status) {
        this.setState({modalVisible: status});
    }

    txcolor(local, from) {
        if (local.toUpperCase() === from.toUpperCase()) {
            return "red";
        }
        return "green";
    }

    txPrefix(local, from) {
        if (local.toUpperCase() === from.toUpperCase()) {
            return "-";
        }
        return "+";
    }

    onLogoff = async code => {
        await AsyncStorage.removeItem(HOME);
        await onSignOut();
        this.props.navigation.dispatch(resetAction);
    };
}

export default Home;

const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
        NavigationActions.navigate({routeName: "Welcome"}),
    ],
});
