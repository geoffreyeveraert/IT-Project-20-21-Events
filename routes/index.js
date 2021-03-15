const { json } = require("express");
var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const app = express();
const ejs = require('ejs');
//let ejs = require("ejs");

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


const url = 'https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&locale=*';

/*async function getapi(url) { 
    
  // Storing response 
  const response = await fetch(url); 
  
  // Storing data in form of JSON 
  var data = await response.json(); 
  console.log(data); 
} 
getapi(url);*/

/* GET home page. */
/*router.get("/", async (req, res, next) => {
  // Hier komt de fetch
  fetch(url)
    .then((response) => response.json())
    .then((json) =>
      res.render("index", { result: JSON.stringify(json._embedded.events) })
    )
    .catch((e) => console.error(e));
});*/

const loadAllEventData = async() => {
     let response = await fetch('https://app.ticketmaster.com/discovery/v2/events?apikey=lEQ7UsGACLAA2yaJ47Xt5hJPLK75W3Is&locale=*');
     let json = await response.json();
     let event = json._embedded.events;
     
  
  return event ;
}

const getMyEvents = (allEvents) =>{
  let eventsName = [];
  allEvents
      .map(eventsNameMap=>
          eventsName.push({name: eventsNameMap.name}
      )
  )
  return eventsName;       
}

(async () => {

  const allEvents = await loadAllEventData();

  const toonEvents = getMyEvents(allEvents)
  console.log(toonEvents);

  app.listen(8000, () => {
      console.log('Server started on port 8000');
  });

  app.get('/list',async(req,res) => {
    res.render('list',{ allEvents: toonEvents });
});
})();

module.exports = router;
