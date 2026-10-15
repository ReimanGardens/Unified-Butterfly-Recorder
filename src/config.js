// Deployment configuration, read from REACT_APP_* environment variables at build time.
// See .env.example for the full list. Note that every value here ends up in the
// public JS bundle, so none of these may be server-side secrets.

const config = {
  cognitoUserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
  cognitoClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
  surveyApiUrl: process.env.REACT_APP_SURVEY_API_URL,
  listApiUrl: process.env.REACT_APP_LIST_API_URL,
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  openWeatherApiKey: process.env.REACT_APP_OPENWEATHER_API_KEY,
};

const missing = Object.entries(config)
  .filter(([, value]) => !value)
  .map(([name]) => name);
if (missing.length > 0) {
  throw new Error(
    `Missing configuration: ${missing.join(", ")}. Copy .env.example to .env.local and fill in the values.`
  );
}

export default config;
