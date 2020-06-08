import {BASE_URL} from "./constants";

export async function acessRequest(number) {
    const raw = JSON.stringify({"number": number});
    const requestOptions = {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: raw,
        redirect: "follow"
    };
    const response = await fetch(BASE_URL + "/users-api/autenticate", requestOptions);
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
}

export async function validatePin(number, pin) {
    const raw = JSON.stringify({"username": number, "token": pin});
    const requestOptions = {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: raw,
        redirect: "follow"
    };
    const response = await fetch(BASE_URL + "/users-api/validatecode", requestOptions);
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();

}
