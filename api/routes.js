//https://jsonapi.org/format/
//https://github.coventry.ac.uk/agile/projects/blob/master/19%20Survey.md
/* routes.js */
import { readCSV } from "https://deno.land/x/csv/mod.ts";
import { Router } from "https://deno.land/x/oak@v6.5.1/mod.ts";
import { extractCredentials, saveFile } from "./modules/util.js";
import { login, register } from "./modules/accounts.js";
import { creds } from "./modules/schema.js";
import { sensorData, accountsSch, myaccountsPostSch} from "./modules/schema.js";

const router = new Router();


//Write new GET and POST methods here
router.get("/api/v1/data", async (context) => {
  //console.log(await Deno.readDir('./spa/uploads'))

  const files = [];
  for await (const file of Deno.readDir("./spa/uploads")) {
    files.push(file.name);
  }
  console.log(files);

  const superCell = [];
  const path = "./spa/uploads/" + files.pop();
  const f = await Deno.open(path);
  for await (const row of readCSV(f)) {
    //console.log('row:')
    for await (const cell of row) {
      //console.log(`  cell: ${cell}`);
      superCell.push(cell);
    }
  }
  superCell.shift(1);
    const roughData = [];
  for (const val of superCell) {
    try {
      roughData.push(parseFloat(val));
    } catch {
      continue;
    }
  }

  let data = roughData.filter((item) => !isNaN(item));
  const dataObj = {
    time: [],
    temperature: [],
    pressure: [],
    altitude: [],
    humidity: [],
  };
  const params = Object.keys(dataObj);
  for (const param of params) {
    for (const index in data) {
      if (index === 0 || index % 5 === 0) dataObj[param].push(data[index]);
    }
    data.shift(1);
  }

  sensorData.data = dataObj
  //console.log(JSON.stringify(sensorData, null, 2));
  context.response.body = JSON.stringify(sensorData, null, 2);
});



//CSV post method
router.post("/api/v1/files", async (context) => {
  console.log("POST /api/v1/files");
  try {
    const token = context.request.headers.get("Authorization");
    console.log(`auth: ${token}`);
    const credentials = extractCredentials(token);

    console.log(`logging creds: ${credentials.user}`);

    const body = await context.request.body();
    const data = await body.value;
    //console.log(data)
    saveFile(data.base64, credentials.user);
    context.response.status = 201;
    context.response.body = JSON.stringify(
      {
        data: {
          message: "file uploaded",
        },
      },
    );
  } catch (err) {
    context.response.status = 400;
    context.response.body = JSON.stringify(
      {
        errors: [
          {
            title: "a problem occurred",
            detail: err.message,
          },
        ],
      },
    );
  }
});

//Template routes
router.get("/", async (context) => {
  console.log("GET /");
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});

router.get("/api/v1/accounts", async (context) => {
  console.log("GET /api/accounts");
  const token = context.request.headers.get("Authorization");
  console.log(`auth: ${token}`);
  try {
    const credentials = extractCredentials(token);
    console.log(credentials);
    const username = await login(credentials);
    console.log(`username: ${username}`);

    accountsSch.links.self =
      `https://${context.request.url.host}${context.request.url.pathname}`;
    accountsSch.data = username;

    context.response.body = JSON.stringify(accountsSch, null, 2);
  } catch (err) {
    context.response.status = 401;
    context.response.body = JSON.stringify(
      {
        errors: [{
          title: "401 Unauthorized.",
          detail: err.message,
        }],
      },
      null,
      2,
    );
  }
});

//manages registering
router.post("/api/v1/accounts", async (context) => {
  console.log("POST /api/acc");
  const body = await context.request.body();
  const data = await body.value;
  console.log(data);
  myaccountsPostSch.links.self =
    `https://${context.request.url.host}${context.request.url.pathname}`;
  try {
    const valid = creds(data);
    if (valid === false) throw creds.errors;

    await register(data);
    myaccountsPostSch.data = data;
    myaccountsPostSch.status = 201;
    myaccountsPostSch.response = "Account created";
    myaccountsPostSch.errors = null;
    context.response.status = 201;
    console.log(myaccountsPostSch);
    context.response.body = JSON.stringify(myaccountsPostSch, null, 2);
  } catch (err) {
    console.log(err);
    myaccountsPostSch.status = 406;
    myaccountsPostSch.response = "Couldnt create account";
    myaccountsPostSch.errors = creds.errors;
    context.response.status = 406;
    console.log(myaccountsPostSch);
    context.response.body = JSON.stringify(myaccountsPostSch, null, 2);
  }
});

router.get("/(.*)", async (context) => {
  // 	const data = await Deno.readTextFile('static/404.html')
  // 	context.response.body = data
  const data = await Deno.readTextFile("spa/index.html");
  context.response.body = data;
});

export default router;
