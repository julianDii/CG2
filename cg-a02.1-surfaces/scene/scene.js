/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: scene
 *
 * A Scene is a depth-sorted collection of things to be drawn, 
 * plus a background fill style.
 *
 */



/* requireJS module definition */
define(["three", "util", "shaders", "BufferGeometry", "random", "band"],
    (function(THREE, util, shaders, BufferGeometry, Random, Band) {

        "use strict";

        /*
         * Scene constructor
         */
        var Scene = function(renderer, width, height) {

            // the scope of the object instance
            var scope = this;

            var rotIntervall;
            var ani;
            var walkInterval;
            var walkIntervall1;

            scope.renderer = renderer;
            scope.t = 0.0;

            scope.camera = new THREE.PerspectiveCamera( 66, width / height, 0.1, 2000 );
            scope.camera.position.z = 1000;
            scope.scene = new THREE.Scene();


            // Add a listener for 'keydown' events. By this listener, all key events will be
            // passed to the function 'onDocumentKeyDown'. There's another event type 'keypress'.
            document.addEventListener("keydown", onDocumentKeyDown, false);


            function onDocumentKeyDown(event){
                // Get the key code of the pressed key
                var keyCode = event.which;

                if(keyCode == 38){
                    console.log("cursor up");
                    scope.currentMesh.rotation.x += 0.05;
                    // Cursor down
                } else if(keyCode == 40){
                    console.log("cursor down");
                    scope.currentMesh.rotation.x += -0.05;
                    // Cursor left
                } else if(keyCode == 37){
                    console.log("cursor left");
                    scope.currentMesh.rotation.y += 0.05;
                    // Cursor right
                } else if(keyCode == 39){
                    console.log("cursor right");
                    scope.currentMesh.rotation.y += -0.05;
                    // Cursor up
                }
            };

            this.animate = function (state) {
                
                var lEye = scope.scene.getObjectByName("lefteye",true);
                var rEye = scope.scene.getObjectByName("righteye",true);
                var lHand = scope.scene.getObjectByName("lefthand",true);
                var rHand = scope.scene.getObjectByName("righthand",true);
                var lHüfte = scope.scene.getObjectByName("rightHip",true);
                var rhüfte = scope.scene.getObjectByName("leftHip",true);
                
                var rMouth = scope.scene.getObjectByName("mund",true);

                var rotation = -Math.PI / 5;
                var rotationBohrer = -Math.PI / 5;
                var rotationMouth = Math.PI / 100;
                var rotationWalk = Math.PI / 20;
                
                //robo animation
                if (rMouth && state) {
                    
                    rotIntervall = setInterval(function () {

                        rMouth.rotateZ(rotationMouth);
                        lHand.rotateZ(rotationBohrer);
                        rHand.rotateZ(rotationBohrer);
                        lEye.rotateZ(rotation);
                        rEye.rotateZ(rotation);
                        

                    }, 10);

                    walkInterval = setInterval(function () {
                        rotationWalk = rotationWalk * -2;
                        

                    }, 1000);
                    walkIntervall1 = setInterval(function () {

                        lHüfte.rotateX(rotationWalk);
                        rhüfte.rotateX(-rotationWalk);
                        
                    }, 100);
                    
                }

                if (scope.currentMesh !== undefined&&!rMouth) {
                    if (state) {
                        ani = setInterval(function () {
                            scope.currentMesh.rotation.y += 0.0025;
                            scope.currentMesh.rotation.x += 0.0020;
                            scope.currentMesh.rotation.z += 0.0030;
                        }, 10);
                    } else {
                        clearInterval(ani);
                    }
                }
            };

            this.addMesh = function (object_mesh) {
                scope.currentMesh = object_mesh;
                scope.scene.add(scope.currentMesh);

            };

            this.clearScene = function () {

                if (scope.scene.children.length !=0) {

                    for( var  i = scope.scene.children.length - 1; i >= 0; i--) {

                        var obj = scope.scene.children[i];
                        scope.scene.remove(obj);
                    }
                }
            };

            /**
             * THis mehod is needed to add Geometries to the scene.
             * @param geometry
             */
            this.add = function (geometry) {
                
                scope.scene.add(geometry);
                
            };

            this.addBufferGeometry = function(bufferGeometry) {

                scope.currentMesh = bufferGeometry.getMesh();
                scope.scene.add( scope.currentMesh );

            };

            /*
             * drawing the scene
             */
            this.draw = function() {

                requestAnimFrame( scope.draw );

                scope.renderer.render(scope.scene, scope.camera);

            };
        };
        
        return Scene;

    })); // define

    
