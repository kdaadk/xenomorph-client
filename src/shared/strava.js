let strava = require('strava-v3');
strava.config({
    "access_token" : process.env.REACT_APP_STRAVA_ACCESS_TOKEN,
    "client_id"     : process.env.REACT_APP_STRAVA_CLIENT_ID,
    "client_secret" : process.env.REACT_APP_CLIENT_SECRET,
    "redirect_uri"  : window.location.href
});

export default strava;
