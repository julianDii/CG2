/**
 * This module represents a bezier curve.
 */

/* requireJS module definition */
define(["util", "vec2", "Scene", "PointDragger"],
    (function (util, vec2, Scene, PointDragger) {

        "use strict";

        /**
         * This constructor creates a new Bezier curve Object.
         * @param point_0
         * @param point_1
         * @param point_2
         * @param point_3
         * @param line_segments
         * @param lineStyle
         * @constructor
         */
        var BezierCurve = function (point_0, point_1, point_2, point_3, line_segments, lineStyle) {

            this.point_0 = point_0 || [10, 10];
            this.point_1 = point_1 || [10, 150];
            this.point_2 = point_2 || [150, 10];
            this.point_3 = point_3 || [150, 150];

            this.line_segments = line_segments || 10;


            // draw style for drawing the line
            this.lineStyle = lineStyle || {
                    width: "5",
                    color: "#0000AA"
                };

            /**
             * Berstein Polynom 1
             * @param t
             * @returns {number}
             */
            this.bp0 = function (t) {
                return Math.pow(1 - t, 3);
            };

            /**
             * Berstein Polynom 2
             * @param t
             * @returns {number}
             */

            this.bp1 = function (t) {
                return 3 * Math.pow(1 - t, 2) * t;
            };

            /**
             * Berstein Polynom 3
             * @param t
             * @returns {number}
             */

            this.bp2 = function (t) {
                return 3 * (1 - t) * Math.pow(t, 2);
            };

            /**
             * Berstein Polynom 4
             * @param t
             * @returns {number}
             */

            this.bp3 = function (t) {
                return Math.pow(t, 3);
            };

            /**
             * Draws the bezier curve to provided context.
             * @param context
             */
            this.bezierCurve = function (coordinate, t) {
                return (this.bp0(t) * this.point_0[coordinate]) +
                    (this.bp1(t) * this.point_1[coordinate]) +
                    (this.bp2(t) * this.point_2[coordinate]) +
                    (this.bp3(t) * this.point_3[coordinate]);
            };

        };


        BezierCurve.prototype.draw = function (context) {
           
            //calculating the Points
            this.pointList = [];
            this.pointList.push([this.point_0[0], this.point_0[1]]);


            for (var i = 1; i <= this.line_segments; i++) {

                
                var t = 1 / this.line_segments * i;
                var px = this.bezierCurve(0, t);
                var py = this.bezierCurve(1, t);
                this.pointList.push([px, py]);
            }

            // draw bezier curve
            context.beginPath();
            var firstPoint = this.pointList[0];
            context.moveTo(firstPoint[0], firstPoint[1]);


            for (var i = 1; i < this.pointList.length; i++) {
                context.lineTo(this.pointList[i][0], this.pointList[i][1]);
            }

            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();

            // connect the draggers
            context.beginPath();
            context.moveTo(this.point_0[0], this.point_0[1]);
            context.lineTo(this.point_1[0], this.point_1[1]);
            context.moveTo(this.point_1[0], this.point_1[1]);
            context.lineTo(this.point_2[0], this.point_2[1]);
            context.moveTo(this.point_2[0], this.point_2[1]);
            context.lineTo(this.point_3[0], this.point_3[1]);
            context.moveTo(this.point_3[0], this.point_3[1]);
            context.lineWidth = this.lineStyle.width;
            context.strokeStyle = this.lineStyle.color;
            context.stroke();

        };

        // test whether the mouse position is on this bezier curve.
        BezierCurve.prototype.isHit = function (context, pos) {

            // project point on curve, get parameter of that projection point
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


        // return list of draggers to manipulate this BezierCurve
        BezierCurve.prototype.createDraggers = function () {

            var draggerStyle = {
                radius: 4,
                color: this.lineStyle.color,
                width: 0,
                fill: true
            };
            var self = this;

            /**
             * dragger pos of point 0.
             * @returns {*|number[]}
             */
            var getPoint0 = function () {
                return self.point_0;
            };

            /**
             * dragger pos of point 1
             * @returns {*|number[]}
             */
            var getPoint1 = function () {
                return self.point_1;
            };

            /**
             * dragger pos of point 2.
             * @returns {*|number[]}
             */
            var getPoint2 = function () {
                return self.point_2;
            };

            /**
             * dragger pos of point 3.
             * @returns {*|number[]}
             */
            var getPoint3 = function () {
                return self.point_3;
            };

            /**
             * set the position of point 0.
             * @param ev
             */
            var setPoint0 = function (ev) {
                self.point_0 = ev.position;
            };

            /**
             * set the position of point 1.
             * @param ev
             */
            var setPoint1 = function (ev) {
                self.point_1 = ev.position;
            };

            /**
             * set the position of point 2.
             * @param ev
             */
            var setPoint2 = function (ev) {
                self.point_2 = ev.position;
            };

            /**
             * set the position of point 3.
             * @param ev
             */
            var setPoint3 = function (ev) {
                self.point_3 = ev.position;
            };

            return [
                new PointDragger(getPoint0, setPoint0, draggerStyle),
                new PointDragger(getPoint1, setPoint1, draggerStyle),
                new PointDragger(getPoint2, setPoint2, draggerStyle),
                new PointDragger(getPoint3, setPoint3, draggerStyle)
            ];
        };


        return BezierCurve;

    }));
