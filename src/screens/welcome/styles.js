const React = require("react-native");
const {Dimensions} = React;
const deviceHeight = Dimensions.get("window").height;

export default {
    backgroundVideo: {
        height: deviceHeight,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0,
    },
    logoContainer: {
        flex: 0,
        marginTop: deviceHeight / 3,
        alignItems: "center",
        marginBottom: 50,
        backgroundColor: "transparent"
    },
    title: {
        fontWeight: "bold",
        fontSize: 45,
        color: "#000",
        bottom: 6,
        marginTop: 5
    },
    text: {
        color: "#323336",
        bottom: 6,
        marginTop: 5
    }
};
