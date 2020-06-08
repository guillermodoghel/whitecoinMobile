import React, {Component} from "react";
import {
    Header,
    Title,
    Button,
    Container,
    Text,
    Right,
    Icon,
    Body, Spinner,
} from "native-base";

import {Dimensions, View, ScrollView, RefreshControl, Modal,TouchableHighlight} from "react-native";
import {normalize} from "../../utils/visualUtils";
import {NavigationActions, StackActions} from "react-navigation";
import {onSignOut} from "../../api/users-api";
import {getHome} from "../../api/wallet-api";
import {getToken} from "../../utils/authUtils";

import styles from "../signup/styles";

const deviceWidth = Dimensions.get("window").width;
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
        if (this.state.screenStatus === WAIT) {
            const token = await getToken();
            console.log(token);
            const home = await getHome(token);
            console.log(home);
            this.setState({home: home});
            this.setState({screenStatus: HOME});
        }
    }


    async _refreshListView() {
        this.setState({refreshing: true});
        const token = await getToken();
        const home = await getHome(token);
        this.setState({home: home});
        this.setState({refreshing: false}); //Stop Rendering Spinner
    }

    _renderHome() {
        return (

            <Container>
                {this.modal()}
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

                <ScrollView
                    style={{marginLeft: deviceWidth / 16}}
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
                        }}>{this.state.home.adress}</Text>
                        <Text style={{
                            fontSize: normalize(16),
                            textAlign: "left",
                            marginTop: 5,
                            marginLeft: 20,
                            position: "relative"
                        }}>{this.state.home.user}</Text>
                        <Text style={{
                            fontSize: normalize(28),
                            textAlign: "right",
                            marginTop: 60,
                            marginBottom: 20,
                            marginRight: 20,
                            position: "relative"
                        }}> ẅ {Math.round((this.state.home.balance * 100) / 100).toFixed(2)}</Text>
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
                    </View>
                    {this.createTable()}
                    <View style={{
                        marginTop: 20,
                        width: deviceWidth * 7 / 8,
                        alignItems: "center",
                        justifyContent: "center",
                        flex: 1,

                    }}>
                    </View>
                </ScrollView>

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

    render() {
        if (this.state.screenStatus === HOME) {
            return this._renderHome();
        }
        if (this.state.screenStatus === WAIT) {
            return this._renderWait();
        }

    }

    modal = () => {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Hello World!</Text>

                        <TouchableHighlight
                            style={{...styles.openButton, backgroundColor: "#2196F3"}}
                            onPress={() => {
                                this.setModalVisible(!this.state.modalVisible);
                            }}
                        >
                            <Text style={styles.textStyle}>Hide Modal</Text>
                        </TouchableHighlight>
                    </View>
                </View>
            </Modal>
        );
    };

    createTable = () => {
        const localAdress = this.state.home.adress;
        const transactions = this.state.home.activities;
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
        return "";
    }

    onLogoff = async code => {
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
