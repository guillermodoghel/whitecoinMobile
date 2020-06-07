import React, {Component} from "react";
import {Dimensions, View, Linking, Platform} from "react-native";
import {
    Button,
    Container,
    Spinner,
    Text, Toast
} from "native-base";


import {StackActions, NavigationActions} from "react-navigation";
import PhoneInput from "react-native-phone-input";
import CountryPicker from "react-native-country-picker-modal";
import {normalize} from "../../utils/visualUtils";
import {acessRequest, validatePin} from "../../api/users-api";
import styles from "./styles";
import InputCode from "react-native-input-code";
import AsyncStorage from "@react-native-community/async-storage";

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
        this.onPressFlag = this.onPressFlag.bind(this);
        this.selectCountry = this.selectCountry.bind(this);
        this.onSubmitPhone = this.onSubmitPhone.bind(this);
        this.state = {
            phonenumber: "+541124234523",
            screenStatus: ENTER_PHONE,
            cca2: "AR",
            expiringDate: new Date(new Date().getTime() + (20 * 60 * 1000))
        };
    }

    componentDidMount() {
        this.setState({
            pickerData: this.phone.getPickerData()
        });
        if (this.state.screenStatus == ENTER_PHONE) {
            this.phone.refs.inputPhone.blur();
            Platform.OS === "ios" ? this.phone.focus() : setTimeout(() => this.phone.focus(), 400);
        }
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
                        ref={ref => this.phone = ref}
                        selectCountry={this.state.cca2.toLowerCase()}
                        onPressFlag={this.onPressFlag}
                        onChangePhoneNumber={(value) => {
                            this.setState({phonenumber: value});
                        }}
                        value={this.state.phonenumber}
                        initialCountry={"ar"}

                    />
                    <CountryPicker
                        ref={(ref) => {
                            this.countryPicker = ref;
                        }}
                        value={"AR"}
                        showCallingCode={true}
                        withCallingCode={true}
                        hideAlphabetFilter={true}
                        onChange={value => {
                            this.selectCountry(value);
                        }}

                        cca2={this.state.cca2}>
                        <View/>
                    </CountryPicker>
                </View>
                <View style={{marginTop: 20}}/>
                <View style={{marginBottom: 20}}>
                    <Button rounded dark
                            style={{alignSelf: "center", width: deviceWidth * 3 / 4}}
                            onPress={this.onSubmitPhone}>
                        <Text style={{textAlign: "center", width: "100%"}}>Submit</Text>
                    </Button>
                </View>
            </Container>
        );
    }

    _renderEnterPIN() {
        return (
            <Container style={styles.container}>
                <Text style={{color: "black", textAlign: "center", fontSize: normalize(16)}}>
                    Wait for the validation code sent to {"\n"} {this.state.phonenumber}
                </Text>
                <Text style={{color: "black", textDecorationLine: "underline"}}
                      onPress={() => this.backToSubmitPhone()}>
                    Not your number? Change it.
                </Text>
                <InputCode
                    style={{marginTop: 40}}
                    ref={ref => (this.inputCode = ref)}
                    length={6}
                    onFullFill={this.onFullFill}
                    codeContainerStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 2,
                    }}
                    codeContainerCaretStyle={{
                        borderWidth: 0,
                        borderBottomWidth: 2,
                        borderBottomColor: "red",
                    }}
                    autoFocus
                />
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


    onSubmitPhone = async (number) => {
        let num = await this.phone.getValue();
        if (this.phone.isValidNumber()) {
            this.setState({screenStatus: WAIT});
            try {
                await acessRequest(num);
                this.setState({screenStatus: ENTER_PIN});
            } catch (e) {
                this.setState({screenStatus: ENTER_PHONE});
                Toast.show({
                    text: "Something failed",
                    buttonText: "Okay",
                    type: "danger",
                    position: "top"
                });
            }
        } else {
            Toast.show({
                text: "Invalid number",
                buttonText: "Okay",
                type: "danger",
                position: "top"
            });
        }
    };

    onFullFill = async code => {
        this.setState({screenStatus: WAIT});
        try {
            const response = await validatePin(this.state.phonenumber, code);
            await AsyncStorage.setItem("@storage_Key", response.access_token);
            this.props.navigation.dispatch(resetAction);
        } catch (e) {
            this.setState({screenStatus: ENTER_PIN});
            Toast.show({
                text: "Invalid code",
                buttonText: "Okay",
                type: "danger",
                position: "top"
            });
        }
    };

    backToSubmitPhone() {
        this.setState({screenStatus: ENTER_PHONE});
    }

    selectCountry(country) {
        this.phone.refs.inputPhone.blur();
        this.setState({cca2: country.cca2});
        this.phone.selectCountry(country.cca2.toLowerCase());
        Platform.OS === "ios" ? this.phone.focus() : setTimeout(() => this.phone.focus(), 400);
    }

}

export default Signup;
