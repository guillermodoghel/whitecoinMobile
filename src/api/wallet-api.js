import {BASE_URL} from "./constants";

export async function getHome(token) {
    const requestOptions = {
        method: "GET",
        headers: {"content-type": "application/json"},
        redirect: "follow"
    };
    const response = await fetch(BASE_URL + "/wallet-api/home?access_token="+token, requestOptions);
    if (response.status === 200) {
        return await response.json();
    }
    throw new Error();
}
