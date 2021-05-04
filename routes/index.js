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

const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.API_KEY}&locale=*`;

async function getapi(url) {
  // Storing response
  const response = await fetch(url);

  // Storing data in form of JSON
  var data = await response.json();
}
getapi(url);

/* GET home page. */
router.get("/", async (req, res, next) => {
  let id = "";
  let keyword = "";
  let city = "";
  let locale = "";
  let size = "";
  let page = "";

  req.query.id ? (id = `&id=${req.query.id}`) : (id = "");
  req.query.keyword
    ? (keyword = `&keyword=${req.query.keyword}`)
    : (keyword = "");
  req.query.city ? (city = `&city=${req.query.city}`) : (city = "");
  req.query.locale ? (locale = `&locale=${req.query.locale}`) : (locale = "");
  req.query.size ? (size = `&size=${req.query.size}`) : (size = "");
  req.query.page ? (page = `&page=${req.query.page}`) : (page = "");

  fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.API_KEY}${id}${keyword}${locale}${city}${size}${page}`
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
        res.render("index", { result: JSON.stringify(json._embedded.events) });
      }
    })
    .catch((e) => console.error(e));
});

router.get("/details/:id", async (req, res, next) => {
  let eventId = req.params.id;
  if (eventId) {
    let eventData = await fetch(
      `https://app.ticketmaster.com/discovery/v2/events/${eventId}?apikey=${process.env.API_KEY}&locale=*`
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.errors)
          return res.sendStatus(Number.parseInt(json.errors[0].status));
        else return res.render("details", { eventData: json });
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

router.get("/list", async (req, res, next) => {
  const allEvents = await loadAllEventData();
  const toonEvents = getMyEvents(allEvents);
  res.render("list", { allEvents: toonEvents });
});

const loadAllEventData = async () => {
  let response = await fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.API_KEY}&locale=*`
  );
  let json = await response.json();
  let event = json._embedded.events;

  return event;
};

const getMyEvents = (allEvents) => {
  let eventsName = [];
  allEvents
    .map(eventsNameMap =>
      eventsName.push({ name: eventsNameMap.name, id: eventsNameMap.id }
      )
    )
  return eventsName;
};

module.exports = router;
