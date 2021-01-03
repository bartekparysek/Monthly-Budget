const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const _ = require("lodash");
const csv = require("csvtojson");
const fs = require("fs");
const fetch = require("node-fetch");

const app = express();

app.listen(3000, () => console.log("listening at 3000"));
// serving static files in public dir
app.use(express.static("public"));

// enabbles file upload
app.use(fileUpload({
  createParentPath: true,
}));
// add other middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));


// post request
app.post('/uploads', async (request, response) => {
  try {
    if (!request.files) {
      response.send({
        status: false,
        message: "No files uploaded"
      });
    } else {
      let sheet = request.files.fileUplo;
      let csvFilePath = "./uploads/" + sheet.name;

      sheet.mv(csvFilePath);

      const jsonArray = await csv().fromFile(csvFilePath);

      fs.writeFile(
        "/Users/bartek/Documents/Budgety/uploads/transactions.json",
        JSON.stringify(jsonArray),
        function (err) {
          if (err) {
            console.error(err);
            return;
          }
        }
      );

      response.send({
        status: true,
        message: "File is uploaded",
        data: {
          name: sheet.name,
          mimetype: sheet.mimetype,
          size: sheet.size,
        }
      });
    }
  } catch (err) {
    response.status(500).send(err);
  }
});
// get request for a json file with data
/*app.get('/uploads', (request, response) => {
  fs.readFile('./uploads/transactions.json', (err, data) => {
    if (err) {
      response.err(err);
      return
    }
    response.json(JSON.parse(data));
  })
});
*/
// get request for a NBP API
app.get('/api', async (req, res) => {
  const apiURL = 'http://api.nbp.pl/api/exchangerates/tables/c/';
  const currencies = await fetch(apiURL);
  const data = await currencies.json();
  return res.json(data);
});
