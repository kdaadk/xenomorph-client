import {useEffect, useState} from "react";
import Cookies from "universal-cookie";
import getUrlParameter from "../shared/getUrlParameter";
import strava from "../shared/strava";

export const useStravaAuth = (initialStravaClient) => {
    let [stravaClient, setStravaClient] = useState(initialStravaClient);
    
    useEffect(() => {
        const fetchToken = async () => await strava.oauth.getToken(code);

        const cookies = new Cookies();
        const authCode = cookies.get("auth_code");
        const code = getUrlParameter("code");

        if (code && code !== authCode) {
            fetchToken().then(r => {
                const accessToken = r.access_token;
                cookies.set("auth_code", code);
                cookies.set("access_token", accessToken);

                setStravaClient(updateAccessToken(r.access_token));
            });
        }

        const accessToken = cookies.get("access_token");
        if (accessToken) {
            setStravaClient(updateAccessToken(accessToken));
        }
    }, []);

    return stravaClient;
}

const updateAccessToken = accessToken => {
    return new strava.client(accessToken);
} 