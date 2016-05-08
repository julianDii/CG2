/**
 * Created by Julian Dobrot on 06.05.2016.
 */

/**
 * This module represents a parametric curve.
 * A two dimensional parametric curve dim = x,y described by the functions f(t) and g(t).
 * interval [tmin,tmax]
 * On the Canvas we draw line segments (N).
 */
/* requireJS module definition */
define(["jquery","util","vec2","Scene"],
    (function ($,util,vec2,scene) {
        "use strict";

        /**
         * This constructor is called when a new ParametricCurve is created.
         * @param ft first function
         * @param gt second function
         * @param tMin the minimum t
         * @param tMax th maximum t
         * @param lineSegments
         * @param lineStyle
         * @constructor
         */
        var ParametricCurve = function (ft, gt, tMin, tMax, lineSegments, lineStyle) {

            console.log("Creating parametric curve with f(t)=", ft, ", g(t)=", gt, ", minT=", tMin, "maxT=", tMax, ",", lineSegments, "segments and linestyle", lineStyle);

            this.ft = ft || "150+150*Math.sin(t)";
            this.gt = gt || "150+150*Math.cos(t)";
            this.tMin = tMin || "0";
            this.tMax = tMax || "6.28";
            this.lineSegments = lineSegments || "10";
            this.pointList = [];
            
            this.lineStyle = lineStyle || {
                    width: "8",
                    color: "#0000AA"
                };
            
        };

        /**
         * This method draws the parametric curve in to the provided 2d rendering context.
         * @param context
         */
        ParametricCurve.prototype.draw = function (context) {

            var distance = (this.tMax - this.tMin) / this.lineSegments;


            // iterate over all line segments
            for (var i = 0; i < this.lineSegments; i++) {

                var t = this.tMin + i * distance;

                try {
                    // for every line segment we create a new parametric point
                    this.pointList.push([eval(this.ft),eval(this.gt)]);
                } catch (e) { alert(e) }

            }

            context.beginPath();

            var startPoint = this.pointList[0];
            context.moveTo(startPoint[0], startPoint[1]);

            for (var i = 1; i < this.pointList.length; i++) {

                var iX = this.pointList[i][0];
                var iY = this.pointList[i][1];

                context.lineTo(iX,iY);
            }

            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();


        };

        /**
         * This method checks whether or not the mouse is on this parametric curve
         * @param context
         * @param position
         */
        ParametricCurve.prototype.isHit = function (context,pos) {

            // project point on circle, get parameter of that projection point
            var t = 0;
            for (var i = 0; i < this.pointList.length - 1; i++) {
                // project point on line, get parameter of that projection point
                t = vec2.projectPointOnLine(pos, this.pointList[i], this.pointList[i + 1]);

                // inside the line segment?
                if (t >= 0 && t <= 1) {
                    // coordinates of the projected point
                    var p = vec2.add(this.pointList[i], vec2.mult(vec2.sub(this.pointList[i + 1], this.pointList[i]), t));

                    // distance of the point from the line
                    var distance = vec2.length(vec2.sub(p, pos));

                    // allow 2 pixels extra "sensitivity"
                    if (distance <= (this.lineStyle.width / 2) + 2) {
                        return true;
                    }
                }
            }
            // if no segment matches, return false
            return false;



        };

        /***
         * This method creates a empty array of draggers and returns it.
         * @returns {Array}
         */
        ParametricCurve.prototype.createDraggers = function () {

            var draggers = [];
            return draggers;


        };


        // This module only exports the constructor for Parametric Curve objects.
        return ParametricCurve;

    }));
