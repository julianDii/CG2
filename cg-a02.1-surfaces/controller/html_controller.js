/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various 
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "BufferGeometry", "random", "band"],
    (function($,BufferGeometry, Random, Band) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {


            $("#random").show();
            $("#band").hide();

            $("#btnRandom").click( (function() {
                $("#random").show();
                $("#band").hide();
            }));

            $("#btnBand").click( (function() {
                $("#random").hide();
                $("#band").show();
            }));

            $("#btnNewRandom").click( (function() {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry();
                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());

                scene.addBufferGeometry(bufferGeometryRandom);
            }));
            $("#sphere").click((function () {

                var geometry = new THREE.SphereGeometry( 500, 320, 320 );
              //  var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
                var material = new THREE.MeshDepthMaterial({color: 0xffff00});
                var sphere = new THREE.Mesh( geometry, material );


                scene.add(sphere);

            }));

            $("#cube").click((function () {

                var geometry = new THREE.BoxGeometry( 100, 100, 100 );
                var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                var cube = new THREE.Mesh( geometry, material );

                scene.add(cube);

            }));

            $("#knot").click((function () {

                var geometry = new THREE.TorusKnotGeometry( 300, 100, 500, 160 );
                var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
                var torusKnot = new THREE.Mesh( geometry, material );
                scene.add( torusKnot );

            }));



            $("#btnNewBand").click( (function() {

                var config = {
                    segments : parseInt($("#numSegments").attr("value")),
                    radius : parseInt($("#radius").attr("value")),
                    height : parseInt($("#height").attr("value"))
                };


                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));


        };

        // return the constructor function
        return HtmlController;


    })); // require



            
