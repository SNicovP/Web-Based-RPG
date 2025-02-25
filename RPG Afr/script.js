let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

/*function findImage() {
  if (locations[0]) {
   locImage.src = "MedEvilTownSquare.png";
  }
}*/

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterName = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
//var locImage = newImage();
//locImage.src = findImage();
const weapons = [
  { name: 'stok', power: 5 },
  { name: 'mes', power: 30 },
  { name: 'klou hammer', power: 60 },
  { name: '308', power: 100 }
];
const monsters = [
  {
    name: "vlak vark",
    level: 2,
    health: 15
  },
  {
    name: "hyena",
    level: 8,
    health: 60
  },
  {
    name: "leeu",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "town square",
    "button text": ["Benader Smous", "Gaan na Grot", "Veg Leeu"],
    "button functions": [goStore, goCave, fightBoss],
    text: "Jy is in die kamp terrein. Jy sien n smous met n bord \"Winkel?\".",
    //image: "MedEvilTownSquare.png"
  },
  {
    name: "store",
    "button text": ["Koop WorsRoll (10 goud)", "Koop Wapen (30 goud)", "Terug Kamp Toe"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "Jy groet die Smous."
  },
  {
    name: "cave",
    "button text": ["Veg Vlakvark", "Veg Hyena", "Terug Kamp Toe"],
    "button functions": [fightSmall, fightBig, goTown],
    text: "Jy gaan by die grot in. Jy sien wilde diere."
  },
  {
    name: "fight",
    "button text": ["Val Aan", "Duik", "Ontrek"],
    "button functions": [attack, dodge, goTown],
    text: "Jy veg 'n wilde dier."
  },
  {
    name: "kill monster",
    "button text": ["Terug Grot Toe", "Terug Kamp Toe", "Terug Kamp Toe?"],
    "button functions": [goCave, goTown, easterEgg],
    text: "Die dier kreun soos dit sterf. Jy kry ervaring en vind goud."
  },
  {
    name: "lose",
    "button text": ["Weer?", "Weer?", "Weer?"],
    "button functions": [restart, restart, restart],
    text: "Jy het gesterf. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["Weer?", "Weer?", "Weer?"], 
    "button functions": [restart, restart, restart], 
    text: "Jy het die Leeu oorwin! Almal kan huis toe gaan! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Terug Kamp Toe"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "Jy het n gehuime spel gevind. Kies n nommer. Tien nommers gaan ewekansig gegenereer word. As jou mommer deel van die nommers is, wen jy!"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightBoss;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightSmall() {
  fighting = 0;
  goFight();
}

function fightBig() {
  fighting = 1;
  goFight();
}

function fightBoss() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterName.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "The " + monsters[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getMonsterAttackValue(monsters[fighting].level);
  if (isMonsterHit()) {
    monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  monsterHealthText.innerText = monsterHealth;
  if (health <= 0) {
    lose();
  } else if (monsterHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatMonster();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name;
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  goldText.innerText = gold;
  healthText.innerText = health;
  xpText.innerText = xp;
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 5; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}