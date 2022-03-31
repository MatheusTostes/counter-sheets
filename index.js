const express = require("express");
const { google } = require("googleapis");

const app = express();
app.use(express.json());

const cors = require('cors')
app.use(cors())



const clients = {"patrick":0, "matheus":0, "andré":0, "beth":0}

app.get("/clients/", (req, res) => {

  return res.json(clients);
});




async function getAuthSheets() {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const spreadsheetId = "1Ar4czjQ6H-UJE5jjc_sxuM8KuPcJPxoq1vyeWoNttJU";

  return {
    auth,
    client,
    googleSheets,
    spreadsheetId,
  };
}

// app.get("/metadata", async (req, res) => {
//   const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

//   const metadata = await googleSheets.spreadsheets.get({
//     auth,
//     spreadsheetId,
//   });

//   res.send(metadata.data);
// });

app.get("/getRows/", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `Folha1`,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  res.send(getRows.data);
});

// app.post("/addRow", async (req, res) => {
//   const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

//   const { values } = req.body;

//   const row = await googleSheets.spreadsheets.values.append({
//     auth,
//     spreadsheetId,
//     range: "Folha1",
//     valueInputOption: "USER_ENTERED",
//     resource: {
//       values: values,
//     },
//   });

//   res.send(row.data);
// });

app.get("/getRow/:rowName", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const { rowName } = req.params

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: `Folha1!${rowName}`,
    valueRenderOption: "UNFORMATTED_VALUE",
    dateTimeRenderOption: "FORMATTED_STRING",
  });

  res.send(getRows.data["values"][0]);
});

app.post("/updateRow/:rowName", async (req, res) => {
    const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

    const { rowName } = req.params

    let { values } = req.body;


    const updateValue = await googleSheets.spreadsheets.values.update({
      spreadsheetId,
      range: `Folha1!${rowName}`,
      valueInputOption: "USER_ENTERED",
      resource: {
        values: values,
      },
    });

    res.send(updateValue.data)
});

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Server running on ${port}, http://localhost:${port}`));