var firebaseConfig = {
    apiKey: "AIzaSyCoHPOkqCnKdj6rrm7t1i9qHa7zFDTZghs",
    authDomain: "jamilla1.firebaseapp.com",
    databaseURL: "https://jamilla1.firebaseio.com",
    projectId: "jamilla1",
    storageBucket: "",
    messagingSenderId: "550292787903",
    appId: "1:550292787903:web:d5825ea6eb777585"
  };
  
  firebase.initializeApp(firebaseConfig);


let database = firebase.database()
let scoreboard = { }
let chase=document.getElementById("chase")


let direction_h
let direction_v

let x
let y

let u
let b

let p
let j

let m
let g

let time
let score
let level
let enemyR
let speed_h

function setup() {
  speed_h=2
  level=1
  direction_h=1
  direction_v=1
  createCanvas(windowWidth, windowHeight)
  x=500
  y=20
  
  u=20
  b=20
  
  p=[20,200,10]
  j=[200,70,300]
  
  m=40
  g=20                          
  
  score=0
  
  enemyR = 60
  
  time=100
}

function draw() {
  background(255,118,242);
  if (time > 0) {
  textSize(20)
  text("Score: " + score,70,20);
  text("Time: " + time.toFixed(.00001),70,40);
  time= time - .1
  fill(153,115,255)

  circle(u,b,50)
  circle(x,y,70);
  u= u+5*direction_h
  b= b+4*direction_v

if (touches.length == 0)   {
  if(keyIsDown(LEFT_ARROW)) {
    x = x - 10
  }
  if(keyIsDown(RIGHT_ARROW)) {
    x = x + 10
  }
  if(keyIsDown(UP_ARROW)) {
    y = y - 10
  }
  if(keyIsDown(DOWN_ARROW)) {
    y = y + 10
  }
}
   else { 
	x = touches[0].x
	y = touches[0].y
}




  if ( u >width || u < 0) {
    direction_h= direction_h * -1
  }
  if (b>height || b < 0) {
    direction_v= direction_v * -1
  } 
  if (dist(x,y,u,b)< 70+ 50) {
      score= score +1
  }
  

    
  for (i=0; i<3; i=i+1) {
    if (dist(x,y,p[i],j[i])< 60+ 50) {
      score= score - 4
  }
   square(p[i],j[i],enemyR);
   p[i]= p[i]+speed_h*direction_h
   j[i]= j[i]+3*direction_v

  }
  if (score > 100 && level ==1 ) {
    p= [600,50,30]
    enemyR= enemyR + 30
    speed_h=speed_h + 5
    level = 2
  }
  if (score > 200 && level ==2 ) {
    p= [600,400,30]
    enemyR= enemyR + 30
    speed_h=speed_h + 8
    level = 3
  }
  if (score > 300 && level ==3 ) {
    p= [700,400,30]
    enemyR= enemyR + 30
    speed_h=speed_h + 10
    level = 4
  }
  if (score > 400 && level ==4 ) {
    p= [600,600,30]
    enemyR= enemyR + 30
    speed_h=speed_h + 14
    level = 5
  }
}
    else{
      chase.innerHTML= "Name? <input id=type><button onclick='restart()'>Restart</button><button onclick='generate_alltime_leaderboard()'>All-time leaderboard</button>"
      noLoop()
    }
  
}



  function restart() { 
        let type = document.getElementById("type")
		name = type.value 
        database.ref(name).set(score)
    
		if (name != "") { 
			scoreboard[name] = score
		}
        alert("Scoreboard:"+JSON.stringify(scoreboard,null,1)) 
		time = 120
		score = 0
		loop()
		chase.innerHTML = ""
  generate_leaderboard()
} 

function generate_leaderboard() {
  scores = Object.values(scoreboard)
  names = Object.keys(scoreboard)
  
  if (scores.length >= 3) {
    let leaderboard = { }
    for (i=0; i<3; i=i+1) {
      max = Math.max(...scores)
      index = scores.indexOf(max)
      leaderboard[names[index]] = max
      names.splice(index,1)
      scores.splice(index,1)
    }
    alert("Leaderboard: " + JSON.stringify(leaderboard,null,1))
  }
	}
		
		function generate_alltime_leaderboard() {
			let alltime_leaderboard = { }
			database.ref().orderByValue().limitToLast(3).on("value", function(snapshot) {
				snapshot.forEach(function(data) {
				alltime_leaderboard[data.key] = data.val()
				});
		    	});
			if (Object.values(alltime_leaderboard).length > 0) {
			  alert("All-time leaderboard: " + JSON.stringify(alltime_leaderboard,null,1))
		    	}
		}

		generate_alltime_leaderboard()
		
