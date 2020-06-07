import {BASE_URL} from "./constants";

export function acessRequest(number) {
    var raw = JSON.stringify({"number": number});
    var requestOptions = {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: raw,
        redirect: "follow"
    };
    return fetch(BASE_URL + "/users-api/autenticate", requestOptions)
        .then(response => response.json())
        .catch(error => console.log("error", error));
}

export async function validatePin(number, pin) {
    var raw = JSON.stringify({"username": number, "token": pin});

    var requestOptions = {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: raw,
        redirect: "follow"
    };

    const response = await fetch(BASE_URL + "/users-api/validatecode", requestOptions);
    const statusCode = response.status;
    if (statusCode == 200) {
        return await response.json();
    }
    throw new Error("my error");

}
