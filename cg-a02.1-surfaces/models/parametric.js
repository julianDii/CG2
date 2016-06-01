/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: ParametricSurface
 *
 */

/* requireJS module definition */
define(["three","random"],
    (function (THREE) {

        "use strict";

        var ParametricSurface = function (posFunc, config) {

            var segmentsU = config.uSegments || 10;
            var segmentsV = config.vSegments || 10;
            var uMin = config.uMin || Math.PI / 2 * (-1);
            var uMax = config.uMax || Math.PI / 2;
            var vMin = config.vMin || Math.PI * (-1);
            var vMax = config.vMax || Math.PI;

            this.positions = new Float32Array((segmentsU + 1) * (segmentsV + 1) * 3);
            this.colors = new Float32Array(this.positions.length);

            var color = new THREE.Color();
            
            color.setRGB(Math.random(),Math.random(),Math.random());

            this.indices = new Uint32Array(segmentsU * segmentsV * 2 * 3);

            for (var u = 0, index = 0, count = 0; u < segmentsU; u++) {
                for (var v = 0; v < segmentsV; v++) {

                    this.indices[index] = count;
                    this.indices[index + 1] = count + segmentsV + 1 + 1;
                    this.indices[index + 2] = count + 1;

                    this.indices[index + 3] = count;
                    this.indices[index + 4] = count + segmentsV + 1;
                    this.indices[index + 5] = count + segmentsV + 1 + 1;

                    count++;
                    index += 6;
                }
                count++;
            }

            var uStep = segmentsU + 1;
            var vStep = segmentsV + 1;

          
            for (var u = uMin, i = 0; u <= uMax; u += (uMax > u) ? ((uMax - u) / uStep) : (uMax + 1)) {
                for (var v = vMin; v <= vMax; v += (vMax > v) ? ((vMax - v) / vStep) : (vMax + 1)) {

                    var pos3d = posFunc(u, v);

                    this.positions[i] = pos3d[0];
                    this.positions[i + 1] = pos3d[1];
                    this.positions[i + 2] = pos3d[2];

                    this.colors[i] = color.r;
                    this.colors[i + 1] = color.g;
                    this.colors[i + 2] = color.b;

                    i += 3;
                    vStep--;
                }
                vStep = segmentsV + 1;
                uStep--;
            }

            this.getPositions = function () {
                return this.positions;
            };

            this.getColors = function () {
                return this.colors;
            };

            this.getIndices = function () {
                return this.indices;
            };
        };

        return ParametricSurface;
    }));