/*
 * Module: ObjMesh
 */

/* requireJS module definition */
define(["three", "OBJLoader"],
    (function(THREE, OBJLoader) {

        "use strict";

        /**
         * @param scene  - reference to the scene
         * @constructor
         */

        var ObjMesh = function() {

            var manager = new LoadingManager();
            var loader = new OBJLoader(manager);

            var loadedObj = undefined;
            var path = '../cg-a02.1-surfaces/CG2-A02_2_files/obj/dromedar.obj';
            var material = new THREE.MeshBasicMaterial({color: 'yellow'});

            loader.load(path, function(geometry){

               /* geometry.traverse(function (child) {

                    if (child instanceof THREE.Mesh) {
                        child.material = material;
                    }
                });*/

               loadedObj = geometry;
            });


            this.getMesh = function() {
                return loadedObj;
            };
        };

        return ObjMesh;
    }));
