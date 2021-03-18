const { json } = require("express");
var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const app = express();
const ejs = require("ejs");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

/* GET home page. All events */
router.get("/", async (req, res, next) => {
  // Hier komt de fetch
  fetch(
    `https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&locale=*`
  )
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

// router.get("/list", async (req, res, next) => {
//   const allEvents = await loadAllEventData();

//   const toonEvents = getMyEvents(allEvents);
//   console.log(toonEvents);
//   res.render("list", { allEvents: toonEvents });
// });

// const getMyEvents = (allEvents) => {
//   let eventsName = [];
//   allEvents.map((eventsNameMap) =>
//     eventsName.push({ name: eventsNameMap.name })
//   );
//   return eventsName;
// };

module.exports = router;
