import Ajv from "./ajv.js";

const ajv = new Ajv({ allErrors: true });

//sechema for creating account
export const creds = ajv.compile({
  properties: {
    user: {
      type: "string",
      minLength: 2,
    },
    pass: {
      type: "string",
      minLength: 2,
    },
  },
  required: ["user", "pass"],
});


export let accountsSch = {
  jsonapi: {
    version: "1.0",
  },
  methods: ["GET", "POST"],
  name: "Accounts",
  desc: "Get logged in user",
  schema: {
    username: "string",
  },
  links: {},
};



export let myaccountsPostSch = {
  jsonapi: {
    version: "1.0",
  },

  methods: ["GET", "POST"],
  name: "Accounts",
  desc: "Registering an account",

  schema: { user: "string", pass: "string" },

  links: {},
};


export let sensorData = {
  jsonapi: {
    version: "1.0",
  },

  methods: ["GET"],
  name: "Sensor Data",
  desc: "Data containing time, temperature, pressure, altitude and humidity",

  schema: {
	  time: "array",
	  temperature: "array",
	  pressure: "array",
	  altitude: "array",
	  humidity: "array"
  },

};
