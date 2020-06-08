import AsyncStorage from "@react-native-community/async-storage";

export const ACCESS_TOKEN = "@access_token";

export async function onSignIn(key){
    await AsyncStorage.setItem(ACCESS_TOKEN, key);
}

export async function onSignOut(){
    await AsyncStorage.removeItem(ACCESS_TOKEN);
}

export async function isSignedIn(){
  const token  = await AsyncStorage.getItem(ACCESS_TOKEN);
  return token != null;
}

export async function getToken(){
  const token  = await AsyncStorage.getItem(ACCESS_TOKEN);
  return token;
}
