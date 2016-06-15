/**
 * Created by Julian Dobrot on 15.06.2016.
 */
/* requireJS module definition */
define(["three","parametric","BufferGeometry"],
    (function(THREE,ParametricSurface,BufferGeometry) {

        "use strict";

        var Bohrer = function () {


            var paramFunction = function (u, v) {
                var cubeConst = Math.pow(Math.pow(Math.sin(u), 6) * (Math.pow(Math.sin(v), 6) + Math.pow(Math.cos(v), 6)) + Math.pow(Math.cos(u), 6), 1 / 6);
                var pos3D = [
                    ((torsoSize[0] * 0.5) * Math.sin(u) * Math.cos(v)) / Math.pow(Math.pow(Math.sin(u), 6) * (Math.pow(Math.sin(v), 6) + Math.pow(Math.cos(v), 6)) + Math.pow(Math.cos(u), 6), 1 / 6),
                    ((torsoSize[1] * 0.5) * Math.sin(u) * Math.sin(v)) / cubeConst,
                    ((torsoSize[2] * 0.5) * Math.cos(u)) / cubeConst
                ];
                return pos3D;
            };

            var configuration = {
                segmentsU: 25,
                segmentsV: 25,
                uMin: -Math.PI,
                uMax: Math.PI,
                vMin: -0.5 * Math.PI,
                vMax: 0.5 * Math.PI
            };

            var paramSurface = new ParametricSurface(paramFunction, configuration);
            var bufferGeometryParametric = new BufferGeometry(false,true,false);

            bufferGeometryParametric.addAttribute("position", paramSurface.getPositions());
            bufferGeometryParametric.addAttribute("color", paramSurface.getColors());
            bufferGeometryParametric.setIndex(paramSurface.getIndices());



        };

        return Bohrer;
    }));

