import React, {Component} from "react";

import {
    Button,
    Container,
    Content, Form, Input, Item, Spinner,
    Text,

} from "native-base";

import styles from "./styles";
import {Dimensions, View, Linking, ScrollView} from "react-native";
import CodeInput from "react-native-confirmation-code-input";
import {StackActions, NavigationActions} from "react-navigation";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";
import {normalize} from "../../utils/visualUtils";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const resetAction = StackActions.reset({
    index: 0, // <-- currect active route from actions array
    actions: [
        NavigationActions.navigate({routeName: "Home"}),
    ],
});

const ENTER_PHONE = "enter_phone";
const ENTER_PIN = "enter_pin";
const WAIT = "wait";

class Signup extends Component {

    constructor() {
        super();
        this.state = {
            screenStatus: ENTER_PHONE,
            cca2: "AR",
            expiringDate: new Date(new Date().getTime() + (20 * 60 * 1000))
        };
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.onSubmitPhone = this.onSubmitPhone.bind(this);
        this.onSubmitPin = this.onSubmitPin.bind(this);

    }

    componentDidMount() {
        this.setState({
            pickerData: this.phone.getPickerData()
        });
    }

    onSubmitPhone() {
        this.setState({screenStatus: ENTER_PIN});
    }

    onSubmitPin(input) {
        console.log(input);

    }

    backToSubmitPhone() {
        this.setState({screenStatus: ENTER_PHONE});
    }


    render() {


        if (this.state.screenStatus === ENTER_PHONE) {
            return this._renderEnterYourPhone();
        }
        if (this.state.screenStatus === ENTER_PIN) {
            return this._renderEnterPIN();
        }
        if (this.state.screenStatus === WAIT) {
            return this._renderWAIT();
        }
    }

    _renderEnterYourPhone() {
        return (
            <Container style={styles.container}>
                <Text>Enter your phone number</Text>
                <View style={{marginTop: 20}}/>
                <View style={{
                    marginTop: 20,
                    width: deviceWidth * 7 / 8,
                    borderWidth: 1,
                    borderColor: "black",
                    borderStyle: "solid",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center"

                }}>
                    <PhoneInput
                        style={{marginTop: 20, marginBottom: 20, marginLeft: 20}}
                        ref={(ref) => {
                            this.phone = ref;
                        }}

                        onPressFlag={this.onPressFlag}
                    />
                    <CountryPicker
                        ref={(ref) => {
                            this.countryPicker = ref;
                        }}
                        onChange={value => {
                            this.selectCountry(value);
                        }}
                        translation={"spa"}
                        cca2={this.state.cca2}>
                        <View/>
                    </CountryPicker>
                </View>
                <View style={{marginTop: 20}}/>
                <View style={{marginBottom: 20}}>
                    <Button rounded dark
                            style={{alignSelf: "center", width: deviceWidth * 3 / 4}}
                            onPress={() => this.onSubmitPhone()}>
                        <Text style={{textAlign: "center", width: "100%"}}>Submit</Text>
                    </Button>
                </View>
            </Container>
        );
    }

    _renderEnterPIN() {
        return (
            <Container style={styles.container}>
                <Text style={{color: "black", textAlign: "center",fontSize: normalize(16),}}>
                   Wait for the validation code sent to {"\n"}{this.phone.getValue()}
                </Text>
                <Text style={{color: "black", textDecorationLine: "underline"}}
                      onPress={() => this.backToSubmitPhone()}>
                    Is not your number? Change it.
                </Text>

                    <CodeInput
                        ref="codeInput"
                        codeLength={6}
                        activeColor='rgba(0, 0, 0, 1)'
                        inactiveColor='rgba(88, 0, 0, 1.3)'
                        autoFocus={true}
                        ignoreCase={true}
                        inputPosition='center'
                        size={50}
                        onFulfill={(isValid) => this.onSubmitPin(isValid)}
                        containerStyle={{marginTop: 30,marginBottom:20,flex:0}}
                        codeInputStyle={{borderWidth: 1.5}}

                    />

                <Text style={{color: "black", textDecorationLine: "underline"}}
                      onPress={() => Linking.openURL("http://google.com")}>
                    send again
                </Text>
            </Container>
        );
    }

    _renderWAIT() {
        return (
            <Container style={styles.container}>
                < Spinner color="black"/>
            </Container>
        );
    }

    onPressFlag() {
        this.countryPicker.openModal();
    }

    selectCountry(country) {
        this.setState({cca2: country.cca2});
        this.phone.selectCountry(country.cca2.toLowerCase());
        this.phone.focus();
    }

}

export default Signup;
