/**
 * Created by julian on 20.04.16.
 *
 *  Module: point
 *
 *  A point knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 *
 */


/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function(util,vec2,Scene,PointDragger) {

        "use strict";

        /**
         * a point that can be dragged
         *
         * @param Array object representindt the [x,y] coordinates of the points center
         * @param lineStyle Object defining width and color attributes for the points.
         * @constructor
         */
        var Point = function(center, lineStyle) {

            console.log("draw point: ", center);
            console.log("lineStyle: ", lineStyle)


            this.lineStyle = lineStyle || { width: "0", color: "#000000" };

            // initial values in case either point is undefined
            this.center = center || [10,10];
            this.radius = 3;

            // draw this point into the provided 2D rendering context
            this.draw = function(context) {

                // draw actual line
                context.beginPath();

                // set points to be drawn
                context.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);

                // set drawing style
                context.lineWidth = 0;
                context.strokeStyle = this.lineStyle.color;
                context.fillStyle = this.lineStyle.color;
                // fill the circle
                context.fill();
                // actually start drawing
                context.stroke();


            };

            // test whether the mouse position is on this point segment.
            Point.prototype.isHit = function(context,mousePos) {

                // the current position
                var centerPos = this.center;

                // check whether distance between mouse and dragger's center
                // is less or equal ( radius + (line width)/2 )
                var dx = mousePos[0] - centerPos[0];
                var dy = mousePos[1] - centerPos[1];
                var r = this.radius;
                return (dx * dx + dy * dy) <= (r * r);

            };

            // return list of draggers to manipulate this point.
            Point.prototype.createDraggers = function() {

                var draggerStyle = { radius:3, color: this.lineStyle.color, width:0, fill:true }
                var draggers = [];

                // create closure and callbacks for dragger
                //local variable for the point
                var _point = this;

                // This function returns the points center
                var getCenter = function() { return _point.center; };
                // This function sets the points center to the new mouse position.
                var setCenter = function(dragEvent) { _point.center = dragEvent.position; };
                draggers.push( new PointDragger(getCenter, setCenter, draggerStyle) );


                return draggers;

            };


        };

        // this module only exports the constructor for StraightLine objects
        return Point;

    })); // define