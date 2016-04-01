





/*
let me recap.
i want to move from one vectorA around the sphere to a vectorB

first i just tweened the position form one vector to another, which
then is moving on a straight line.
but i would rather have it in a orbit or round way.

so now i added the camera as a child to an object inside the sphere.
when i'm rotating this object the camera orbits nicely around the sphere. (thx to @bai for this approach).

problem now:
how to i orbit with this rotation from a vectorA to a vectorB.
how do i know how i have to rotate the object inside the sphere to get there?

lunch now!
back from lunch.

what about ermm... normalize the vector from the point i want to look at and rotate to that position(?)
let's try that
that didn't work. because i don't have a clue how to change the rotataion of the camera-stand-object to point at a certain vector.
now i'm using the lookAt value to look at a vector which works fine.
would still be nice to know how it would work with pure vectors

*/


var camera, scene, renderer, controls, stats;
var meshBox, meshSphere, geometryBox, geometrySphere, meshSphereIndicator;

const facesChosenArray = [];
const pointsChosenArray = [];
var countTweens = 0;
facesChosenArray.push([250, '0xff0000']);
facesChosenArray.push([350, '0x00ff00']);
facesChosenArray.push([440, '0xff00ff']);
facesChosenArray.push([50,  '0xffff00']);
facesChosenArray.push([550, '0x00ffff']);
facesChosenArray.push([640, '0x0000ff']);

init();
addLights();
addMeshes();
// setupTween(195, 142);
animate();


function init() {  
  
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
  // camera.position.set(0, 0, 600);

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );

  document.body.appendChild( renderer.domElement );

  // STATS
  stats = new Stats();
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.zIndex = 100;
  document.body.appendChild(stats.domElement);
  
  // CONTROLS
  //controls = new THREE.OrbitControls(camera, renderer.domElement);

  window.addEventListener( 'resize', onWindowResize, false );
  
}


function addMeshes() {
  const material = new THREE.MeshPhongMaterial( {
    color: 0xffffff,
    shading: THREE.FlatShading,
    vertexColors: THREE.FaceColors,
    // transparent: true
    // wireframe: true
  } );
  
  const materialSimple = new THREE.MeshPhongMaterial( {
    color: 0xff00ff,
    shading: THREE.FlatShading,
    // vertexColors: THREE.FaceColors,
    // transparent: true
    // wireframe: true
  } );

  const materialWired = new THREE.MeshPhongMaterial( {
    color: 0x00ffff,
    shading: THREE.FlatShading,
    // vertexColors: THREE.FaceColors,
    // transparent: true
    wireframe: true
  } );


  
  geometrySphere = new THREE.SphereGeometry( 100, 20, 20 );;
  meshSphere = new THREE.Mesh( geometrySphere, material );
  meshSphere.position.set(-100,-100,-100);
  scene.add( meshSphere );
  changeVertexLength(geometrySphere);
 
  console.dir(meshSphere);

  geometrySphereSimple = new THREE.SphereGeometry( 3, 3, 3 );
  geometryIndicator = new THREE.CylinderGeometry( 5, 5, 20, 32 );
  
  
  geometrySphere.faces.forEach((face, index) => {
    face.color.setHex(0xffcc00);
  });
  
  
  function createVectorSpheres(vector, col) {
    // console.info('createVectorSpheres', vector, col);
    

    for ( let i = 0; i <= 5; i++ ) {
      const vec = new THREE.Vector3().copy(vector);
      meshSphereSimple = new THREE.Mesh( geometrySphereSimple.clone(), materialWired );
      
      geometrySphereSimple.faces.forEach((face, index) => {
// console.log(col);
        face.color.setHex(col);
      });
      geometrySphereSimple.colorsNeedUpdate = true;
      
      vec.multiplyScalar(i);
      // console.log(vec);
      meshSphereSimple.position.copy(vec);
      meshSphere.add( meshSphereSimple );
    }

  };
  
  facesChosenArray.forEach((faceArray, index) => {
    // console.log(faceArray, index);
    
    const val = faceArray[0];
    const col = faceArray[1];
    
    const face = geometrySphere.faces[val];
    const faceVectorFirst = face['a'];
    const vector = geometrySphere.vertices[faceVectorFirst];
    pointsChosenArray.push(faceVectorFirst);
    
    face.color.setHex(col);

    // console.log( vector, col );
    
    createVectorSpheres(vector, col);
  });
  geometrySphere.colorsNeedUpdate = true;
  
  console.log(meshSphere.position);
  
  const vecOriginal = new THREE.Vector3().copy(
    geometrySphere.vertices[195]
  );
  const vec = new THREE.Vector3().copy(
    geometrySphere.vertices[195]
  );
  // const vecNormalized = new THREE.Vector3().copy(
  //   geometrySphere.vertices[142]
  // );
  
  // --- indicator placed in the middle of the sphere to control camera and movement ----------------
  meshSphereIndicator = new THREE.Mesh( geometryIndicator, materialSimple );
  // vec.multiplyScalar(10);//.add(meshSphere.position);
  // meshSphereIndicator.position.copy(vec);
  // meshSphereIndicator.position.set(0,0,0);
  meshSphere.add( meshSphereIndicator );

  meshSphereIndicator.add( camera );

  // --- indicator or movement among point on the world -------------------------
  const meshMovementIndicator = new THREE.Mesh( geometrySphereSimple, materialSimple );
  meshSphereIndicator.add( meshMovementIndicator );
  meshMovementIndicator.position.set(0,0,100); //z if width of sphere to be on the surface

  


  
//  camera.position.copy(vecOriginal.multiplyScalar(3));
  camera.position.set(0,0,160);
  // camera.lookAt(meshSphere.position);
  camera.lookAt(new THREE.Vector3(0,0,0));
  // console.dir(vecNormalized);

  // meshSphereIndicator.rotation.copy(vecNormalized);
  meshSphereIndicator.lookAt(vecOriginal);
}


// function setupTween(vertFrom, vertTo) {
  
//   const positionUp = {z: 400};
//   const positionDown = {z: 160};

//   const angle = new THREE.Vector3().copy(
//     geometrySphere
//       .vertices[vertFrom]
//   );
  
//   const angleNext = new THREE.Vector3().copy(
//     geometrySphere
//       .vertices[vertTo]
//   );
  
//   function updateAngle() {
// // console.log('up');
//     meshSphereIndicator.lookAt(angle);    
//   };

//   const tweenUp =       new TWEEN.Tween(camera.position).to(positionUp, 2500);
//   const tweenMoveNext = new TWEEN.Tween(angle).to(angleNext, 5000);
//   const tweenDown =     new TWEEN.Tween(camera.position).to(positionDown, 2500);
  
// //   tweenUp.easing(TWEEN.Easing.Elastic.Out)
// //   tweenMoveNext.easing(TWEEN.Easing.Back.InOut)
// //   tweenDown.easing(TWEEN.Easing.Bounce.Out)

// //   tweenUp.chain(tweenMoveNext);
// //   tweenMoveNext.chain(tweenDown);
  
// //   tweenMoveNext.onUpdate(updateAngle);
  
// //   tweenUp.start();
    
//   // tweenUp.easing(TWEEN.Easing.Elastic.Out)
//   // tweenMoveNext.easing(TWEEN.Easing.Cubic.InOut)
//   // tweenDown.easing(TWEEN.Easing.Bounce.Out)

//   tweenUp.chain(tweenDown);

//   tweenMoveNext.onUpdate(updateAngle);

//   tweenUp.start();
//   tweenMoveNext.start();
  
// }

function setupTween(vertFrom, vertTo) {
  
  const positionUp = {z: 400};
  const positionDown = {z: 160};

  const angle = new THREE.Vector3().copy(
    geometrySphere
      .vertices[vertFrom]
  );
  
  const angleNext = new THREE.Vector3().copy(
    geometrySphere
      .vertices[vertTo]
  );
  
  function updateAngle() {
// console.log('up');
    meshSphereIndicator.lookAt(angle);    
  };

  const tweenUp =       new TWEEN.Tween(camera.position).to(positionUp, 2500);
  const tweenMoveNext = new TWEEN.Tween(angle).to(angleNext, 5000);
  const tweenDown =     new TWEEN.Tween(camera.position).to(positionDown, 2500);
  
//   tweenUp.easing(TWEEN.Easing.Elastic.Out)
//   tweenMoveNext.easing(TWEEN.Easing.Back.InOut)
//   tweenDown.easing(TWEEN.Easing.Bounce.Out)

//   tweenUp.chain(tweenMoveNext);
//   tweenMoveNext.chain(tweenDown);
  
//   tweenMoveNext.onUpdate(updateAngle);
  
//   tweenUp.start();
    
  // tweenUp.easing(TWEEN.Easing.Elastic.Out)
  // tweenMoveNext.easing(TWEEN.Easing.Cubic.InOut)
  // tweenDown.easing(TWEEN.Easing.Bounce.Out)

  tweenUp.chain(tweenDown);

  tweenMoveNext.onUpdate(updateAngle);

  tweenUp.start();
  tweenMoveNext.start();
  
}

function createTween() {
  let currentTweens = TWEEN.getAll();
//console.info(currentTweens.length);
  
  if (0 === currentTweens.length) {
    
    let to;
    const from = pointsChosenArray[countTweens];

console.info( pointsChosenArray.length, countTweens );

    if (countTweens < pointsChosenArray.length -1) {
      countTweens++;
      to = pointsChosenArray[countTweens];
    } else {
      to = pointsChosenArray[0];
      countTweens = 0;
    }
    
console.warn( from, to );
    
    setupTween(from, to);
  }
  
}


function changeVertexLength(geom) {
// console.info('changeVertexLength!');
 
  const len = geom.vertices.length;
  for ( let i = 0; i < len; i++ ) {
    let vert = geom.vertices[ i ];
    const vertL = vert.length();
    const random = Math.random() * 20;

    // vert.setLength(vertL + random);
  }
  
  geom.verticesNeedUpdate = true;
  
}



function addLights() {
  
	const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.2 );
  hemiLight.position.set( 0, 500, 0 );
  scene.add( hemiLight );

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(300, 400, 150);
  scene.add(light);

}


function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}


function animate() {

  requestAnimationFrame( animate );
  
  // controls.update();
  stats.update();
  
  // tweens
  createTween();
  TWEEN.update();

  // var timer = new Date().getTime() * 0.0005; 
  // camera.position.x = Math.floor(Math.cos( timer ) * 200);
  // camera.position.z = Math.floor(Math.sin( timer ) * 200);
  
  // meshSphere.rotation.y += 0.005;
  // meshSphereIndicator.rotation.x += 0.005;
  // meshSphereIndicator.rotation.y += 0.005;
  
  renderer.render( scene, camera );

}
