/**
 * Created by Julian Dobrot on 15.06.2016.
 */

/* requireJS module definition */
define(["three","parametric","BufferGeometry"],
    (function(THREE,ParametricSurface,BufferGeometry) {

        "use strict";

        var Robo = function () {

            var torsoSize = [500, 300, 200];
            var upperArmSize = [75 / 2, 75 / 2, 100];
            var lowerArmSize = [50, 50, 175];
            var legSize = [45, 45, 220];
            var footSize = [100, 50, 150];
            
            //Auge

            var paramFunction1 = function (u, v) {

                var pos3D = [

                    8 * (1-u)*(3+Math.cos(v))*(Math.cos(2*Math.PI*u)),
                    7 * (1-u)*(3+Math.cos(v))*Math.sin(2*Math.PI*u),
                    7 * 6*u+(1-u)*Math.sin(v)

                ];
                return pos3D;
            };

            //hand
            var paramFunction2 = function (u, v) {

                var pos3D = [

                    6 * (1-u)*(3+Math.cos(v))*(Math.cos(2*Math.PI*u)),
                    6 * (1-u)*(3+Math.cos(v))*Math.sin(2*Math.PI*u),
                    7 * 6*u+(1-u)*Math.sin(v)

                ];
                return pos3D;
            };

            //mund

            var paramFunction3 = function (u, v) {

                var pos3D = [

                    12 *  u*Math.cos(v),
                    23 *  u*Math.sin(v),
                    19 *  v

                ];
                return pos3D;
            };

            var setSpiralConfiguration= function () {

                var configuration1 = {
                    segmentsU: 100,
                    segmentsV: 100,
                    uMin: Math.PI*(-1),
                    uMax: 1,
                    vMin: Math.PI*(-1),
                    vMax: 2 * Math.PI
                };

                return configuration1
            }

            var bufferGeometryParametric1 = new BufferGeometry(false,true,false);
            var bufferGeometryParametric2 = new BufferGeometry(false,true,false);
            var bufferGeometryParametric3 = new BufferGeometry(false,true,false);
            var bufferGeometryParametric4 = new BufferGeometry(false,true,false);
            var bufferGeometryParametric5= new BufferGeometry(false,true,false);

            var paramSurface1 = new ParametricSurface(paramFunction1,setSpiralConfiguration);
            var paramSurface2 = new ParametricSurface(paramFunction2,setSpiralConfiguration);
            var paramSurface3 = new ParametricSurface(paramFunction3,setSpiralConfiguration);

            bufferGeometryParametric1.addAttribute("position", paramSurface1.getPositions());
            bufferGeometryParametric1.addAttribute("color", paramSurface1.getColors());
            bufferGeometryParametric1.setIndex(paramSurface1.getIndices());

            bufferGeometryParametric2.addAttribute("position", paramSurface1.getPositions());
            bufferGeometryParametric2.addAttribute("color", paramSurface1.getColors());
            bufferGeometryParametric2.setIndex(paramSurface1.getIndices());

            bufferGeometryParametric3.addAttribute("position", paramSurface2.getPositions());
            bufferGeometryParametric3.addAttribute("color", paramSurface1.getColors());
            bufferGeometryParametric3.setIndex(paramSurface1.getIndices());

            bufferGeometryParametric4.addAttribute("position", paramSurface2.getPositions());
            bufferGeometryParametric4.addAttribute("color", paramSurface1.getColors());
            bufferGeometryParametric4.setIndex(paramSurface1.getIndices());

            bufferGeometryParametric5.addAttribute("position", paramSurface3.getPositions());
            bufferGeometryParametric5.addAttribute("color", paramSurface3.getColors());
            bufferGeometryParametric5.setIndex(paramSurface3.getIndices());


            this.root = new THREE.Object3D();

            //skelett
            this.head = new THREE.Object3D();
            this.head.name = "head";

            this.head.translateY(290);

            this.mund = new THREE.Object3D();
            this.mund.name = "mund";
            this.mund.translateZ(110);
            this.mund.translateY(-90);
            this.mund.translateX(-30);

            this.mund.rotateY(Math.PI/2)

            this.leftEye = new THREE.Object3D();
            this.leftEye.name = "lefteye";
            this.leftEye.translateZ(200);
            this.leftEye.translateX(-160)
            this.leftEye.translateY(Math.PI/2);


            this.rightEye = new THREE.Object3D();
            this.rightEye.name = "righteye";
            this.rightEye.translateX(160);
            this.rightEye.translateZ(200);
            this.rightEye.translateY(Math.PI/2);

            this.rightHand = new THREE.Object3D();
            this.rightHand.name = "righthand";
            this.rightHand.rotateX(Math.PI/2);
            this.rightHand.translateZ(175);

            this.leftHand = new THREE.Object3D();
            this.leftHand.name = "lefthand";
            this.leftHand.rotateX(Math.PI/2);
            this.leftHand.translateZ(175);

            this.torso = new THREE.Object3D();
            this.torso.name = "torso";

            this.leftShoulder = new THREE.Object3D();
            this.leftShoulder.name = "leftShoulder";
            this.leftShoulder.translateX(torsoSize[0] / 2).translateY(torsoSize[1] / 2 - upperArmSize[0]);

            this.rightShoulder = this.leftShoulder.clone();
            this.rightShoulder.name = "rightShoulder";
            this.rightShoulder.translateX(-torsoSize[0]);

            this.upperArmLeft = new THREE.Object3D();
            this.upperArmLeft.name = "upperArmLeft";
            this.upperArmLeft.translateX(upperArmSize[2] / 2);

            this.upperArmRight = this.upperArmLeft.clone().translateX(-upperArmSize[2]);
            this.upperArmRight.name = "upperArmRight";

            this.elbowLeft = new THREE.Object3D();
            this.elbowLeft.name = "elbowLeft";
            this.elbowLeft.translateX(upperArmSize[2] / 2 + lowerArmSize[0] / 2);

            this.elbowRight = this.elbowLeft.clone().translateX(-upperArmSize[2] - lowerArmSize[0]);
            this.elbowRight.name = "elbowRight";

            this.lowerArmLeft = new THREE.Object3D();
            this.lowerArmLeft.name = "lowerArmLeft";
            this.lowerArmLeft.translateY(-lowerArmSize[2] / 2);

            this.lowerArmRight = this.lowerArmLeft.clone();
            this.lowerArmRight.name = "lowerArmRight";

            this.handLeft = new THREE.Object3D();
            this.handLeft.name = "handLeft";
            this.handLeft.translateY(-lowerArmSize[2] / 2);

            this.handRight = this.handLeft.clone();
            this.handRight.name = "handRight";

            this.leftHip = new THREE.Object3D();
            this.leftHip.name = "leftHip";
            this.leftHip.translateX(torsoSize[0] / 4);
            this.leftHip.translateY(-torsoSize[1] / 2);

            this.rightHip = this.leftHip.clone();
            this.rightHip.name = "rightHip";
            this.rightHip.translateX(-torsoSize[0] / 2)


            this.leftLeg = new THREE.Object3D();
            this.leftLeg.name = "leftLeg";
            this.leftLeg.translateY(-legSize [2] / 2);

            this.rightLeg = this.leftLeg.clone();
            this.rightLeg.name = "rightLeg";

            this.leftFoot = new THREE.Object3D();
            this.leftFoot.name = "leftFoot";
            this.leftFoot.translateY(-legSize[2] / 2 - footSize[1] / 2);
            this.leftFoot.translateZ(legSize[0] / 2);

            this.rightFoot = this.leftFoot.clone();
            this.rightFoot.name = "rightFoot";


            //hierarchy
            this.lowerArmLeft.add(this.leftHand);
            this.lowerArmRight.add(this.rightHand);
            this.elbowLeft.add(this.lowerArmLeft);
            this.elbowRight.add(this.lowerArmRight);
            this.upperArmLeft.add(this.elbowLeft);
            this.upperArmRight.add(this.elbowRight);
            this.leftShoulder.add(this.upperArmLeft);
            this.rightShoulder.add(this.upperArmRight);
            this.torso.add(this.leftShoulder);
            this.torso.add(this.rightShoulder);
            this.torso.add(this.head);


            this.leftLeg.add(this.leftFoot);
            this.rightLeg.add(this.rightFoot);
            this.leftHip.add(this.leftLeg);
            this.rightHip.add(this.rightLeg);
            this.torso.add(this.leftHip);
            this.torso.add(this.rightHip);


            this.head.add(this.leftEye);
            this.head.add(this.rightEye);
            this.head.add(this.mund);

            //skin
            this.headSkin = new THREE.Mesh(new THREE.CubeGeometry(600,300,200), new THREE.MeshPhongMaterial());

            this.lefteyeSkin = bufferGeometryParametric1.getMesh();
            this.righteyeSkin = bufferGeometryParametric2.getMesh();
            this.leftHandSkin = bufferGeometryParametric3.getMesh();
            this.rightHandSkin = bufferGeometryParametric4.getMesh();
            this.mundSkin = bufferGeometryParametric5.getMesh();

            this.torsoSkin = new THREE.Mesh(new THREE.SphereGeometry(200,200,200), new THREE.MeshPhongMaterial());

            this.upperArmSkin = new THREE.Mesh(new THREE.CylinderGeometry(), new THREE.MeshPhongMaterial());
            this.upperArmSkin.rotateZ(Math.PI / 2);

            this.lowerArmSkin = new THREE.Mesh(new THREE.CubeGeometry(lowerArmSize[0], lowerArmSize[2],
                lowerArmSize[1]), new THREE.MeshPhongMaterial( ));

            this.elbowSkin = new THREE.Mesh(new THREE.SphereGeometry(80), new THREE.MeshPhongMaterial());

            this.handSkin = new THREE.Mesh(new THREE.SphereGeometry(lowerArmSize[0], 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshPhongMaterial());
            this.handSkin.rotateX(Math.PI);
            this.handSkinTop = new THREE.Mesh(new THREE.CircleGeometry(lowerArmSize[0]), new THREE.MeshPhongMaterial());
            this.handSkinTop.rotateX(Math.PI * 1.5);

            this.hipSkin = new THREE.Mesh(new THREE.SphereGeometry(100), new THREE.MeshPhongMaterial());

            this.legSkin = new THREE.Mesh(new THREE.CylinderGeometry(legSize[0], legSize[1],
                legSize[2]), new THREE.MeshPhongMaterial(  ));

            this.footSkin = new THREE.Mesh(new THREE.CubeGeometry(footSize[0], footSize[1],
                footSize[2]), new THREE.MeshPhongMaterial());

            //fusion of skins and skeleton
            this.head.add(this.headSkin);
            this.torso.add(this.torsoSkin);
            this.leftEye.add(this.lefteyeSkin);
            this.rightEye.add(this.righteyeSkin);
            this.mund.add(this.mundSkin);
            this.upperArmLeft.add(this.upperArmSkin);
            this.upperArmRight.add(this.upperArmSkin.clone());
            this.elbowLeft.add(this.elbowSkin);
            this.elbowRight.add(this.elbowSkin.clone());
            this.lowerArmLeft.add(this.lowerArmSkin);
            this.lowerArmRight.add(this.lowerArmSkin.clone());
            this.leftHand.add(this.leftHandSkin);
            this.rightHand.add(this.rightHandSkin);
            this.leftLeg.add(this.legSkin);
            this.rightLeg.add(this.legSkin.clone());
            this.leftFoot.add(this.footSkin);
            this.rightFoot.add(this.footSkin.clone());
            this.leftHip.add(this.hipSkin);
            this.rightHip.add(this.hipSkin.clone());
            this.leftShoulder.add(this.elbowSkin.clone());
            this.rightShoulder.add(this.elbowSkin.clone());


            this.root.add(this.torso);

            this.getMesh = function () {
                return this.root;
            };
        };

        return Robo;
    }));
