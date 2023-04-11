var Cityburn;
var Hatch;
var Boycott;
var Got_Heroin;

function preload(){
  Cityburn = loadFont('cityburn.ttf');
  Hatch = loadFont('Hatch.ttf');
  Boycott = loadFont('BOYCOTT_.TTF');
  Got_Heroin = loadFont('Got_Heroin.ttf');
}

// let lastLogTime = 0; // stocke le moment où la dernière exécution a eu lieu
let finalState = false;
let circleAllowed = true;
let animAlmostFinished = 25000;
let circleClicked = false;
let wordsBecomeCrazy = false;
let wordsFlashing = false;
var swarm = [];
var friction = 0.999;
var swarmCount = 80;

var avoidRadius = 60;
var avoidStrength = 0.02;

var fadeInDuration = 1000; // Durée de l'effet "fade in" en millisecondes
var fadeInStartTime; // Temps de début de l'effet "fade in"
var fadeInEndTime; // Temps de fin de l'effet "fade in"
var fadeInAlpha = 0; // Alpha (transparence) du cercle "fade in"

// Centre du cercle
var circleX = 720 / 2;
var circleY = 576 / 2;

// Force d'attraction
var attractionForce = 0;
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setup() {
  createCanvas(720, 576);

  setTimeout(function () {
    for (var i = 0; i < swarmCount; i++) {
      var newA = new Agent(circleX + random(-50, 50), circleY + random(-50, 50), random(-1, 1), random(-1, 1));
      swarm.push(newA);
    }
  }, 0);

  // Définir les temps de début et de fin de l'effet "fade in"
  fadeInStartTime = millis() + 5000;
  fadeInEndTime = fadeInStartTime + fadeInDuration;
  
}

function draw() {
//   const currentTime = millis(); // récupère l'heure actuelle en millisecondes
//   if (currentTime - lastLogTime >= 30000) { // compare l'intervalle entre la dernière exécution et l'heure actuelle
    
//     circleClicked = false;
//     wordsBecomeCrazy = false;
//     wordsFlashing = false;
//     swarm = [];
//     friction = 0.999;
//     swarmCount = 80;
    
    
//     lastLogTime = currentTime; // met à jour le moment de la dernière exécution
//   }
  background(0, 20);

  // Dessiner le cercle "fade in" s'il est encore en cours d'animation
  if (millis() < fadeInEndTime || fadeInAlpha > 0) {
    // Calculer l'alpha (transparence) du cercle en fonction du temps écoulé depuis le début de l'effet "fade in"
    fadeInAlpha = map(millis(), fadeInStartTime, fadeInEndTime, 0, 255);

    // Dessiner le cercle avec la couleur et l'alpha appropriés
    if (circleAllowed) {
      fill(29, 161, 242, fadeInAlpha);
      noStroke();
      ellipse(circleX, circleY, 50, 50);
    }
    // Augmenter la force d'attraction
    if (millis() > fadeInEndTime) {
      attractionForce += 0.0001;
    }
  }

  // Dessiner les agents
  for (var agent of swarm) {
    let vert = color(0, 255, 0);
    let rouge = color(255, 0, 0);
    let lerpedColor;
  // la transition du rouge au vert se fait en fondu, pasde manière abrupte
    if(circleClicked || !wordsFlashing) {
      lerpedColor = lerpColor(rouge, vert, millis() / 2000); // temps de transition de 2 secondes
    } else {
      lerpedColor = lerpColor(vert, rouge, millis() / 2000); // temps de transition de 2 secondes
    }

fill(lerpedColor);

    
    agent.draw();
    agent.avoid();

    
    if(!wordsFlashing) {
      // Ajouter la force d'attraction si les mots ne clignotent pas encore
      var dx = circleX - agent.pos.x;
      var dy = circleY - agent.pos.y;
      var dist = sqrt(dx * dx + dy * dy);
      var angle = atan2(dy, dx);
      var attraction = map(dist, 0, width, attractionForce, 0);
      var ax = attraction * cos(angle);
      var ay = attraction * sin(angle);
      agent.applyForce(createVector(ax, ay));
      agent.move();
    } else if (!circleClicked){
      // Ajouter la force de répulsion si les boids se trouvent à l'extérieur du carré de confinement
      var repulsionForce = 0.2;
      var confinementSize = 230;
      var confinementX = width/2;
      var confinementY = height/2;

      if (agent.pos.x < confinementX - confinementSize/2) {
        agent.applyForce(createVector(repulsionForce, 0));
      } else if (agent.pos.x > confinementX + confinementSize/2) {
        agent.applyForce(createVector(-repulsionForce, 0));
      }

      if (agent.pos.y < confinementY - confinementSize/2) {
        agent.applyForce(createVector(0, repulsionForce));
      } else if (agent.pos.y > confinementY + confinementSize/2) {
        agent.applyForce(createVector(0, -repulsionForce));
      }
      agent.move2();
    } else if (circleClicked) {
      agent.move3();
    }
    
  }
  
  // Dessiner le texte
  //Tableau de mots 
  var words = ["climate", "AGW", "gas", "environment", "USHCN", "INDC", "energ", "temperature", "carbon", "pollution", "co2", "science", "politics", "health", "Earth", "emission", "weather", "fossil", "fuel", "sea-level rise", "COP", "UNFCCC", "IPCC", "PPM", "methane", "mitigation", "warm", "degre", "cool", "dioxid", "barrel", "oil", "antarct", "atmosphe", "glacier", "melt", "antarctica", "mediev", "palaeo", "turbin", "renew", "wind", "megawatt", "hydrogen", "reactor", "nuclear", "green", "cyclon", "storm", "hurrican", "scheme", "cultivar", "endanger", "coral", "phytoplankton", "ozon", "extinct", "bear", "polar", "vehicl", "electric", "car", "millenni", "adapt", "mercuri", "flood", "cloud", "ratif", "treati", "consensus", "alarmist", "develop", "recycle", "impact", "conservation", "forest", "EPA", "acid", "species", "simul", "EIA", "CLF", "GHG", "calcif", "RGGI", "NHTSA", "MGP", "NAAQ", "NDVI", "diseas", "VMT", "USHCN", "integrity"];

  setTimeout(function() {
    textSize(35);
    textFont("Cityburn");
    let interval = 1000;
    if (wordsBecomeCrazy && !circleClicked) {
      writeFlashingWords(words, 10);
    } else if (!wordsBecomeCrazy){
      writeWords(words, 10, interval);
    }
  }, 5000);
  
  setTimeout(function() {
    wordsBecomeCrazy = true;
    wordsFlashing = true;
  }, 20000); 
  if (wordsFlashing && !circleClicked) { // CURSEUR AU PASSAGE DE SOURIS SUR CERCLE
    if (mouseX > (720/2)-25 && mouseX < (720/2)+25 && mouseY > (576/2)-25 && mouseY < (576/2)+25) {
      cursor(HAND);
    } else {
      cursor(ARROW);
    }
  }
  if (wordsFlashing && circleClicked && wordsBecomeCrazy && animAlmostFinished == 25000) {
    let animAlmostFinished = millis();
  }
  if (millis() >= animAlmostFinished + 5000 ){
    circleAllowed = false;
  }
  if (millis() >= animAlmostFinished + 7000) {
    location.reload();
  }
}
let nextWordTime =0;
let wordIndex = 0;
let x = 0;
let y = 30;
  
function writeFlashingWords(words, spacing) {
  shuffle(words, true);
  x = 0;
  y = 30;
  for (let i = 0; i < words.length; i++) {
      let wordSelected = getRandomInt(0, 93);
      if (x > 720) {
        x = 0;
        y += 40; // Interligne
      }
      if (y < 413 && y > 163) { // Si dans le carré en hauteur
        if (x + textWidth(words[i]) > 235 && x < 485) { // Si dans le carré en largeur
          x = 485;
        }
      }
      fill (255,255,255);
      text(words[i], x, y);
      x += textWidth(words[i]) + spacing;
    }
}
function writeWords(words, spacing, intervalTime) {
  if(wordIndex >= 93) {
    wordIndex = 0;
    x = 0;
    y = 30;
  }
  
  for(let i = 0; i<93 ; i++) {
    let wordSelected = getRandomInt(0, 93);

    if (millis() > nextWordTime) {
      const wordWidth = textWidth(words[wordSelected]);
      if (x + wordWidth > 720) {
        x = 0;
        y += 40; // Interligne
      }
      if (y < 413 && y > 163) { // Si dans le carré en hauteur
        if (x + wordWidth > 235 && x < 485) { // Si dans le carré en largeur
          x = 485;
        }
      }
      fill (255,255,255);
      text(words[wordSelected], x, y);
      x += wordWidth + spacing;
      wordIndex++;
      if (millis() + 500 > ((millis()-10000)/25)) {
        nextWordTime = millis()  + 500 - ((millis()-10000)/20); // Délai de 1 millisecondes entre chaque mot
      } else {
        nextWordTime = millis()
      }
    }
  }
}

function mouseClicked() {
  var d = dist(mouseX, mouseY, circleX, circleY);
  if (d <= 50) {
    circleClicked = true;
  }
}
