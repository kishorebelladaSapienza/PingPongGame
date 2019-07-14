var renderer, scene, camera, pointLight, spotLight

var fieldWidth = 400, fieldHeight = 200

var paddleWidth, paddleHeight, paddleDepth, paddleQuality
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 3

var ball, paddle1, paddle2
var ballDirX = 1, ballDirY = 1, ballSpeed = 2

var score1= 0, score2 = 0

var maxScore = 7

var difficulty = 0.2

var ballTexture = new THREE.ImageUtils.loadTexture("./img/ball/ball3.jpg")
var paddleTexture = new THREE.ImageUtils.loadTexture("./img/paddle/paddle1.jpg")
var planeColor = 0x4BD121



function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}




function setup() {
    document.getElementById("winnerBoard").innerHTML = "First to " + maxScore + " wins!"

    score1 = 0
    score2 = 0

    document.getElementById("userName").innerHTML = "Name of Player : "+ (getUrlVars()["firstName"] + " "+ getUrlVars()["lastName"])
    getBackGrounds()
    createScene()

    draw()
}

function createScene() {
    var WIDTH = window.innerWidth
    var HEIGHT = window.innerHeight 

    var VIEW_ANGLE = 50
    var ASPECT = WIDTH / HEIGHT
    var NEAR = 0.1
    var FAR = 10000

    var c = document.getElementById("gameCanvas")

    renderer = new THREE.WebGLRenderer()
    camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR
    )

    scene = new THREE.Scene()

    scene.add(camera)

    camera.position.z = 320

    renderer.setSize(WIDTH, HEIGHT)

    c.appendChild(renderer.domElement)

    var planetWidth = fieldWidth
    var planetHeight = fieldHeight
    var planeQuality = 10

    var paddle2Material = new THREE.MeshLambertMaterial({
        color: 0x1B32C0
    })

    var paddle1Material = new THREE.MeshPhongMaterial({map:paddleTexture})

    var planeMaterial = new THREE.MeshLambertMaterial({
        color: planeColor
    })

    var tableMaterial = new THREE.MeshLambertMaterial({
        color: 0x111111
    })

    var pillarMaterial = new THREE.MeshLambertMaterial({
        color: 0x534d0d
    })

    var groundMaterial = new THREE.MeshLambertMaterial({
        color: 0x888888
    })

    var plane = new THREE.Mesh(
        new THREE.PlaneGeometry(
            planetWidth * 0.95,
            planetHeight,
            planeQuality,
            planeQuality),
            planeMaterial
    )

    scene.add(plane)
    plane.receiveShadow = true

    var table = new THREE.Mesh(
        new THREE.CubeGeometry(
            planetWidth * 1.05,
            planetHeight * 1.03,
            100,
            planeQuality,
            planeQuality,
            1),
            tableMaterial
    )

    table.position.z = -51
    scene.add(table)
    table.receiveShadow = true

    var radius = 5
    var segments = 6
    var rings = 6

     var sphereMaterial = new THREE.MeshPhongMaterial({
        map: ballTexture
    })

    ball = new THREE.Mesh(
        new THREE.SphereGeometry(
            radius,
            segments,
            rings),
            sphereMaterial
    )

    scene.add(ball)

   // ball.material.mesh = THREE.ImageUtils.loadTexture("./img/ball3.jpg");
    ball.position.x = 0
    ball.position.y = 0
    ball.position.z = radius
    ball.receiveShadow = true
    ball.castShadow = true
   // console.log(ball)
    paddleWidth = 10
    paddleHeight = 30
    paddleDepth = 10
    paddleQuality = 1

    paddle1 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
            paddle1Material
    )

   // scene.add(paddle1)
    paddle1.receiveShadow = true
    paddle1.castShadow = true

    paddle2 = new THREE.Mesh(
        new THREE.CubeGeometry(
            paddleWidth,
            paddleHeight,
            paddleDepth,
            paddleQuality,
            paddleQuality,
            paddleQuality),
            paddle2Material
    )


    scene.add(paddle2)
    paddle2.receiveShadow = true
    paddle2.castShadow = true

    paddle1.position.x = -fieldWidth / 2 + paddleWidth
    paddle2.position.x = fieldWidth / 2 - paddleWidth

    paddle1.position.z = paddleDepth
    paddle2.position.z = paddleDepth

    for (var i = 0; i < 5; i++) {
        var backdrop = new THREE.Mesh(
            new THREE.CubeGeometry(
                30,
                30,
                300,
                1,
                1,
                1),
                pillarMaterial
        )

        backdrop.position.x = -50 + i * 100
        backdrop.position.y = 230
        backdrop.position.z = -30
        backdrop.castShadow = true
        backdrop.receiveShadow = true
        scene.add(backdrop)
    }

    for(var i = 0; i < 5; i++) {
        var backdrop = new THREE.Mesh(
            new THREE.CubeGeometry(
                30,
                30,
                300,
                1,
                1,
                1),
                pillarMaterial
        )

        backdrop.position.x = -50 + i * 100
        backdrop.position.y = -230
        backdrop.position.z = -30
        backdrop.castShadow = true
        backdrop.receiveShadow = true
        scene.add(backdrop)
    }

    var ground = new THREE.Mesh(
        new THREE.CubeGeometry(
            1000,
            1000,
            3,
            1,
            1,
            1),
            groundMaterial
    )

    ground.position.z = -132
    ground.receiveShadow = true
    scene.add(ground)

    pointLight = new THREE.PointLight(0xF8D898)

    pointLight.position.x = -1000
    pointLight.position.y = 0
    pointLight.position.z = 1000
    pointLight.intensity = 2.9
    pointLight.distance = 10000
    scene.add(pointLight)

    spotLight = new THREE.SpotLight(0xF8D898)
    spotLight.position.set(0, 0, 460)
    spotLight.intensity = 1.5
    spotLight.castShadow = true
    scene.add(spotLight)

    renderer.shadowMapEnabled = true


    addwheels()
    console.log(paddle1)

}

function addwheels()
{

    var wheelRadius = 3.5;
    var wheelThickness = 0.8625;
    var wheelSegments = 10;

    var wheelGeometry = new THREE.CylinderGeometry(
        wheelRadius,     // top radius
        wheelRadius,     // bottom radius
        wheelThickness,  // height of cylinder
        wheelSegments);
    var wheelMaterial = new THREE.MeshPhongMaterial({map:paddleTexture});
    var wheelPositions = [
	  [ -paddleHeight/3 ,(paddleWidth) ,  2 ],
      [ paddleHeight/3,-(paddleWidth),  2 ],
      [ paddleHeight/3,(paddleWidth) , 2],
      [ -paddleHeight/3,-(paddleWidth), 2],
     ];
    count=0
    var wheelMeshes = wheelPositions.map((position) => {
      var mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      mesh.position.set(...position);
      mesh.rotation.z = Math.PI * .5;
      mesh.castShadow = true;
      mesh.name="wheel"+count
      count+=1
      paddle1.add(mesh);
      return mesh;
    });
    scene.add(paddle1)
}



function draw() {
    renderer.render(scene, camera)

    requestAnimationFrame(draw)

    ballPhysics()
    paddlePhysics()
    cameraPhysics()
    playerPaddleMovement()
    opponentPaddleMovement()
}

var rot=0.1;
function ballPhysics() {
    if(ball.position.x <= -fieldWidth / 2) {
        score2++
        document.getElementById("scores").innerHTML = score1 + "-" + score2
        resetBall(2)
        matchScoreCheck()
    }

    if(ball.position.x >= fieldWidth / 2) {
        score1++
        document.getElementById("scores").innerHTML = score1 + "-" + score2
        resetBall(1)
        matchScoreCheck()
    }

    if(ball.position.y <= -fieldHeight / 2) {
        ballDirY = -ballDirY
    }

    if(ball.position.y >= fieldHeight / 2) {
        ballDirY = -ballDirY
    }

    ball.position.x += ballDirX * ballSpeed
    ball.position.y += ballDirY * ballSpeed

    if(ballDirY > ballSpeed * 2) {
        ballDirY = ballSpeed * 2
    } else if(ballDirY < -ballSpeed * 2) {
        ballDirY = -ballSpeed * 2
    }

if (rot>100)
    rot=0.01
rot+=0.5
 ball.rotation.y = rot
 ball.rotation.z = rot

//console.log(rot)
}



function opponentPaddleMovement() {
    paddle2DirY = (ball.position.y - paddle2.position.y) * difficulty

    if(Math.abs(paddle2DirY) <= paddleSpeed) {
        paddle2.position.y += paddle2DirY
    } else {
        if(paddle2DirY > paddleSpeed) {
            paddle2.position.y += paddleSpeed
        } else if(paddle2DirY < -paddleSpeed) {
            paddle2.position.y -= paddleSpeed
        }
    }

    paddle2.scale.y += (1 - paddle2.scale.y) * 0.2
}

function playerPaddleMovement() {
    if(Key.isDown(Key.A)) {
        if(paddle1.position.y < fieldHeight * 0.45) {
            paddle1DirY = paddleSpeed * 0.5
        } else {
            paddle1DirY = 0
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2
        }
    } else if(Key.isDown(Key.D)) {
        if (paddle1.position.y > -fieldHeight * 0.45) {
            paddle1DirY = -paddleSpeed * 0.5
        } else {
            paddle1DirY = 0
            paddle1.scale.z += (10 - paddle1.scale.z) * 0.2
        }
    } else {
        paddle1DirY = 0
    }

    paddle1.scale.y += (1 - paddle1.scale.y) * 0.2
    paddle1.scale.z += (1 - paddle1.scale.z) * 0.2
    paddle1.position.y += paddle1DirY

    rotateWheel(paddle1)
}

function cameraPhysics() {
    spotLight.position.x = ball.position.x * 2
    spotLight.position.y = ball.position.y * 2

    camera.position.x = paddle1.position.x - 100
    camera.position.y += (paddle1.position.y - camera.position.y) * 0.05
    camera.position.z = paddle1.position.z + 100 + 0.04 * (-ball.position.x + paddle1.position.x)

    camera.rotation.x = -0.01 * (ball.position.y) * Math.PI / 180
    camera.rotation.y = -60 * Math.PI / 180
    camera.rotation.z = -90 * Math.PI / 180
}

function paddlePhysics() {
    if(ball.position.x <= paddle1.position.x + paddleWidth &&
        ball.position.x >= paddle1.position.x) {
            if(ball.position.y <= paddle1.position.y + paddleHeight / 2 &&
                ball.position.y >= paddle1.position.y - paddleHeight / 2) {
                    if(ballDirX < 0) {
                        paddle1.scale.y = 15
                        ballDirX = -ballDirX
                        ballDirY = paddle1DirY * 0.7
                    }
                }
        }

    if(ball.position.x <= paddle2.position.x + paddleWidth &&
        ball.position.x >= paddle2.position.x) {
            if(ball.position.y <= paddle2.position.y + paddleHeight / 2 &&
                ball.position.y >= paddle2.position.y - paddleHeight / 2) {
                    if(ballDirX > 0) {
                        paddle2.scale.y = 15
                        ballDirX = -ballDirX
                        ballDirY -= paddle2DirY * 0.7
                    }
                }
        }
}

function resetBall(loser) {
    ball.position.x = 0
    ball.position.y = 0

    if (loser == 1) {
        ballDirX = -1
    } else {
        ballDirX = 1
    }
    ballDirY = 1
}

var bounceTime = 0

function matchScoreCheck() {
    if(score1 >= maxScore) {
        ballSpeed = 0
        document.getElementById("scores").innerHTML = "Player wins!"

        document.getElementById("winnerBoard").innerHTML = "Refresh to play again"
        bounceTime++
        paddle1.position.z = Math.sin(bounceTime * 0.1) * 10
        paddle1.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10
        paddle1.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) * 10
    } else if(score2 >= maxScore) {
        ballSpeed = 0
        document.getElementById("scores").innerHTML = "CPU wins!"
        document.getElementById("winnerBoard").innerHTML = "CPU wins! \n Refresh to play again"
        bounceTime++
        paddle2.position.z = Math.sin(bounceTime * 0.1) * 10
        paddle2.scale.z = 2 + Math.abs(Math.sin(bounceTime * 0.1)) * 10
        paddle2.scale.y = 2 + Math.abs(Math.sin(bounceTime * 0.05)) + 10
    }
}



function getBackGrounds()
{
    planeBoardColor = getUrlVars()["planeBoard"]    
    if(planeBoardColor == "green")
            planeColor = 0x4C9900
    else if(planeBoardColor == "red")
            planeColor = 0xFF0000
    else if(planeBoardColor == "blue")
            planeColor = 0x0000FF
    else if(planeBoardColor == "yellow")
            planeColor = 0xFFFF00
    else
            planeColor = 0x4BD121


    ballColorBoard = getUrlVars()["ballMesh"]    
    if (ballColorBoard!=undefined)
        ballTexture = new THREE.ImageUtils.loadTexture("./img/ball/"+ballColorBoard)

    paddleTextureMesh = getUrlVars()["paddleMesh"]    
    if (paddleTextureMesh!=undefined)
        paddleTexture = new THREE.ImageUtils.loadTexture("./img/paddle/"+paddleTextureMesh)

return
}

function rotateWheel(paddleObject)
{

    for(s=0;s<4;s++)
    {

        wheelObject = paddleObject.getChildByName("wheel"+s)
        last_rot = wheelObject.rotation.x
        last_rot+=0.04
        if (last_rot>15)
            last_rot=0
        wheelObject.rotation.x=last_rot;
        }
    return;
}