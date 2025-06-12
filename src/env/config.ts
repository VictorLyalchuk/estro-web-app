const BASE_URL: string = import.meta.env.VITE_BASE_URL as string;

const APP_ENV = {
  BASE_URL: BASE_URL,
  TWILIO_ACC_SID: "AC902312a7d17b4fc600fa789e690824fb",
  TWILIO_AUTH_TOKEN: "d1fa30330035ebcd6bc81b49cb17ea67",
  TWILIO_SERVICE_SID: "VA8ff701eb02d896dc76e0ddbf217896f8"
};


export { APP_ENV };