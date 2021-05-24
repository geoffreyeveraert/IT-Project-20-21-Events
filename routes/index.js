require("dotenv/config");
const { json, response } = require("express");
var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const app = express();
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");

app.use(express.static(__dirname + "/public"));

//use layout
app.use(expressLayouts);
app.set("layout", "./views/layout");
app.set("view engine", "ejs");

/* GET home page. */
router.get("/", async (req, res, next) => {
  let url = "https://app.ticketmaster.com/discovery/v2/events?apikey=";
  let id = "";
  let keyword = "";
  let city = "";
  let size = "";
  let page = "";

  req.query.id ? (id = `&id=${req.query.id}`) : (id = "");
  req.query.keyword
    ? (keyword = `&keyword=${req.query.keyword}`)
    : (keyword = "");
  req.query.city ? (city = `&city=${req.query.city}`) : (city = "");
  req.query.size ? (size = `&size=${req.query.size}`) : (size = "");
  req.query.page ? (page = `&page=${req.query.page}`) : (page = "");

  fetch(
    `${url}${process.env.API_KEY}${id}${keyword}&locale=*${city}${size}${page}`
  )
    .then((response) => {
      if (!response.ok) {
        switch (response.status) {
          case 400:
            console.log("Er is een lokale error opgetreden");
            break;

          case 404:
            console.log("De pagina kan niet gevonden worden");
            break;

          case 500:
            console.log("Er is een error op de server opgetreden");
            break;

          default:
            console.log(`Er is een ${response.status} status fout opgetreden.`);
            break;
        }
      } else {
        return response.json();
      }
    })
    .then((json) => {
      if (json.page.totalElements === 0) {
        res.render("index", { result: 0 });
      } else {
        res.render("index", {
          result: json._embedded.events,
          pageInfo: json.page,
          currentKeyword: keyword,
          currentCity: city,
          currentPage: Number(page.slice(6)),
          testNumber: 5,
        });
      }
    })
    .catch((e) => console.error(e));
});

module.exports = router;
