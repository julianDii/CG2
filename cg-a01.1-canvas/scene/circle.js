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

            this.lineStyle = linesStyle || {width: "2", color: ""}

        }
        
    
})
