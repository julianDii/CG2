/*
 * authored by Ir, khildebrand@beuth-hochschule.de
 *
 * Module: circle
 *
 * A Circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         *  A simple circle that can be dragged
         *  around by its endpoints.
         *  Parameters:
         *  - point0 and point1: array objects representing [x,y] coordinates of start and end point
         *  - lineStyle: object defining width and color attributes for line drawing,
         *       begin of the form { width: 2, color: "#00FF00" }
         */

        var Circle = function (center, radius, lineStyle) {

            console.log("creating circle  [" +
                center[0] + "," + center[1] + "] with r [" +
                radius + "].");

            // draw style for drawing the line
            this.lineStyle = lineStyle || {width: "2", color: "#0000AA"};

            // initial values in case either point is undefined
            this.cnt = center || [10, 10];
            this.r = radius || [0];
        };

        // draw this Circle into the provided 2D rendering context
        Circle.prototype.draw = function (context) {

            // draw actual line
            context.beginPath();

            // set circle to be drawn
            context.arc(this.cnt[0], this.cnt[1], // position
                this.r,                       // r
                0.0, Math.PI * 2,       // start and end angle
                true);                  // clockwise
            context.closePath();

            // set drawing style
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;

            // actually start drawing
            context.stroke();
        };

        // test whether the mouse position is on this line segment
        Circle.prototype.isHit = function (context, pos) {
            //------------nicht geändert------------
            // project point on line, get parameter of that projection point
            var t = vec2.projectPointOnLine(pos, this.cnt, this.p1);
            console.log("t:", t);
            // outside the line segment?
            if (t < 0.0 || t > 1.0) {
                return false;
            }

            // coordinates of the projected point
            var p = vec2.add(this.cnt, vec2.mult(vec2.sub(this.p1, this.cnt), t));

            // distance of the point from the line
            var d = vec2.length(vec2.sub(p, pos));

            // allow 2 pixels extra "sensitivity"
            return d <= (this.lineStyle.width / 2) + 2;
            //------------nicht geändert------------

        };

        // return list of draggers to manipulate this line
        Circle.prototype.createDraggers = function () {
            //------------nicht geändert------------
            var draggerStyle = {radius: 4, color: this.lineStyle.color, width: 0, fill: true}
            var draggers = [];

            // create closure and callbacks for dragger
            var _line = this;
            var getP0 = function () {
                return _line.cnt;
            };
            var getP1 = function () {
                return _line.p1;
            };
            var setP0 = function (dragEvent) {
                _line.cnt = dragEvent.position;
            };
            var setP1 = function (dragEvent) {
                _line.p1 = dragEvent.position;
            };
            draggers.push(new PointDragger(getP0, setP0, draggerStyle));
            draggers.push(new PointDragger(getP1, setP1, draggerStyle));

            return draggers;
            //------------nicht geändert------------
        };


        // this module only exports the constructor for StraightLine objects
        return Circle;

    })); // define

    
