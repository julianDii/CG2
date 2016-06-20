/*
 * JavaScript / Canvas teaching framwork 
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 * changes by Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */


/* requireJS module definition */
define(["jquery", "Line", "point","circle", "Box", "util","KdTree_con","kdutil","ParametricCurve","BezierCurve", "vec2"],
    (function($, Line, Point, Circle, Box, Util,  KdTree_con, KdUtil, ParametricCurve, Beziercurve, vec2) {
        "use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context,scene,sceneController) {



            var kdTree;
            var pointList = [];
            var drawList = [];

            // generate random X coordinate within the canvas
            var randomX = function () {
                return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
            };

            // generate random Y coordinate within the canvas
            var randomY = function () {
                return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
            };

            // generate random radius within the canvas
            var randomRadius = function () {
                return Math.floor(Math.random() * ((context.canvas.height / 2) - 10)) + 5;
            };

            // generate random color in hex notation
            var randomColor = function () {

                // convert a byte (0...255) to a 2-digit hex string
                var toHex2 = function (byte) {
                    var s = byte.toString(16); // convert to hex string
                    if (s.length == 1) s = "0" + s; // pad with leading 0
                    return s;
                };

                var r = Math.floor(Math.random() * 25.9) * 10;
                var g = Math.floor(Math.random() * 25.9) * 10;
                var b = Math.floor(Math.random() * 25.9) * 10;

                // convert to hex notation
                return "#" + toHex2(r) + toHex2(g) + toHex2(b);
            };


            /**
             * Zusatzaufgabe zur Aufgabe 2.2.
             * Tangenten auf dem Kreis
             */
            $("#btnNewTangenten").click((function () {

                var style = {
                    width: Math.floor(Math.random()) + 1,
                    color: randomColor()
                };

                var p1x = ($("#p1x").val()) || 170;
                var p1y = $("#p1y").val() || 60;
                var p2x = $("#p2x").val() || 300;
                var p2y = $("#p2y").val() || 50;
                var r0 = $("#r").val() || 50;

               // var p3p2 = [0,0];
               // var p4p2 = [0,0];

                var p2 = new Point([p2x, p2y], style);
                var circle = new Circle([p1x, p1y], r0, style);

                var p1p2Vec = vec2.sub(p2.center, circle.center);
                var p1p2 = vec2.length(p1p2Vec);
                var tangent = Math.sqrt(Math.pow(p1p2, 2) - Math.pow(r0, 2));

                //Kathetensatz: a^2 = p*c  ->  p = a^2/c,
                //              b^2 = q*c  ->  q = b^2/c
                //Höhensatz:    h^2=p*q
                var p = Math.pow(r0, 2) / p1p2;
                var q = Math.pow(tangent, 2) / p1p2;
                var h = Math.sqrt(p * q);

                var direction_cp = vec2.normal(p1p2Vec);
                var point_on_cp = vec2.add(circle.center, vec2.mult(direction_cp, p));
                var normal_to_cp = [-direction_cp[1], direction_cp[0]];
                var p3p2 = vec2.add(point_on_cp, vec2.mult(normal_to_cp, h));
                var p4p2 = vec2.sub(point_on_cp, vec2.mult(normal_to_cp, h));
                
                var p3 = new Point([p3p2[0], p3p2[1]], style);
                var p4 = new Point([p4p2[0], p4p2[1]], style);
                var p3_tangente = new Line([p2x, p2y], [p3.center[0], p3.center[1]], style);
                var p4_tangente = new Line([p2x, p2y], [p4.center[0], p4.center[1]], style);
                
                //result uebergeben
                $("#p3x").val(p3.center[0].toFixed(2));
                $("#p3y").val(p3.center[1].toFixed(2));
                $("#p4x").val(p4.center[0].toFixed(2));
                $("#p4y").val(p4.center[1].toFixed(2));

                scene.addObjects([p2, circle, p3, p4, p3_tangente, p4_tangente]);
                sceneController.deselect();
                sceneController.select(p2);
            }));


            /**
             * event handler for "new line button".
             */
            $("#btnNewLine").click((function () {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var line = new Line([randomX(), randomY()],
                    [randomX(), randomY()],
                    style);
                scene.addObjects([line]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(line); // this will also redraw

            }));


            /**
             * Event handler for the New Point button.
             */
            $("#btnNewPoint").click(function () {
                // create the actual point and add it to the scene
                var style = {
                    width: Math.floor(Math.random()) + 1,
                    color: randomColor()
                };

                var point = new Point([randomX(), randomY()], style);
                scene.addObjects([point]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(point); // this will also redraw
            });

            /**
             * Event handler for the New circle button.
             */
            $("#btnNewCircle").click(function () {
                // create the actual point and add it to the scene
                var style = {
                    width: Math.floor(Math.random() * 3) + 1,
                    color: randomColor()
                };

                var circle = new Circle([randomX(), randomY()], randomRadius(), style);
                scene.addObjects([circle]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(circle); // this will also redraw
            });

            /*
             * event handler for "new box button".
             */
            $("#btnNewBox").click( (function() {

                // create the actual line and add it to the scene
                var style = {
                    width: Math.floor(Math.random()*3)+1,
                    color: randomColor()
                };

                var box = new Box( [randomX(),randomY()],
                    randomRadius(),
                    style );
                scene.addObjects([box]);

                // deselect all objects, then select the newly created object
                sceneController.deselect();
                sceneController.select(box); // this will also redraw

            }));

            /**
             *  Event handler for the New parametric curve button.
             */
            $("#newParametricCurve").click(function() {
                try {
                    var xT = $("#inputFt").val();
                    var yT = $("#inputGt").val();

                    // Test eval
                    var t = 0;
                    eval(xT);
                    eval(yT);

                    // create the actual line and add it to the scene
                    var style = {
                        width: Math.floor(Math.random()*3)+1,
                        color: randomColor()
                    };

                    var parametric_curve = new ParametricCurve(xT, yT, $('#inputMint').val(), $("#inputMaxt").val(), $("#inputSegments").val(), style);
                    scene.addObjects([parametric_curve]);

                    // deselect all objects, then select the newly created object
                    sceneController.deselect();
                    sceneController.select(parametric_curve); // this will also redraw
                } catch (e) {
                    alert(e.message);
                }


            });

            /**
             * Handles event for the amount of segments.
             */
            $("#inputSegments").change(function () {

                var obj = sceneController.getSelectedObject();
                console.log(obj);

                obj.lineSegments = this.value;
                obj.line_segments = this.value;

                console.log(this.value);
                sceneController.deselect();
                sceneController.select(obj);

            });


            /**
             * Handles the event for the color picker for the selected object
             */
            $("#inColor").change(function () {

                var obj = sceneController.getSelectedObject();
                obj.lineStyle.color = this.value;

                sceneController.deselect();
                sceneController.select(obj);

            });


            /**
             * sets the of the color, radius and width of the html elements to the values of the selected element.
             * and hides the radius when point or line is selected
             */
            sceneController.onSelection(function () {

                var obj = this.getSelectedObject();


                $('#inColor').val(obj.lineStyle.color);
                $('#inRadius').val(obj.radius);
                $('#inNumber').val(obj.lineStyle.width);
                $('#inputSegments').val(obj.lineSegments);


                if (obj.radius==undefined) {

                    $('#inRadius').hide();
                    $('#ra').hide();
                    
                } else {
                    $('#inRadius').show();
                    $('#ra').show();
                }

            });

            /**
             *  Event handler for the New bezier curve button.
             */
            $("#newBezierCurve").click( (function(){

                var lineStyle = {
                    width: $("#inNumber").val() || Math.floor(Math.random()*3)+1,
                    color:  randomColor()
                };

                var point0 = [randomX(), randomY()];
                var point1 = [randomX(), randomY()];
                var point2 = [randomX(), randomY()];
                var point3 = [randomX(), randomY()];

                var segments = parseInt($("#inputSegments").val());
                var tick = $("#visTickMarks").is(':checked');

                var bezierCurve = new Beziercurve(point0, point1, point2, point3, segments, lineStyle, tick);

                scene.addObjects([bezierCurve]);

                sceneController.deselect();
            }));


            /**
             * Handles the event when a selected object line width is getting manipulated in the inNumber field of
             * the HTML context.
             */
            $('#inNumber').change(function () {

                var obj = sceneController.getSelectedObject();
                obj.lineStyle.width = this.value;

                sceneController.deselect();
                sceneController.select(obj);

            });





            /**
             * Sets the color and the width to the value of the selected object.
             */
            sceneController.onObjChange(function () {

                var obj = this.getSelectedObject();

                $("#inNumber").val(obj.lineStyle.width);
                $("#inColor").val(obj.lineStyle.color);
                $("#inRadius").val(obj.radius);
                $("#inputSegments").val(obj.line_segments)



            });

            /**
             * Sets the radius of the circle to the chosen value.
             */
            $("#inRadius").change(function() {
                var object = sceneController.getSelectedObject();
                object.radius = parseInt(this.value);

                sceneController.deselect();
                sceneController.select(object);
            });

            // public method: show parameters for selected object
            this.showParamsForObj = function(obj) {

                if(!obj) {
                    $("#radius_div").hide();
                    return;
                }

                $("#obj_lineWidth").attr("value", obj.lineStyle.width);
                $("#obj_color").attr("value", obj.lineStyle.color);
                if(obj.radius == undefined) {
                    $("#radius_div").hide();
                } else {
                    $("#radius_div").show();
                    $("#obj_radius").attr("value", obj.radius);
                };

            };

            // for all elements of class objParams
            $(".objParam").change( (function(ev) {

                var obj = sceneController.getSelectedObject();
                if(!obj) {
                    window.console.log("ParamController: no object selected.");
                    return;
                };

                obj.lineStyle.width = parseInt($("#obj_lineWidth").attr("value"));
                obj.lineStyle.color = $("#obj_color").attr("value");
                if(obj.radius != undefined) {
                    obj.radius = parseInt($("#obj_radius").attr("value"));
                };

                scene.draw(context);
            }));
            

            /*Here starts the KDTREE part of the html controller*/
            $("#btnNewPointList").click(function () {

                var style = {
                    width: 0,
                    color: randomColor()
                };


                var numPoints = $('#inPoints').val();

                if (numPoints === "") {

                    numPoints =10;

                }

                // creates points for the amount of the user input or default
                for(var i=0; i<numPoints; ++i) {
                    var point = new Point([randomX(), randomY()], style);
                    scene.addObjects([point]);
                    pointList.push(point);
                }

                // deselect all objects, then select the newly created object
                sceneController.deselect();


            });

            
            $("#visKdTree").click( (function() {

                var showTree = $("#visKdTree").attr("checked");
                if(showTree && kdTree) {
                    KdUtil.visualizeKdTree(sceneController, scene, kdTree.root, 0, 0, 600, true);
                }

            }));

            $("#btnBuildKdTree").click( (function() {

                kdTree = new KdTree_con(pointList);

            }));

            /**
             * creates a random query point and
             * runs linear search and kd-nearest-neighbor search
             */
            $("#btnQueryKdTree").click( (function() {

                var style = {
                    width: 2,
                    color: "#ff0000"
                };
                var queryPoint = new Point([randomX(), randomY()], 2,
                    style);
                scene.addObjects([queryPoint]);
                sceneController.select(queryPoint);

                console.log("query point: ", queryPoint.center);

                ////////////////////////////////////////////////
                // TODO: measure and compare timings of linear
                //       and kd-nearest-neighbor search
                ////////////////////////////////////////////////
                var linearTiming;
                var kdTiming;

                var minIdx = KdUtil.linearSearch(pointList, queryPoint);

                console.log("nearest neighbor linear: ", pointList[minIdx].center);

                var kdNearestNeighbor = kdTree.findNearestNeighbor(kdTree.root, queryPoint, kdTree.root, 10000000, 0);

                console.log("nearest neighbor kd: ", kdNearestNeighbor.point.center);

                kdNearestNeighbor.point.lineStyle = { width: "0", color:randomColor() };

                sceneController.select(pointList[minIdx]);
                sceneController.select(kdNearestNeighbor.point);

            }));

        };



        // return the constructor function
        return HtmlController;


    })); // require



            
