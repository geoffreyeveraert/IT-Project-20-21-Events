const { json } = require("express");
var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const app = express();
const ejs = require('ejs');
//let ejs = require("ejs");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

const keyword = 'bananaSplit';
const url = `https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&keyword=${keyword}&locale=*`;

async function getapi(url) {

  // Storing response 
  const response = await fetch(url);

  // Storing data in form of JSON 
  var data = await response.json();
}
getapi(url);

/* GET home page. */
router.get("/", async (req, res, next) => {
  // Hier komt de fetch
  fetch(url)
    .then((response) => {
      if(!response.ok){
        switch(response.status){          
          case 400:
            console.log('Er is een lokale error opgetreden')
            break;

          case 404:
            console.log('De pagina kan niet gevonden worden');
            break;
      
          case 500:
            console.log('Er is een error op de server opgetreden');
            break;
      
          default:
            console.log(`Er is een ${response.status} status fout opgetreden.`);
            break;
        }
      }
      else{
        return response.json();
      }
    })
    .then((json) => {
      if(json.page.totalElements === 0){
        res.render("index", {result: "Geen resultaten beschikbaar"})
      }
      else{
        res.render("index", { result: JSON.stringify(json._embedded.events) })
      }
    })
    .catch((e) => console.error(e));
});

router.get('/list', async (req, res, next) => {
  const allEvents = await loadAllEventData();

  const toonEvents = getMyEvents(allEvents)
  res.render('list', { allEvents: toonEvents });
});

const loadAllEventData = async () => {
  let json;
  let response = await fetch('https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&locale=*');
  console.log(response.status);
  json = await response.json();
  let event = json._embedded.events;


  return event;
}

const getMyEvents = (allEvents) => {
  let eventsName = [];
  allEvents
    .map(eventsNameMap =>
      eventsName.push({ name: eventsNameMap.name }
      )
    )
  return eventsName;
}

module.exports = router;
