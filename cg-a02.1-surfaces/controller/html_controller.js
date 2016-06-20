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
define(["jquery", "BufferGeometry", "random", "band","parametric","BufferGeometry_Normal","shape_from_file","robo"],
    (function($,BufferGeometry, Random, Band, ParametricSurface,BufferGeometry_Normal, Shape_from_file, Robo) {
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
            $("#tangent").hide();
            $("#tangentResult").hide();


            var robo;
            $("#robo").click((function () {

                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();
                $('#table_loaders').hide();
                $("#tangent").hide();
                $("#tangentResult").hide();
                $("#cWireframe").hide();
                $("#cPoints").hide();
                $("#cMesh").hide();
                $("#wir").hide();
                $("#poi").hide();
                $("#mes").hide();
                
                scene.clearScene();
                addLights();

                robo = new Robo();

                scene.addMesh(robo.getMesh());

            }));

            $("#btnRandom").click( (function() {
                $("#random").show();
                $("#band").hide();
                $('#parametric').hide();
                $('#table_loaders').hide();
                $("#tangent").hide();
                $("#tangentResult").hide();

            }));

            $("#btnBand").click( (function() {
                $("#random").hide();
                $("#band").show();
                $('#parametric').hide();
                $('#table_loaders').hide();
                $("#tangent").hide();
                $("#tangentResult").hide();
            }));

            $('#btnParametric').click((function () {

                $("#random").hide();
                $("#band").hide();
                $('#parametric').show();
                $('#table_loaders').hide();
                $("#tangent").hide();
                $("#tangentResult").hide();
                $("#cWireframe").show();
                $("#cPoints").show();
                $("#cMesh").show();
                $("#wir").show();
                $("#poi").show();
                $("#mes").show();
            }));

            $('#obj').click((function () {

                $("#random").hide();
                $("#band").hide();
                $('#parametric').hide();
                $("#tangent").hide();
                $('#table_loaders').show();
                $("#tangentResult").hide();

            }));


            $("#btnNewRandom").click( (function() {

                scene.clearScene();
                addLights();

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
                $("#tangent").hide();
                $("#tangentResult").hide();

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
                $("#tangent").hide();
                $("#tangentResult").hide();

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
                $("#tangent").hide();
                $("#tangentResult").hide();

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

            $("#music").change(function () {
                if ($(this).is(':checked')) {
                    robo.play_sound();
                } else {
                    robo.stop_sound();
                }
            });


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

            };

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
            $("#uSegments").val("20");
            $("#vSegments").val("20");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-Math.PI);
            $("#vMax").val(Math.PI);
        });

        $('#btnTorus').click(function () {
            $("#xDim").val("(300 + 150 * Math.cos(v))*Math.cos(u)");
            $("#yDim").val("(300 + 150 * Math.cos(v))*Math.sin(u)");
            $("#zDim").val("100 * Math.sin(v)");
            $("#uSegments").val("20");
            $("#vSegments").val("20");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-Math.PI);
            $("#vMax").val(Math.PI);
        });
        $('#btnSphere').click(function () {
            $("#xDim").val("500 * Math.cos(u)*Math.cos(v)");
            $("#yDim").val("500 * Math.cos(u)*Math.sin(v)");
            $("#zDim").val("500 * Math.sin(u)");
            $("#uSegments").val("20");
            $("#vSegments").val("20");
            $("#uMin").val(-0.5 * Math.PI);
            $("#uMax").val(0.5 * Math.PI);
            $("#vMin").val(-1 * Math.PI);
            $("#vMax").val(1 * Math.PI);
        });

        $('#btnspirale').click(function () {
            $("#xDim").val("130 * u*Math.cos(v)");
            $("#yDim").val("130 * u*Math.sin(v)");
            $("#zDim").val("130 * v");
            $("#uSegments").val("20");
            $("#vSegments").val("20");
            $("#uMin").val(- Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-Math.PI);
            $("#vMax").val(Math.PI);
        });

        $('#btnmobi').click(function () {
            $("#xDim").val("20 * (1-u)*(3+Math.cos(v))*(Math.cos(2*Math.PI*u))");
            $("#yDim").val("20 * (1-u)*(3+Math.cos(v))*Math.sin(2*Math.PI*u)");
            $("#zDim").val("20 * 6*u+(1-u)*Math.sin(v)");
            $("#uSegments").val("20");
            $("#vSegments").val("20");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(1);
            $("#vMin").val(-Math.PI);
            $("#vMax").val(2*Math.PI);
        });

        $('#btnCube').click(function () {
            var cubeConst = "Math.pow(Math.pow(Math.sin(u),6)*(Math.pow(Math.sin(v),6)+Math.pow(Math.cos(v),6)) + Math.pow(Math.cos(u),6), 1/6)";
            $("#xDim").val("(300 * Math.sin(u) * Math.cos(v)) / Math.pow(Math.pow(Math.sin(u),6)*(Math.pow(Math.sin(v),6)+Math.pow(Math.cos(v),6)) + Math.pow(Math.cos(u),6), 1/6)");
            $("#yDim").val("(300 * Math.sin(u) * Math.sin(v)) / " + cubeConst);
            $("#zDim").val("(300 * Math.cos(u)) / " + cubeConst);
            $("#uSegments").val("20");
            $("#vSegments").val("20");
            $("#uMin").val(-Math.PI);
            $("#uMax").val(Math.PI);
            $("#vMin").val(-0.5 * Math.PI);
            $("#vMax").val(0.5 * Math.PI);
        });


        // Zusatzaufgabe zu Aufgabe 2.2 (2 Tangenten auf dem Kreis)
        $("#btnTangentenPoints").click((function () {
            
            $("#random").hide();
            $("#band").hide();
            $("#ellipsoid").hide();
            $("#parametric").hide();
            $("#tangent").show();
            $("#tangentResult").hide();
        }));

        $("#btnNewTangenten").click((function () {
            $("#tangentResult").hide();

            var p1x = ($("#p1x").val()) || 7;
            var p1y = $("#p1y").val() || 6;
            var p2x = $("#p2x").val() || 8;
            var p2y = $("#p2y").val() || 13;
            var r0 = $("#r").val() || 100;

            var p3x = 0;
            var p3y = 0;
            var p4x = 0;
            var p4y = 0;

            var r1 = (p2x - p1x)/2;
            console.log("r1 " + r1);

            var a = (r0*r0)/(2*r1);
            console.log("a " + a);

            var h = Math.sqrt(r0*r0-a*a);
            console.log("h " + h);

            var p3x = parseInt(p1x) + a;
            var p3y = parseInt(p1y) + h;
            var p4x = p3x;
            var p4y = p1y - h; 

            //result uebergeben
            $("#p3x").val(p3x);
            $("#p3y").val(p3y);
            $("#p4x").val(p4x);
            $("#p4y").val(p4y);
            $("#tangentResult").show();
        }));

        // return the constructor function
        return HtmlController;
    })); // require








            
