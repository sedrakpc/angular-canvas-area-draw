'use strict';
(function(window) {
    angular.module('sd.canvas-area-draw', []);
    angular.module('sd.canvas-area-draw')
        .directive('canvasAreaDraw', function () {
            return {
                restrict: 'A',
                scope: {
                    imageUrl: '=',
                    enabled: '=',
                    palette: '=',
                    points: '=',
                    active: '='
                },
                controller: function () {
                    this.dotLineLength = function(x, y, x0, y0, x1, y1, o) {
                        function lineLength(x, y, x0, y0){
                            return Math.sqrt((x -= x0) * x + (y -= y0) * y);
                        }
                        if(o && !(o = function(x, y, x0, y0, x1, y1){
                                if(!(x1 - x0)) return {x: x0, y: y};
                                else if(!(y1 - y0)) return {x: x, y: y0};
                                var left, tg = -1 / ((y1 - y0) / (x1 - x0));
                                return {x: left = (x1 * (x * tg - y + y0) + x0 * (x * - tg + y - y1)) / (tg * (x1 - x0) + y0 - y1), y: tg * left - tg * x + y};
                            }(x, y, x0, y0, x1, y1), o.x >= Math.min(x0, x1) && o.x <= Math.max(x0, x1) && o.y >= Math.min(y0, y1) && o.y <= Math.max(y0, y1))){
                            var l1 = lineLength(x, y, x0, y0), l2 = lineLength(x, y, x1, y1);
                            return l1 > l2 ? l2 : l1;
                        }
                        else {
                            var a = y0 - y1, b = x1 - x0, c = x0 * y1 - y0 * x1;
                            return Math.abs(a * x + b * y + c) / Math.sqrt(a * a + b * b);
                        }
                    };
                    this.hexToRgb = function(hex){
                        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                        return result ? {
                            r: parseInt(result[1], 16),
                            g: parseInt(result[2], 16),
                            b: parseInt(result[3], 16)
                        } : null;
                    };
                    this.getMousePos = function (canvas, evt) {
                        var rect = canvas.getBoundingClientRect();
                        return {
                            x: evt.clientX - rect.left,
                            y: evt.clientY - rect.top
                        };
                    };
                },
                link: function(scope, element, attrs, ctrl){

                    var activePoint, settings = {};
                    var $canvas, ctx, image;

                    settings.imageUrl = scope.imageUrl;

                    if(!scope.points) {
                        scope.points = [[]];
                    }

                    if(!scope.active) {
                        scope.active = 0;
                    }

                    $canvas = $('<canvas>');
                    ctx = $canvas[0].getContext('2d');

                    image = new Image();
                    scope.resize = function() {
                        $canvas.attr('height', image.height).attr('width', image.width);
                        $canvas.attr('height', $canvas[0].offsetHeight).attr('width', $canvas[0].offsetWidth);
                        scope.draw();
                    };
                    $(image).load(scope.resize);
                    image.src = settings.imageUrl;
                    if (image.loaded) scope.resize();
                    $canvas.css({background: 'url('+image.src+')'});
                    $canvas.css({backgroundSize: 'contain'});

                    $(element).append($canvas);

                    scope.move = function(e) {
                        if(!e.offsetX) {
                            e.offsetX = (e.pageX - $(e.target).offset().left);
                            e.offsetY = (e.pageY - $(e.target).offset().top);
                        }
                        var points = scope.points[scope.active];
                        points[activePoint][0] = Math.round(e.offsetX);
                        points[activePoint][1] = Math.round(e.offsetY);
                        scope.record();
                        scope.draw();
                    };

                    scope.stopdrag = function() {
                        element.off('mousemove');
                        scope.record();
                        activePoint = null;
                    };

                    scope.rightclick = function(e) {
                        e.preventDefault();
                        if(!e.offsetX) {
                            e.offsetX = (e.pageX - $(e.target).offset().left);
                            e.offsetY = (e.pageY - $(e.target).offset().top);
                        }
                        var x = e.offsetX, y = e.offsetY;
                        var points = scope.points[scope.active];
                        for (var i = 0; i < points.length; ++i) {
                            var dis = Math.sqrt(Math.pow(x - points[i][0], 2) + Math.pow(y - points[i][1], 2));
                            if ( dis < 6 ) {
                                points.splice(i, 1);
                                scope.draw();
                                scope.record();
                                return false;
                            }
                        }
                        return false;
                    };

                    scope.mousedown = function(e) {
                        if (!scope.enabled) {
                            return false;
                        }
                        var points = scope.points[scope.active];
                        var x, y, dis, minDis = 0, minDisIndex = -1, lineDis, insertAt = points.length;

                        if (e.which === 3) {
                            return false;
                        }

                        e.preventDefault();
                        if(!e.offsetX) {
                            e.offsetX = (e.pageX - $(e.target).offset().left);
                            e.offsetY = (e.pageY - $(e.target).offset().top);
                        }
                        var mousePos = ctrl.getMousePos($canvas[0], e);
                        x = mousePos.x; y = mousePos.y;
                        for (var i = 0; i < points.length; ++i) {
                            dis = Math.sqrt(Math.pow(x - points[i][0], 2) + Math.pow(y - points[i][1], 2));
                            if(minDisIndex == -1 || minDis > dis) {
                                minDis = dis;
                                minDisIndex = i;
                            }
                        }
                        if ( minDis < 6 && minDisIndex >= 0 ) {
                            activePoint = minDisIndex;
                            element.on('mousemove', scope.move);
                            return false;
                        }

                        for (var i = 0; i < points.length; ++i) {
                            if (i > 1) {
                                lineDis = ctrl.dotLineLength(
                                    x, y,
                                    points[i][0], points[i][1],
                                    points[i-1][0], points[i-1][1],
                                    true
                                );
                                if (lineDis < 6) {
                                    insertAt = i;
                                }
                            }
                        }

                        points.splice(insertAt, 0, [Math.round(x), Math.round(y)]);
                        activePoint = insertAt;
                        element.on('mousemove', scope.move);

                        scope.draw();
                        scope.record();

                        return false;
                    };

                    scope.draw = function() {
                        ctx.canvas.width = ctx.canvas.width;
                        if(scope.points.length > 0) {
                            scope.drawSingle(scope.points[scope.active], scope.active);
                        }
                        for(var p = 0; p < scope.points.length; ++p) {
                            var points = scope.points[p];
                            if (points.length == 0 || scope.active == p) {
                                continue;
                            }
                            scope.drawSingle(points, p);
                        }

                    };

                    scope.drawSingle = function (points, p) {

                        ctx.globalCompositeOperation = 'destination-over';
                        ctx.fillStyle = 'rgb(255,255,255)';
                        ctx.strokeStyle = scope.palette[p];
                        ctx.lineWidth = 1;

                        ctx.beginPath();
                        // ctx.moveTo(points[0], points[1]);
                        for (var i = 0; i < points.length; ++i) {
                            if(scope.active == p) {
                                ctx.fillRect(points[i][0] - 2, points[i][1] - 2, 4, 4);
                                ctx.strokeRect(points[i][0] - 2, points[i][1] - 2, 4, 4);
                            }
                            ctx.lineTo(points[i][0], points[i][1]);
                        }
                        ctx.closePath();
                        if(!scope.palette[p]) {
                            scope.palette[p] =  '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4)
                        }
                        var fillColor = ctrl.hexToRgb(scope.palette[p]);
                        ctx.fillStyle = 'rgba(' + fillColor.r + ',' + fillColor.g + ',' + fillColor.b + ',0.3)';
                        ctx.fill();
                        ctx.stroke();
                    };

                    scope.record = function() {
                        scope.$apply();
                    };

                    scope.$watch('points', function (newVal, oldVal) {
                        scope.draw();
                    }, true);

                    scope.$watch('active', function (newVal, oldVal) {
                        if (newVal != oldVal) scope.draw();
                    });

                    $canvas.on('mousedown', scope.mousedown);
                    $canvas.on('contextmenu', scope.rightclick);
                    $canvas.on('mouseup', scope.stopdrag);
                }
            };
        });
}(this));