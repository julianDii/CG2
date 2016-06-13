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
define(["jquery", "BufferGeometry", "random", "band","parametric","BufferGeometry_Normal","shape_from_file"],
    (function($,BufferGeometry, Random, Band, ParametricSurface,BufferGeometry_Normal, Shape_from_file) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(scene) {

            //obj-loader

            var wait = function(shape_from_file) {
                if (shape_from_file.isLoaded()) {
                    var obj_geometry = shape_from_file.getLoadedObj();
                    obj_geometry.scale.x = 50;
                    obj_geometry.scale.y = 50;
                    obj_geometry.scale.z = 50;
                    obj_geometry.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.geometry.computeFaceNormals();
                            child.geometry.computeVertexNormals(true);
                            child.material = new THREE.MeshPhongMaterial({
                                color: 'lightgray',
                                shading: THREE.SmoothShading
                            });
                        }
                    });
                    scene.add(obj_geometry); //obj_mesh);
                    return;
                } else {
                    setTimeout(function() {
                        wait(shape_from_file);
                    }, 30);
                }
            };

            $("#btnLoadObj").click((function() {

                scene.clearScene();
                addLights();

                var path = '../cg-a02.1-surfaces/obj/obj/' + $("#obj_select").val() + '.obj';
                var obj_tool = new Shape_from_file(path);
                wait(obj_tool);

            }));

            $("#random").show();
            $("#band").hide();
            $('#parametric').hide();
            $('#table_loaders').hide();


            $("#btnRandom").click( (function() {
                $("#random").show();
                $("#band").hide();
                $('#parametric').hide();
                $('#table_loaders').hide();


            }));

            $("#btnBand").click( (function() {
                $("#random").hide();
                $("#band").show();
                $('#parametric').hide();
                $('#table_loaders').hide();
            }));
            $('#btnParametric').click((function () {

                $("#random").hide();
                $("#band").hide();
                $('#parametric').show();
                $('#table_loaders').hide();
            }));

            $('#obj').click((function () {

                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();
                $('#table_loaders').hide();
                $('#table_loaders').show();

            }));

            $("#btnNewRandom").click( (function() {

                var numPoints = parseInt($("#numItems").attr("value"));
                var random = new Random(numPoints);
                var bufferGeometryRandom = new BufferGeometry_Normal();

                bufferGeometryRandom.addAttribute("position", random.getPositions());
                bufferGeometryRandom.addAttribute("color", random.getColors());

                scene.addBufferGeometry(bufferGeometryRandom);
            }));
           
            $("#sphere").click((function () {

              scene.clearScene();
                addLights();

                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();

                var geometry = new THREE.SphereGeometry( 500, 320, 320 );
                var material = new THREE.MeshPhongMaterial({color: 0xffff00});
                var sphere = new THREE.Mesh( geometry, material );


                scene.add(sphere);

            }));

            $("#cube").click((function () {

                scene.clearScene();
                addLights();

                
                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();

                var geometry = new THREE.BoxGeometry( 100, 100, 100 );
                var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
                var cube = new THREE.Mesh( geometry, material );

                scene.add(cube);

            }));

            $("#knot").click((function () {

                scene.clearScene();
                addLights();


                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();

                var geometry = new THREE.TorusKnotGeometry( 300, 100, 500, 160 );
                var material = new THREE.MeshPhongMaterial( { color: 0xffff00 } );
                var torusKnot = new THREE.Mesh( geometry, material );
                scene.add( torusKnot );

            }));

            $("#btnNewParametric").click((function () {

                scene.clearScene();
                addLights();
                
                
                var xDim = $("#xDim").val() || "u*200";
                var yDim = $("#yDim").val() || "v*200";
                var zDim = $("#zDim").val() || "0";

                var paramFunction = function (u, v) {
                    try {
                        var pos3D = [
                            eval(xDim),
                            eval(yDim),
                            eval(zDim)
                        ];
                    } catch (e) {
                        if (e instanceof SyntaxError) {
                            alert("Syntax Error : Bitte Formeleingabe überprüfen\n\
                                und erneut ausführen ... " + e.message);
                            return;
                        } else {
                            throw(e);
                        }
                    }

                    return pos3D;
                };

                var config = {
                    uSegments: parseInt($("#uSegments").val()) || 5,
                    vSegments: parseInt($("#vSegments").val()) || 5,
                    uMin: parseFloat($("#uMin").val()) || -1,
                    uMax: parseFloat($("#uMax").val()) || 1,
                    vMin: parseFloat($("#vMin").val()) || -1,
                    vMax: parseFloat($("#vMax").val()) || 1
                };
                var points;


                points = $('#cPoints').is(':checked');
                var wireframe = $('#cWireframe').is(':checked');
                var mesh = $('#cMesh').is(':checked');

                var paramSurface = new ParametricSurface(paramFunction, config);
                var bufferGeometryParametric = new BufferGeometry(points,wireframe,mesh);

                bufferGeometryParametric.addAttribute("position", paramSurface.getPositions());
                bufferGeometryParametric.addAttribute("color", paramSurface.getColors());
                bufferGeometryParametric.setIndex(paramSurface.getIndices());

                scene.addBufferGeometry(bufferGeometryParametric);

            }));


            $("#btnNewBand").click( (function() {

                scene.clearScene();
                addLights();

                var config = {
                    segments : parseInt($("#numSegments").attr("value")),
                    radius : parseInt($("#radius").attr("value")),
                    height : parseInt($("#height").attr("value"))
                };

                var band = new Band(config);
                var bufferGeometryBand = new BufferGeometry_Normal();
                bufferGeometryBand.addAttribute("position", band.getPositions());
                bufferGeometryBand.addAttribute("color", band.getColors());

                scene.addBufferGeometry(bufferGeometryBand);
            }));

            $('#cAnimate').change(function () {
                if ($(this).is(':checked')) {
                    scene.animate(true);
                } else {
                    scene.animate(false);
                }
            });


            // helper functions

            var addLights = function () {

                var pointLight = new THREE.DirectionalLight(0xFFFFFF, 1, 100000);
                pointLight.position.set(-3, 7, 7);
                scene.add(pointLight);

                var ambientLight = new THREE.AmbientLight(0x000000);
                scene.add(ambientLight);

            }

            var pointLight = new THREE.DirectionalLight(0xFFFFFF, 1, 100000);
            pointLight.position.set(-3, 7, 7);
            scene.add(pointLight);

            var ambientLight = new THREE.AmbientLight(0x000000);
            scene.add(ambientLight);

        };

        //definition of parametric surfaces

        $('#btnPillow').click(function () {
            $("#xDim").val("300 * Math.cos(u)");
            $("#yDim").val("300 * Math.cos(v)");
            $("#zDim").val("100 * Math.sin(u)*Math.sin(v)");
            $("#uSegments").val("25");
            $("#vSegments").val("25");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-Math.PI);
            $("#vMax").val(Math.PI);
        });

        $('#btnTorus').click(function () {
            $("#xDim").val("(300 + 150 * Math.cos(v))*Math.cos(u)");
            $("#yDim").val("(300 + 150 * Math.cos(v))*Math.sin(u)");
            $("#zDim").val("100 * Math.sin(v)");
            $("#uSegments").val("25");
            $("#vSegments").val("25");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-Math.PI);
            $("#vMax").val(Math.PI);
        });
        $('#btnSphere').click(function () {
            $("#xDim").val("500 * Math.cos(u)*Math.cos(v)");
            $("#yDim").val("500 * Math.cos(u)*Math.sin(v)");
            $("#zDim").val("500 * Math.sin(u)");
            $("#uSegments").val("25");
            $("#vSegments").val("25");
            $("#uMin").val(-0.5 * Math.PI);
            $("#uMax").val(0.5 * Math.PI);
            $("#vMin").val(-1 * Math.PI);
            $("#vMax").val(1 * Math.PI);
        });

        $('#btnCube').click(function () {
            var cubeConst = "Math.pow(Math.pow(Math.sin(u),6)*(Math.pow(Math.sin(v),6)+Math.pow(Math.cos(v),6)) + Math.pow(Math.cos(u),6), 1/6)";
            $("#xDim").val("(300 * Math.sin(u) * Math.cos(v)) / Math.pow(Math.pow(Math.sin(u),6)*(Math.pow(Math.sin(v),6)+Math.pow(Math.cos(v),6)) + Math.pow(Math.cos(u),6), 1/6)");
            $("#yDim").val("(300 * Math.sin(u) * Math.sin(v)) / " + cubeConst);
            $("#zDim").val("(300 * Math.cos(u)) / " + cubeConst);
            $("#uSegments").val("25");
            $("#vSegments").val("25");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-0.5 * Math.PI);
            $("#vMax").val(0.5 * Math.PI);
        });

        // return the constructor function
        return HtmlController;


    })); // require



            
