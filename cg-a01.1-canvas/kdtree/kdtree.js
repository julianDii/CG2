/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Kristian Hildebrand, khildebrand@beuth-hochschule.de
 *
 * Module: KdTree
 *
 *
 */


/* requireJS module definition */
define(["kdutil", "KdNode", "vec2", "Scene", "BoundingBox"],
    (function(KdUtil, KdNode, vec2, Scene, BoundingBox) {

        "use strict";

        /**
         * Creates a kd-tree. The build function is directly called
         * on generation
         *
         * @param pointList
         * @constructor
         */
        var KdTree_con = function(pointList) {

            /**
             *
             * @param pointList - list of points
             * @param dim       - current axis
             * @param parent    - current parent (starts with root)
             * @param isLeft    - flag if node is left or right child of its parent
             * @returns returns root node after tree is build
             */
            this.build = function(pointList, dim, parent, isLeft) {

                // check whether or not jte pointlist has no points at all.
                if (pointList.length === 0) return undefined;

                // checks
                var axis = dim === 0 ? 1 : 0;


                //<Neuen Knoten im Baum erzeugen>
                var node = new KdNode(dim);


                // find the median point and position in the pointlist.
                var medianPos = KdUtil.sortAndMedian(pointList, node.dim);
                var medianPoint = pointList[medianPos];




                // cotainers for the bbox values
                var xMin, xMax, yMin, yMax;

                if (!parent) {

                    xMin = 0;
                    yMin = 0;
                    xMax = 500;
                    yMax = 400;

                    //<Berechne Bounding Box des Unterbaumes / node.bbox >

                } else {
                    if (dim === 0) {
                        if (isLeft) {
                            xMin = parent.bbox.xmin;
                            yMin = parent.bbox.ymin;
                            xMax = parent.bbox.xmax;
                            yMax = parent.point.center[1];
                        } else {
                            xMin = parent.bbox.xmin;
                            yMin = parent.point.center[1];
                            xMax = parent.bbox.xmax;
                            yMax = parent.bbox.ymax;
                        }
                    } else {
                        if (isLeft) {
                            xMin = parent.bbox.xmin;
                            yMin = parent.bbox.ymin;
                            xMax = parent.point.center[0];
                            yMax = parent.bbox.ymax;
                        } else {
                            xMin = parent.point.center[0];
                            yMin = parent.bbox.ymin;
                            xMax = parent.bbox.xmax;
                            yMax = parent.bbox.ymax;
                        }
                    }
                }

                // set the node bbox with the calculated new values
                node.bbox = new BoundingBox(xMin, yMin, xMax, yMax, medianPoint, dim);



                //<set node.point>
                // Here we have to set the Median point as the node.
                node.point = medianPoint;


                // container for all leftchildren
                var leftChildren = pointList.slice(0, medianPos);
                // container for the rightchildren
                var rightChildren = pointList.slice(medianPos + 1);

                //<Extrahiere Punkte für die rechte Unterbaumhälfte
                node.rightChild = this.build(rightChildren, axis, node, false);


                //<Extrahiere Punkte für die linke Unterbaumhälfte>
                node.leftChild = this.build(leftChildren, axis, node, true);


                return node;

            };

            /**
             * Given a query point the function return its nearest neighbor by traversing
             * down the tree
             *
             * @param node - current tree node
             * @param query - query node
             * @param nearestDistance - current nearest distance to query node
             * @param currentBest - current best/nearest node to query node
             * @param dim - current axis (x or y)
             * @returns closest tree node to query node
             */
            this.findNearestNeighbor = function(node, query, currentBest, nearestDistance, dim) {

                if (!node) {
                    return currentBest;
                }

                var closest = currentBest;
                var closestDistance = nearestDistance;

                var dist = KdUtil.distance(node.point.center, query.center);
                if (dist < nearestDistance) {
                    closestDistance = dist;
                    closest = node;
                }

                var a, b;
                if (dim == 0) {
                    if (query.center[0] < node.point.center[0]) {
                        a = node.leftChild;
                        b = node.rightChild;
                    } else {
                        a = node.rightChild;
                        b = node.leftChild;
                    }
                } else {
                    if (query.center[1] < node.point.center[1]) {
                        a = node.leftChild;
                        b = node.rightChild;
                    } else {
                        a = node.rightChild;
                        b = node.leftChild;
                    }
                }

                var nextDim = (dim === 0) ? 1 : 0;
                if (a && a.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(a, query, closest, closestDistance, nextDim);
                    closestDistance = KdUtil.distance(closest.point.center, query.center);
                }

                if (b && b.bbox.distanceTo(query.center) < closestDistance) {
                    closest = this.findNearestNeighbor(b, query, closest, closestDistance, nextDim);
                }

                return closest;
            };


            //
            this.root = this.build(pointList, 0, null, undefined);
            console.log(" this is the root: ", this.root);

        };

        return KdTree_con;


    })); // define



