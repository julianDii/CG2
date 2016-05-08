/*
 * Module: box
 *
 * A Box knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         *  A simple box that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - p1: array objects representing [x,y] coordinates of start
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         *  - w: width
         */

        var Box = function (point1, width, lineStyle) {

            console.log("creating box from [" +
                point1[0] + "," + point1[1] + "] with width [" +
                width + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case either point is undefined
            this.p1 = point1 || [10, 10];
            this.w = width || 50;
        };

        // draw this line into the provided 2D rendering context
        Box.prototype.draw = function (context) {

            var start = this.p1;
            var width = this.w;
            // draw actual line
            context.beginPath();

            // set points to be drawn
            context.moveTo(start[0], start[1]);
            context.lineTo((start[0] + width), start[1]);
            context.lineTo((start[0] + width), (start[1] + width));
            context.lineTo(start[0], (start[1] +width));
            context.lineTo(start[0], start[1]);
            context.closePath();

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();

        };

        // test whether the mouse position is on this line segment
        Box.prototype.isHit = function (context, mousePos) {

            // left upper corner
            var lo = this.p1;
            // lower right corner
            var ru = [(lo[0] + this.w), (lo[1] + this.w)];
            // true, if cursor hits the box.
            return (lo[0] <= mousePos[0]) && (mousePos[0] <= ru[0]) &&  (lo[1] <= mousePos[1]) && (mousePos[1] <= ru[1]);

        };

        // return list of draggers to manipulate this line
        Box.prototype.createDraggers = function () {

            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true};
            var draggers = [];

            // create closure and callbacks for dragger
            var _box = this;
            var getP1 = function () {
                return _box.p1;
            };
            var setP1 = function (dragEvent) {
                _box.p1 = dragEvent.position;
            };
            draggers.push(new PointDragger(getP1, setP1, draggerStyle));

            return draggers;
        };


        // this module only exports the constructor for StraightLine objects
        return Box;

    })); // define


