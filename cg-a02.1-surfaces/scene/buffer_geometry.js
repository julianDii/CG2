/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: BufferGeometry
 *
 * BufferGeometry Vertex-Arrays and Vertex-Attributes
 * stored in float32 arrays for the given attributes.
 * In our cases we assume all attributes have
 * numItems*3 size e.g. position (x, y, z), color (r, g, b)
 *
 * BufferGeometry is (at least for now) used to render Points with
 * vertexcolors.
 * Therefore we add a point material (THREE.PointsMaterial) and point container (THREE.Points).
 *
 */

/* requireJS module definition */
define(["three"],
    (function (THREE) {

        "use strict";

        var BufferGeometry = function (points,wireframe,mesh) {
            d
            this.mesh = undefined;

            this.geometry = new THREE.BufferGeometry();

            this.materials = [];

            if (points) {
                this.materials.push(new THREE.PointsMaterial({
                    color: 0xaaaaaa,
                    size: 10,
                    vertexColors: THREE.VertexColors,

                }));
            }

            if (mesh) {
                this.materials.push(new THREE.MeshBasicMaterial({
                    color:  0xffffff,
                    vertexColors: THREE.VertexColors,
                    side: THREE.DoubleSide
                }));

            }


            if (wireframe) {
                this.materials.push(new THREE.MeshBasicMaterial({
                    color: 0xaaaaaa,
                    wireframe: true,
                    vertexColors: THREE.FaceColors
                }));
            }
            
            this.addAttribute = function(name, buffer) {
                this.geometry.addAttribute(name, new THREE.BufferAttribute(buffer, 3));
                this.geometry.computeBoundingSphere();

                if (points && (!wireframe && !mesh)) {
                    this.mesh = new THREE.Points(this.geometry, this.materials[0]);
                } else {
                    this.mesh = THREE.SceneUtils.createMultiMaterialObject(this.geometry, this.materials);
                }
            }

            this.setIndex = function (buffer) {
                this.geometry.setIndex(new THREE.BufferAttribute(buffer, 1));
            };

            this.getMesh = function () {
                return this.mesh;
            };

        };

        return BufferGeometry;

    }));;