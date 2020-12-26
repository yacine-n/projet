window.onload = function() {
  var canvas = document.createElement("canvas");
  var affichage = document.createElement("div");

  var tige = document.createElement("div");
  var pieds = document.createElement("div");

  tige.id = "tige";
  pieds.id = "pieds";
  pieds.innerHTML = "GAME TV"
  //affichage.style.border = "2px solid black";
  //affichage.height = 80;
  affichage.id = "affichage";
  canvas.width = 900;
  canvas.height = 600;
  //canvas.style.border = "2px solid black";

 document.body.appendChild(affichage);
 document.body.appendChild(canvas);
 document.body.appendChild(tige);
 document.body.appendChild(pieds);

 var canvasWidth = canvas.width;
 var canvasHeight = canvas.height;
//définit l'evenement pour diriger le serpent et sa fonction
document.addEventListener("keydown", interaction);

 //recupere le contexte de notre canvas
 var ctx = canvas.getContext("2d");

 var collision = false; //par défaut c'est false

 var score = 0;
 var vie = 3;
 var niveau = 0;

 var codeTouche = 0;

 var pause = false;

 //propriétés serpent
 var colorSerp = "blue";
 var tailleSerp = 15;

 var nombreBlockParWidth = canvasWidth/tailleSerp;
 var nombreBlockParHeight = canvasHeight/tailleSerp;

 var xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
 var ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
 var deplX = 0;
 var deplY = 0;
 var tailleBody = 5; //la taille du corps du serpent
 var bodySerp = []; //les coordonnées du corps du serpent

 //propriétés pomme
 var colorPomme = "red";
 var xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
 var yPomme = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
 var rayonPomme = tailleSerp/2;
 var tempsPomme = 0;
 var tempsMaxPomme = 100;

 //propriétés bonus
 var colorBonus = "green";
 var xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
 var yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
 var tempsBonus = 0;
 var afficheBonus = false;

//la fonction dessinerSerpent va se refaire au bout d'un certain nombre de temps
var intervalID = setInterval(game, 100);
affiche();
 //dessinerSerpent();

//fonction qui lance le jeu, dessinant le comportement du jeu: le dessin du serpent d'abord,
function game() {
  dessinerSerpent();
  dessinerPomme();
  détectionCollision();
  verifMangerPomme();
  gestionVieSerpent();
  //dessinerbonus()
  gestionAffichageBonus();
}

//fonction qui gére la gestion de la position du serpent
function gestionPositionSerpent() {
  xSerp = xSerp + deplX*tailleSerp;
  ySerp = ySerp + deplY*tailleSerp;
  bodySerp.push({x:xSerp,y:ySerp}); //permet d'ajouter un élément à un tableau
  while (bodySerp.length > tailleBody) {
    bodySerp.shift(); //permet d'enlever un élément cad l'elément qui se trouve à la position 0
  }
}

 //fonction qui dessine le serpent
 function dessinerSerpent() {
   ctx.clearRect(0,0, canvasWidth, canvasHeight);
   gestionPositionSerpent();
   ctx.fillStyle = colorSerp;
   for (var i = 0; i < bodySerp.length; i++) {
     ctx.fillRect(bodySerp[i].x, bodySerp[i].y, tailleSerp-1, tailleSerp-1);
   }

   //ctx.fillRect(xSerp, ySerp, tailleSerp, tailleSerp);
 }

//fonction qui dessine la Pomme
function dessinerPomme() {
  ctx.beginPath(); //ouvre le flux,pour écrire dans le canvas
  ctx.arc(xPomme+rayonPomme, yPomme+rayonPomme, rayonPomme, 0, 2*Math.PI); //crée un arc, avec 0 l'angle de départ
  ctx.fillStyle = colorPomme; //définit la couleur du pomme
  ctx.fill(); // permet d'attacher notre pomme à notre canvas
  ctx.font = "15px Arial";
  ctx.fillStyle = "green";
  ctx.fillText("V", xPomme+3, yPomme+3);
  ctx.closePath(); //ferme le flux ouvert
}

//fonction qui dessine le Bonus
function dessinerbonus() {
  ctx.font = "18px Arial";
  /*ctx.fillStyle = "red";
  ctx.fillRect(xBonus ,yBonus, tailleSerp,tailleSerp);*/
  ctx.fillStyle = colorBonus;
  ctx.fillText("❤", xBonus+1, yBonus+14);
}

//fonction qui initialise la position de la Pomme
function initPositionPomme() {
  xPomme = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  yPomme = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;

}
//fonction qui initialise la position du serpent
function initPositionSerpent() {
  xSerp = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  ySerp = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
}
//fonction qui initialise la position du bonus
function initPositionBonus() {
  xBonus = Math.trunc(Math.random()*nombreBlockParWidth)*tailleSerp;
  yBonus = Math.trunc(Math.random()*nombreBlockParHeight)*tailleSerp;
}

//détection de collision: 2 types de collisions
function détectionCollision() {
  //cas1: le serpent se mord
if (bodySerp.length>5) {
  for (var i = 0; i < bodySerp.length-1; i++) {
  if (bodySerp[i].x == bodySerp[bodySerp.length-1].x &&
      bodySerp[i].y == bodySerp[bodySerp.length-1].y) {
        collision = true;
        break;
      }
  }
}
  //cas2: le serpent sort du canvas
if (xSerp < 0 || ySerp < 0 || xSerp+tailleSerp > canvasWidth || ySerp+tailleSerp > canvasHeight) {
  collision = true;
}

}

//fonction qui vérifie si on a mangé la Pomme
function verifMangerPomme() {
  if (xPomme == xSerp && yPomme == ySerp) {
    initPositionPomme();
    score += 10 +3*bodySerp.length;
    niveau = Math.trunc(score/300);
    tailleBody += 5;
    affiche();
  }else if (tempsPomme++ > tempsMaxPomme) {
    initPositionPomme();
    tempsPomme = 0;
  }
}

//fonction qui affiche le score
function affiche() {
  var message = "Score : "+score+" | Vie : "+vie+" | Niveau : "+niveau;
  document.getElementById("affichage").innerHTML = message;
}

//fonction qui gére la vie du serpent
function gestionVieSerpent() {
  if (pause == true) {
    collision = false;
    return;
  }
  if (collision) {
    vie--;
    collision = false;
    tailleBody = 5;
    initPositionPomme();
    initPositionSerpent();
    affiche();
    bodySerp = [bodySerp[bodySerp.length-1]];
    if (vie == 0) {
      ctx.fillStyle = "#fff";
      ctx.font = "40px Arial";
      ctx.fillText("GAME OVER", canvasWidth/2-130, canvasHeight/2);
      ctx.font = "15px Arial";
      ctx.fillText("Score : "+score+" point(s)", canvasWidth/2-130, canvasHeight*2/3);
      ctx.fillText("Appuyer sur la touche entrée du clavier pour rejouer ! ", canvasWidth/2-130, canvasHeight*3/4);
      clearTimeout(intervalID); //permet d'effacer la fonction qui se répéte à chaque fois
    }
  }
}

//fonction qui sert à gérer l'affichage du bonus
function gestionAffichageBonus() {
  if (tempsBonus++ > 50) {
    tempsBonus = 0;
    //on peut affiicher le bonus
    if (Math.random() > 0.7) {
      //on va afficher le bonus
      initPositionBonus();
      afficheBonus = true;
    } else {
      //on ne va pas afficher le bonus
      xBonus = 1000;
      yBonus = 800;
      afficheBonus = false;
    }
  }
  if (afficheBonus) {
    dessinerbonus();
  }
  //tester si le serpent a mangé le bonus
  if (xSerp == xBonus && ySerp == yBonus) {
    vie++;
    affiche();
    xBonus = 1000;
    yBonus = 800;
    afficheBonus = false;
  }
}



 //fonction qui dirige le dessinerSerpent
 function interaction(event) {
   console.log(event.keyCode);
   switch (event.keyCode) {
     case 37:
     pause = false;
       if (codeTouche == 39) {
         break;
       }
       //touche vers la gauche
       deplX = -1;
       deplY = 0;
       codeTouche = event.keyCode;
       break;

       case 38:
       pause = false;
          if (codeTouche == 40) {
            break;
          }
         //touche vers la haut
         deplX = 0;
         deplY = -1;
         codeTouche = event.keyCode;
         break;

         case 39:
         pause = false;
           if (codeTouche == 37) {
             break;
           }
           //touche vers la droite
           deplX = 1;
           deplY = 0;
           codeTouche = event.keyCode;
           break;

           case 40:
           pause = false;
             if (codeTouche == 38) {
                break;
             }
             //touche vers le bas
             deplX = 0;
             deplY = 1;
             codeTouche = event.keyCode;
             break;

             case 32:
               //touche pause
               pause = true;
               deplX = 0;
               deplY = 0;
               break;

               case 13:
                 //touche entrée rejouer
                 document.location.reload(true);
                 break;
     default:

   }

 }




}
