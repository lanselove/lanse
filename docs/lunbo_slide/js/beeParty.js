(function() {
    function Fader(opt) {
        this.element = opt.element;
        this.index = opt.index;
        this.DELAY = 1000/60;
        this.DURING = this.setting[(opt.speed)?opt.speed:"normal"] * 60/1000;
        this.BREAK = Math.round(this.DURING * 30/100);
        this.duration = this.DURING;
        this.timer = null;
        this.waitOut = false;
        this.pending = false;
        this.final = opt.final;
    }
    Fader.prototype = {
        setting: { "slow": 1000, "normal": 800, "fast": 600 },
        swing: function(b, c, d, t) {
            return b + c * Math.sin((Math.PI/2) * t/d);  // Sine.easeOut
        },
        fadeTo: function(target) {
            var that = this;
            var initial = (window.MSIE) ? parseFloat(this.element.style.filter.match(/opacity=([\d.]+)/)[1])/100 : parseFloat(this.element.style.opacity);
            var changed = target-initial;
            var count = 1;
            var animate = function() {
                var current = that.swing(initial, changed, that.DURING, count);
                // console.log("第"+that.index+"张", current, count);
                if (window.MSIE) {
                    that.element.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + current*100 + ")";
                } else {
                    that.element.style.opacity = current.toString();
                }
                if (count < that.duration) {
                    count++;
                    that.timer = setTimeout(animate, that.DELAY);
                } else {
                    that.next();
                }
            };
            this.timer = setTimeout(animate, this.DELAY);
        },
        fadeIn: function() {
            clearTimeout(this.timer);
            this.waitOut = false;
            this.pending = true;
            this.duration = this.DURING;
            this.fadeTo(1);
        },
        fadeOut: function() {
            if (this.pending) {
                this.waitOut = true;
                this.duration = this.BREAK;
            } else {
                this.pending = true;
                this.fadeTo(0);
            }
        },
        next: function() {
            if (this.waitOut) {
                this.waitOut = false;
                this.duration = this.DURING;
                this.fadeTo(0);
            } else {
                this.pending = false;
                if (this.final) {
                    this.final(this);
                }
            }
        },
        done: function() {
            return !this.pending;
        }
    };

    function Slider(opt) {
        this.element = opt.element;
        this.length = opt.length;
        this.aspect = opt.aspect;
        this.speed = this.setting[(opt.speed)?opt.speed:"normal"];
        this.DURING = this.speed * 60/1000;
        this.DELAY = 1000/60;
        this.pending = false;
        this.final = opt.final;
        this.infinite = opt.infinite;
        this.unitPix = opt.unitPix;
        if (this.infinite) this.reStyle();
    }
    Slider.prototype = {
        setting: {"fast":200,"normal":400,"slow":600, "left": "width", "top": "height"},
        reStyle: function() {
            var childs = this.element.children;
            this.element.style[this.aspect] = this.unitPix + "px";
            this.element.style[this.setting[this.aspect]] = (-1)*this.unitPix * (this.length+2) + "px";
            this.element.insertBefore(childs[this.length-1].cloneNode(true), childs[0]);
            this.element.appendChild(childs[1].cloneNode(true));
        },
        slide: function(offset) {
            var that = this;
            var timer = null;
            var initLeft = parseInt(this.element.style[this.aspect]);
            var count = 1;
            var move = function() {
                var current = initLeft + offset * (0.5 - Math.cos(Math.PI * count/that.DURING) / 2);
                that.element.style[that.aspect] = current + "px";
                if (count < that.DURING) {
                    count++;
                    timer = setTimeout(move, that.DELAY);
                } else {
                    if (that.infinite) {
                        if (current == (that.unitPix * (that.length+1))) {
                            that.element.style[that.aspect] = that.unitPix + "px";
                        }
                        if (current == 0) {
                            that.element.style[that.aspect] = that.unitPix * that.length + "px";
                        }
                    }
                    that.next();
                }
            };
            this.pending = true;
            timer = setTimeout(move, that.DELAY);
        },
        next: function() {
            this.pending = false;
            if (this.final) this.final(this);
        },
        done: function() {
            return !this.pending;
        }
    };

    function BeeParty(opt) {
        this.type = opt.type || "fade";
        this.speed = opt.speed || "normal";
        this.wrapLayer = opt.wrapLayer;
        this.picsLayer = opt.picsLayer;
        this.ctrlBtns = opt.ctrlBtns;
        this.ctrlWay = opt.ctrlWay || "click";
        this.ctrlPrev = opt.ctrlPrev;
        this.ctrlNext = opt.ctrlNext;
        this.isAutoPlay = (typeof(opt.isAutoPlay)=="undefined") ? true : opt.isAutoPlay;  //可选
        this.spacing = opt.spacing || 3000;
        this.playTimer = null;
        this.infinite = (typeof(opt.infinite)=="undefined") ? true : opt.infinite;  //slide可选

        this.touchON = (typeof(opt.touchON)=="undefined") ? true : opt.touchON;
        this.pixRatio = opt.pixRatio;

        this.init();
    }
    BeeParty.prototype = {
        setting: {"left": "pageX", "top": "pageY"},
        init: function() {
            this.pics = this.picsLayer.children;
            this.length = this.pics.length;
            this.lastIndex = 0;
            this.curIndex = 0;
            if (this.type == "fade") {
                this.genFader();
            } else if (this.type == "moveX") {
                this.genMoveX();
            } else {
                this.genMoveY();
            }
            if (!!document.addEventListener) {
                this.msie = false;
            } else {
                this.msie = true;
            }
            this.bindEvents();
            if (this.isAutoPlay) this.autoPlay();
        },
        genFader: function() {
            var that = this;
            var beeSet = [];
            if (window.screen.width < 600) {
                this.wrapLayer.style.height = Math.round(this.wrapLayer.clientWidth*this.pixRatio) + "px";
                if (this.touchON) this.bindFadeMobile();
            }
            for (var i = 0; i < this.length; i++) {
                beeSet[i] = new Fader({
                    element: this.pics[i],
                    index: i,
                    speed: this.speed,
                    final: function(bee) {
                        if (that.isAutoPlay && bee.index == that.lastIndex) that.autoPlay();
                    }
                });
            }
            this.faders = beeSet;
            this.status = function() {
                return true;
            };
            this.swipTo = this.swipFade;
            this.swipPrev = this.swipFade;
            this.swipNext = this.swipFade;
            this.swipDone = function() {
                return that.faders[that.lastIndex].done();
            };
        },
        genMoveX: function() {
            var that = this;
            var wrapWidth = 0;
            // ie9以上的clientWidth第一次获取时会等于整个页面的宽度，不知是否margin的影响
            console.log(this.wrapLayer.clientWidth);
            wrapWidth = Math.round(this.wrapLayer.clientWidth);
            this.wrapLayer.style.height = Math.round(wrapWidth*this.pixRatio) + "px";
            // 活动相关的属性全部取整数，以防微弱的像素误差，因为css设置属性百分比时计算值可能为浮点数
            for (var i = 0; i < this.pics.length; i++) {
                this.pics[i].style.width = wrapWidth + "px";
            }
            if (this.touchON && window.screen.width < 600) this.bindSlideMobile("left");
            this.unitOffset = (-1) * wrapWidth;
            this.slider = new Slider({
                element: this.picsLayer,
                length: this.length,
                aspect: "left",
                speed: this.speed,
                infinite: this.infinite,
                unitPix: this.unitOffset,
                final: function(bee) {
                    if (that.isAutoPlay) that.autoPlay();
                }
            });
            this.status = function() {
                return that.slider.done();
            };
            this.swipTo = function() {
                that.swipSlide(that.unitOffset * (that.curIndex - that.lastIndex));
            };
            this.swipPrev = function() {
                that.swipSlide(that.unitOffset * (-1));
            };
            this.swipNext = function() {
                that.swipSlide(that.unitOffset);
            };
            this.swipDone = this.status;
        },
        genMoveY: function() {
            var that = this;
            var wrapheight = 0;
            console.log(this.wrapLayer.clientWidth);
            wrapheight = Math.round(this.wrapLayer.clientWidth*this.pixRatio);
            this.wrapLayer.style.height = wrapheight + "px";
            for (var i = 0; i < this.pics.length; i++) {
                this.pics[i].style.height = wrapheight + "px";
            }
            if (this.touchON && window.screen.width < 600) this.bindSlideMobile("top");
            this.unitOffset = (-1) * wrapheight;
            this.slider = new Slider({
                element: this.picsLayer,
                length: this.length,
                aspect: "top",
                speed: this.speed,
                infinite: this.infinite,
                unitPix: this.unitOffset,
                final: function(bee) {
                    if (that.isAutoPlay) that.autoPlay();
                }
            });
            this.status = function() {
                return that.slider.done();
            };
            this.swipTo = function() {
                that.swipSlide(that.unitOffset * (that.curIndex - that.lastIndex));
            };
            this.swipPrev = function() {
                that.swipSlide(that.unitOffset * (-1));
            };
            this.swipNext = function() {
                that.swipSlide(that.unitOffset);
            };
            this.swipDone = this.status;
        },
        swipFade: function() {
            this.faders[this.lastIndex].fadeOut();
            this.faders[this.curIndex].fadeIn();
            if(this.ctrlBtns) {
                this.ctrlBtns[this.lastIndex].className = "";
                this.ctrlBtns[this.curIndex].className = "active";
            }
        },
        swipSlide: function(offset) {
            if (!this.infinite) offset = this.unitOffset * (this.curIndex - this.lastIndex);
            this.slider.slide(offset);
            if(this.ctrlBtns) {
                this.ctrlBtns[this.lastIndex].className = "";
                this.ctrlBtns[this.curIndex].className = "active";
            }
        },
        autoPlay: function() {
            var that = this;
            this.playTimer = setTimeout(function() {
                that.lastIndex = that.curIndex++;
                if(that.lastIndex == that.length-1) {
                    that.curIndex = 0;
                }
                that.swipNext();
            }, this.spacing);
        },
        addListener: function(element, eventType, handle) {
            if (this.msie) {
                element.attachEvent('on'+eventType, function(){
                    handle.call(element, arguments);
                });
            } else {
                element.addEventListener(eventType, handle);
            }
        },
        bindEvents: function() {
            var that = this;
            console.log(this);
            if (this.isAutoPlay) {
                this.addListener(this.wrapLayer, "mouseenter", function() {
                    that.isAutoPlay = false;
                    clearTimeout(that.playTimer);
                });
                this.addListener(this.wrapLayer, "mouseleave", function() {
                    that.isAutoPlay = true;
                    if (that.swipDone()) that.autoPlay();
                });
            }
            if (this.ctrlBtns) {
                for (var i = 0; i < this.length; i++) {
                    (function(index) {
                        that.addListener(that.ctrlBtns[index], that.ctrlWay, function() {
                            if (!that.status()) return;
                            if (index != that.curIndex) {
                                that.lastIndex = that.curIndex;
                                that.curIndex = index;
                                that.swipTo();
                            }
                        });
                    })(i);
                }
            }
            this.ctrlPrev && this.addListener(this.ctrlPrev, "click", function() {
                if (!that.status()) return;
                that.lastIndex = that.curIndex--;
                if(that.lastIndex == 0) {
                    that.curIndex = that.length-1;
                }
                that.swipPrev();
            });
            this.ctrlNext && this.addListener(this.ctrlNext, "click", function() {
                if (!that.status()) return;
                that.lastIndex = that.curIndex++;
                if(that.lastIndex == that.length-1) {
                    that.curIndex = 0;
                }
                that.swipNext();
            });
        },
        bindFadeMobile: function() {
            var that = this;
            var startX,endX,pacesX;
            var invalid = false;
            this.addListener(this.wrapLayer, "touchstart", function() {
                var touch = event.touches[0];
                startX = touch.pageX;
                invalid = true;
                if (that.isAutoPlay) {
                    that.isAutoPlay = false;
                    clearTimeout(that.playTimer);
                }
            });
            this.addListener(this.wrapLayer, "touchmove", function() {
                var touch = event.touches[0];
                endX = touch.pageX;
                invalid = false;
            });
            this.addListener(this.wrapLayer, "touchend", function() {
                if (invalid) return;
                pacesX = endX-startX;
                if(pacesX>50){
                    that.lastIndex = that.curIndex--;
                    if(that.lastIndex == 0) {
                        that.curIndex = that.length-1;
                    }
                    that.swipPrev();
                } else if(pacesX<-50){
                    that.lastIndex = that.curIndex++;
                    if(that.lastIndex == that.length-1) {
                        that.curIndex = 0;
                    }
                    that.swipNext();
                }
            });
        },
        bindSlideMobile: function(aspect) {
            var that = this;
            var start,paces,current;
            var invalid = false;
            this.addListener(this.wrapLayer, "touchstart", function() {
                var touch = event.touches[0];
                start = touch[that.setting[aspect]];
                current = that.unitOffset * (that.curIndex+1);
                invalid = true;
                if (that.isAutoPlay) {
                    that.isAutoPlay = false;
                    clearTimeout(that.playTimer);
                }
            });
            this.addListener(this.wrapLayer, "touchmove", function() {
                var touch = event.touches[0];
                paces = Math.round(touch[that.setting[aspect]]-start);
                that.picsLayer.style[aspect] = current+paces + "px";
                invalid = false;
            });
            this.addListener(this.wrapLayer, "touchend", function() {
                if (invalid) return;
                if (paces > 50){
                    that.lastIndex = that.curIndex--;
                    if(that.lastIndex == 0) {
                        that.curIndex = that.length-1;
                    }
                    that.swipSlide(that.unitOffset * (-1) - paces);
                } else if (paces < -50) {
                    that.lastIndex = that.curIndex++;
                    if(that.lastIndex == that.length-1) {
                        that.curIndex = 0;
                    }
                    that.swipSlide(that.unitOffset - paces);
                } else {
                    that.swipSlide(paces * (-1));
                }
            });
        }
    };

    window.swiper = function(opt) {
        return new BeeParty(opt);
    };
})();