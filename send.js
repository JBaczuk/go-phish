const axios = require("axios");
const FormData = require("form-data");
const randomWords = require("random-words");
const https = require("https");

let httpsAgent = new https.Agent({ keepAlive: true });

let email, password;

const url = process.env.URL

function genRandomString() {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let string = "";
  for (let ii = 0; ii < Math.floor(Math.random() * 20) + 6; ii++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return string;
}

function genRandomEmail() {
  const extensions = ["com", "net", "org", "us"];
  return (
    genRandomString() +
    `@${randomWords()}.${
      extensions[Math.floor(Math.random() * extensions.length)]
    }`
  );
}

async function sendData() {
  const data = new FormData();
  email = genRandomEmail();
  password = genRandomString();
  data.append("username", email);
  data.append("password", password);

  return axios({
    method: "post",
    url,
    data,
    headers: { "Content-Type": "multipart/form-data" },
    httpsAgent,
  })
    .then(function (response) {
      //handle success
      console.log(`${response.status} ${email} ${password}`)
      sendData()
    })
    .catch(function (response) {
      //handle error
      if (response.response.status === 404)
        httpsAgent = new https.Agent({ keepAlive: true });
      sendData()
    });
}

const { parentPort } = require("worker_threads");
parentPort.on("message", (task) => {
  sendData()
  // This will tell the parent to free the thread, but we want it to run indefinitely
  // .then((status) =>
  //   parentPort.postMessage(`${status} ${email} ${password}`)
  // );
});
