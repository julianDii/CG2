/**
 * Created by julian on 25.04.16.
 *
 * Module: circle
 *
 *
 * A circle knows how to draw itself into a specified 2D context,
 * can tell whether a certain mouse position "hits" the object,
 * and implements the function createDraggers() to create a set of
 * draggers to manipulate itself.
 *
 */

/* requireJS module definition */

define(["util","vec2","Scene","Pointdragger"]),
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         *  A simple circle.
         *
         *  @param center Array object [x,y] of the points center
         *  @param The radius of the circle.
         *  @param defines width and color of the circle
         *  @constructor
         */

        var circle = function (center, radius, linesStyle) {

            console.log("building circle: ", center, "radius: ",radius);

            this.lineStyle = linesStyle || {width: "2", color: "#000000"}

            this.center = center || [10,10];
            this.radius = radius || 7;

            this.draw = function (context) {

                // draw the circle
                context.beginPath();

                // set circles to draw

                context.arc(this.center[0], this.center[1], this.radius, 0, 2 * Math.PI);


                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;
                context.stroke();


            };

            //
            Circle.prototype.isHit = function () {

            }

        }
        
    
})
