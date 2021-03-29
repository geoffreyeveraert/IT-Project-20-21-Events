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
  console.log(data);
}
getapi(url);

/* GET home page. */
router.get("/", async (req, res, next) => {
  // Hier komt de fetch
  fetch(url)
    .then((response) => response.json())
    .then((json) =>
      res.render("index", {
        result: JSON.stringify(json._embedded.events),
      })
    )
    .catch((e) => console.error(e));
});

let id = "";
/* GET home page. Event detail */
router.get(`/:id?`, async (req, res, next) => {
  let id = req.params.id;

  fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&id=${id}&locale=*`
  )
    .then((response) => response.json())
    .then((json) =>
      res.render("index", { result: JSON.stringify(json._embedded.events) })
    )
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
  console.log(toonEvents);
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
  allEvents.map((eventsNameMap) =>
    eventsName.push({ name: eventsNameMap.name })
  );
  return eventsName;
};

module.exports = router;
