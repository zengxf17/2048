require=function n(s,c,u){function a(e,t){if(!c[e]){if(!s[e]){var i="function"==typeof require&&require;if(!t&&i)return i(e,!0);if(h)return h(e,!0);var o=new Error("Cannot find module '"+e+"'");throw o.code="MODULE_NOT_FOUND",o}var r=c[e]={exports:{}};s[e][0].call(r.exports,function(t){return a(s[e][1][t]||t)},r,r.exports,n,s,c,u)}return c[e].exports}for(var h="function"==typeof require&&require,t=0;t<u.length;t++)a(u[t]);return a}({AudioMgr:[function(t,e,i){"use strict";cc._RF.push(e,"681da4n1/JHaKZYVrhLFq9u","AudioMgr"),Object.defineProperty(i,"__esModule",{value:!0});var o=function(){function t(){this.bgmVolume=.5,this.sfxVolume=.3,this.bgmAudioID=0,this.bgmCurrentTime=0,this.MAX_AUDIO_NUM=10;var t=cc.sys.localStorage.getItem("bgmVolume");null!=t&&(this.bgmVolume=parseFloat(t));var e=cc.sys.localStorage.getItem("sfxVolume");null!=e&&(this.sfxVolume=parseFloat(e)),cc.audioEngine.setMaxAudioInstance(this.MAX_AUDIO_NUM)}return t.prototype.init=function(){var t=this;cc.game.on(cc.game.EVENT_HIDE,function(){console.log("cc.audioEngine.pauseAll1"),t.pauseAll()}),cc.game.on(cc.game.EVENT_SHOW,function(){console.log("cc.audioEngine.resumeAll2"),t.resumeAll()})},t.prototype.getUrl=function(t){return cc.log(t),cc.url.raw("resources/audio/effectAudio/"+t)},t.prototype.playBGM=function(t){var e=this.getUrl(t);cc.log(e),0<=this.bgmAudioID&&cc.audioEngine.stop(this.bgmAudioID),this.bgmAudioID=cc.audioEngine.play(e,!0,this.bgmVolume)},t.prototype.StopBGM=function(){cc.audioEngine.stop(this.bgmAudioID)},t.prototype.playSFX=function(t){if(0<this.sfxVolume){var e=this.getUrl(t);cc.audioEngine.play(e,!1,this.sfxVolume)}},t.prototype.setSFXVolume=function(t){this.sfxVolume!=t&&(cc.sys.localStorage.setItem("sfxVolume",t),this.sfxVolume=t)},t.prototype.setBGMVolume=function(t){0<=this.bgmAudioID&&(0<t?cc.audioEngine.resume(this.bgmAudioID):cc.audioEngine.pause(this.bgmAudioID)),this.bgmVolume!=t&&(cc.sys.localStorage.setItem("bgmVolume",t),this.bgmVolume=t,cc.audioEngine.setVolume(this.bgmAudioID,t))},t.prototype.pauseAll=function(){0<this.bgmAudioID&&(this.bgmCurrentTime=cc.audioEngine.getCurrentTime(this.bgmAudioID)),cc.audioEngine.pauseAll()},t.prototype.resumeAll=function(){cc.audioEngine.resumeAll(),0<this.bgmVolume&&0<this.bgmAudioID&&cc.audioEngine.setCurrentTime(this.bgmAudioID,this.bgmCurrentTime)},t}();i.default=o,cc._RF.pop()},{}],Game:[function(t,e,i){"use strict";cc._RF.push(e,"64b8176Jz1ACbR6ZTDH7KkE","Game"),Object.defineProperty(i,"__esModule",{value:!0});var a,o,h,r,l=t("./Item"),n=t("./AudioMgr"),s=cc._decorator,c=s.ccclass,u=s.property;(o=a=i.slideDirection||(i.slideDirection={}))[o.LeftRight=1]="LeftRight",o[o.UpDown=2]="UpDown",(r=h=i.direction||(i.direction={}))[r.left=0]="left",r[r.right=1]="right",r[r.up=2]="up",r[r.down=3]="down";var d=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.numberAtlas=null,t.squareItem=null,t.content=null,t.scoreLab=null,t.stepLab=null,t.effectNode=null,t._pos=null,t._endPos=null,t._startPos=null,t._cancelPos=null,t._score=0,t._step=0,t._mergeStep=0,t.squareNum=4,t._sqrt=null,t._sqrt2=null,t._direction=h.left,t._slide=a.LeftRight,t._armature=null,t._isMerge=!1,t._audioID=-1,t._AudioMgr=null,t._clickFlag=!0,t}return __extends(t,e),i=t,Object.defineProperty(t,"instance",{get:function(){return i._instance},enumerable:!0,configurable:!0}),t.prototype.onLoad=function(){(i._instance=this)._AudioMgr=new n.default,this._AudioMgr.StopBGM(),this.initGame(),this.content.width=this._sqrt[0][0].width*this.squareNum+20*(this.squareNum+1),this.content.height=this._sqrt[0][0].height*this.squareNum+20*(this.squareNum+1),this.node.on(cc.Node.EventType.TOUCH_END,this.touchEnd,this),this.node.on(cc.Node.EventType.TOUCH_START,this.touchStart,this),this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.touchCancel,this),this.initEffect()},t.prototype.initEffect=function(){var t=this.effectNode.getComponent(dragonBones.ArmatureDisplay);this._armature=t.armature()},t.prototype.setEffectNode=function(t){this._armature.animation.fadeIn(t,-1,-1,0,"normal")},t.prototype.setEffectName=function(t){var e="";switch(t){case 8:e="dbgood";break;case 9:e="dbgreat";break;case 10:e="dbperfect";break;case 11:e="dbunbele";break;case 12:e="damazing"}""==e||this.setEffectNode(e)},t.prototype.playAudioEffect=function(){if(cc.log("播放特效id----\x3e>>",this._audioID),12<this._audioID)return this._audioID=-1,void cc.log("你太牛逼了..连销12个..厉害了，从0继续吧");this._audioID<=0?cc.log("下一次就有声音了哦"):(this.setEffectName(this._audioID),this._AudioMgr.playSFX("audio"+this._audioID+".ogg"),this._mergeStep++)},t.prototype.initGame=function(){var t=this;this._sqrt=new Array,this._sqrt2=new Array;for(var e=0;e<this.squareNum;e++)this._sqrt2[e]=new Array;for(e=0;e<this.squareNum;e++){this._sqrt[e]=new Array;for(var i=0;i<this.squareNum;i++){var o=cc.instantiate(this.squareItem);o.name=e+""+i,this._sqrt[e][i]=o,this._sqrt2[i][e]=o,this.content.addChild(o),this.initPos(o,e,i)}}this.scheduleOnce(function(){t.initGrid()},.2)},t.prototype.initPos=function(t,e,i){var o=t.width*i+t.width/2+20*(i+1),r=t.height*e+t.width/2+20*(e+1)+20;t.position=cc.v2(o,-r)},t.prototype.initGrid=function(){var t=this.randomLocation(),e=this.randomLocation(),i=this.randomNumber(),o=this.randomNumber(),r=this.content.getChildByName(t.l+""+t.r),n=this.content.getChildByName(e.l+""+e.r);r.getComponent(l.default).showNumber(i,!0),n.getComponent(l.default).showNumber(o,!0)},t.prototype.setLabInfo=function(){this.scoreLab.string=this._score+"",this.stepLab.string=this._step+""},t.prototype.everyTimeMoveCallback=function(){this._AudioMgr.playSFX("move.ogg")},t.prototype.everyTimeEndCallback=function(){},t.prototype.everyTimeMergeCallBack=function(){},t.prototype.touchEnd=function(t){if(this._clickFlag){this._clickFlag=!1;var e=t.getLocation();this._endPos=cc.v2(e.x,e.y),this.everyTimeMoveCallback(),this.checkSlideDirection(this._endPos),this._step++,this.setLabInfo()}else cc.log("你点的太快了")},t.prototype.touchStart=function(t){var e=t.getLocation();this._startPos=cc.v2(e.x,e.y)},t.prototype.touchCancel=function(t){if(this._clickFlag){this._clickFlag=!1;var e=t.getLocation();this._cancelPos=cc.v2(e.x,e.y),this.everyTimeMoveCallback(),this.checkSlideDirection(this._cancelPos),this._step++,this.setLabInfo()}else cc.log("你点的太快了")},t.prototype.checkSlideDirection=function(t){var e=cc.pSub(this._startPos,t),i=cc.pToAngle(e),o=cc.radiansToDegrees(i);this._slide=45<=o&&o<=135||o<=-45&&-135<=o?a.UpDown:a.LeftRight,this._slide==a.LeftRight?(this._startPos.x>t.x&&(this._direction=h.left),this._startPos.x<t.x&&(this._direction=h.right)):(this._startPos.y>t.y&&(this._direction=h.down),this._startPos.y<t.y&&(this._direction=h.up)),this.slideSquare()},t.prototype.slideSquare=function(){var t=this;if(this.checkGameOver())return cc.log("游戏结束"),void this.gameOver();this.moveSqrt(),this.everyTimeEndCallback(),this._isMerge?(this._audioID++,this.playAudioEffect(),this.everyTimeMergeCallBack()):this._audioID=-1,this._isMerge=!1,this.scheduleOnce(function(){t.randomSqrtInNULL()},.2)},t.prototype.gameOver=function(){},t.prototype.checkGameOver=function(){for(var t=this.content.childrenCount,e=!0,i=0;i<t;i++){this.content.children[i].getComponent(l.default).isNum()||(e=!1)}e&&(this.checkGameOverAllMerge()&&(e=!1));return e},t.prototype.moveSqrt=function(){for(var t=0;t<this.squareNum;t++)this.calcSlidePosition(t)},t.prototype.calcSlidePosition=function(t){var e,i=new Array;if(e=this._slide==a.LeftRight?this._sqrt[t]:this._sqrt2[t],this._direction==h.left||this._direction==h.up)for(var o=0;o<e.length;o++){e[o].getComponent(l.default).isNum()&&i.push(o)}else for(o=e.length-1;0<=o;o--){e[o].getComponent(l.default).isNum()&&i.push(o)}var r=0;if(this._direction==h.left||this._direction==h.up)for(o=0;o<i.length;o++){var n=null,s=null;n=e[i[o]],s=e[o];var c=n.getComponent(l.default).getNum();if(s.name=c+"",n.getComponent(l.default).setHideNum(c),0<o)if(e[i[o-1]])e[i[o-1]].getComponent(l.default).getHideNum()==(u=n.getComponent(l.default).getHideNum())&&0!=u?(s=e[o-1-r],n.getComponent(l.default).setHideNum(0),s.name=2*c+"",r++,this._isMerge=!0):(s=e[o-r]).name=c+"";this.positionMoveAction(n,s,c)}else for(o=0;o<i.length;o++){n=null,s=null;n=e[i[o]],s=e[e.length-o-1];var u;c=n.getComponent(l.default).getNum();if(s.name=c+"",n.getComponent(l.default).setHideNum(c),0<o)if(e[i[o-1]])e[i[o-1]].getComponent(l.default).getHideNum()==(u=n.getComponent(l.default).getHideNum())&&0!=u?(s=e[e.length-o+r],n.getComponent(l.default).setHideNum(0),s.name=2*c+"",r++,this._isMerge=!0):(s=e[e.length-o+r-1]).name=c+"";this.positionMoveAction(n,s,c)}},t.prototype.checkAllMerge=function(){for(var t=!1,e=0;e<this.squareNum;e++)for(var i=0;i<this.squareNum;i++){if(this._direction==h.left){if(i<this.squareNum-1)this.checkTwoMerge(this._sqrt[e][i],this._sqrt[e][i+1])&&(t=!0)}else if(this._direction==h.right){if(i<this.squareNum-1)this.checkTwoMerge(this._sqrt[e][this.squareNum-i-1],this._sqrt[e][this.squareNum-i-2])&&(t=!0)}else if(this._direction==h.up){if(i<this.squareNum-1)this.checkTwoMerge(this._sqrt2[e][i],this._sqrt2[e][i+1])&&(t=!0)}else if(this._direction==h.down){if(i<this.squareNum-1)this.checkTwoMerge(this._sqrt2[e][this.squareNum-i-1],this._sqrt2[e][this.squareNum-i-2])&&(t=!0)}}return t},t.prototype.checkGameOverAllMerge=function(){for(var t=0;t<this.squareNum;t++)for(var e=0;e<this.squareNum;e++){if(e<this.squareNum-1)if(this.checkTwoCanBeMerge(this._sqrt[t][e],this._sqrt[t][e+1]))return!0;if(e<this.squareNum-1)if(this.checkTwoCanBeMerge(this._sqrt[t][this.squareNum-e-1],this._sqrt[t][this.squareNum-e-2]))return!0;if(e<this.squareNum-1)if(this.checkTwoCanBeMerge(this._sqrt2[t][e],this._sqrt2[t][e+1]))return!0;if(e<this.squareNum-1)if(this.checkTwoCanBeMerge(this._sqrt2[t][this.squareNum-e-1],this._sqrt2[t][this.squareNum-e-2]))return!0}return!1},t.prototype.randomSqrtInNULL=function(){for(var t=this.content.childrenCount,e=new Array,i=0;i<t;i++){var o=this.content.children[i];o.getComponent(l.default).isNum()||e.push(o)}var r=Math.floor(Math.random()*e.length),n=this.randomNumber();0!=e.length&&e[r].getComponent(l.default).showNumber(n,!0),this._clickFlag=!0},t.prototype.randomNumber=function(){return Math.random()<.8?2:4},t.prototype.randomLocation=function(){return{l:Math.floor(Math.random()*this.squareNum),r:Math.floor(Math.random()*this.squareNum)}},t.prototype.checkTwoCanBeMerge=function(t,e){var i=t.getComponent(l.default),o=e.getComponent(l.default),r=i.isNum(),n=o.isNum();return r&&n?i.getNum()==o.getNum():!(r||!n)},t.prototype.checkTwoMerge=function(t,e){var i=t.getComponent(l.default),o=e.getComponent(l.default),r=i.isNum(),n=o.isNum();if(!r||!n){if(!r&&n){var s=o.getNum();return i.showNumber(s),o.showNumber(0),!0}return!1}var c=i.getNum(),u=o.getNum();return c==u&&(i.showNumber(2*c),o.showNumber(0),e.name=2*u+"",this._score+=c,cc.log("合并两个---\x3e>>"),i.playParticle(),!0)},t.prototype.positionMoveAction=function(t,e,i){var o=this;t.getComponent(l.default).showNumber(0);var r=cc.instantiate(this.squareItem);r.getComponent(l.default).showNumber(i),r.position=t.position,this.content.addChild(r),this._slide==a.LeftRight?Math.floor(Math.abs(t.x-e.x)/r.height):Math.floor(Math.abs(t.y-e.y)/r.height);var n=cc.moveTo(.2,e.position);r.runAction(cc.sequence(n,cc.callFunc(function(){e.isMerge?(e.getComponent(l.default).showNumber(Number(e.name),!0),e.isMerge=!1):e.getComponent(l.default).showNumber(Number(e.name)),o.content.removeChild(r),r.removeFromParent(),r.destroy()})))},t.prototype.reSetGame=function(){this.content.removeAllChildren(),this._sqrt=null,this._sqrt2=null,this._score=0,this._step=0,this._clickFlag=!0,this.initGame()},t.prototype.returnToHall=function(){cc.director.loadScene("main")},t._instance=null,__decorate([u(cc.SpriteAtlas)],t.prototype,"numberAtlas",void 0),__decorate([u(cc.Prefab)],t.prototype,"squareItem",void 0),__decorate([u(cc.Node)],t.prototype,"content",void 0),__decorate([u(cc.Label)],t.prototype,"scoreLab",void 0),__decorate([u(cc.Label)],t.prototype,"stepLab",void 0),__decorate([u(cc.Node)],t.prototype,"effectNode",void 0),t=i=__decorate([c],t);var i}(cc.Component);i.default=d,cc._RF.pop()},{"./AudioMgr":"AudioMgr","./Item":"Item"}],Hall:[function(t,e,i){"use strict";cc._RF.push(e,"e1b90/rohdEk4SdmmEZANaD","Hall"),Object.defineProperty(i,"__esModule",{value:!0});var o=t("./AudioMgr"),r=cc._decorator,n=r.ccclass,s=r.property,c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.hallNode=null,t.loadingNode=null,t}return __extends(t,e),t.prototype.onLoad=function(){var t=new o.default;t.init(),t.playBGM("BGM.mp3")},t.prototype.onClickStart=function(){var t=this;this.hallNode.active=!1,this.loadingNode.active=!0,cc.director.preloadScene("main",function(){t.scheduleOnce(function(){cc.director.loadScene("main")},2.5)})},__decorate([s(cc.Node)],t.prototype,"hallNode",void 0),__decorate([s(cc.Node)],t.prototype,"loadingNode",void 0),t=__decorate([n],t)}(cc.Component);i.default=c,cc._RF.pop()},{"./AudioMgr":"AudioMgr"}],Item:[function(t,e,i){"use strict";cc._RF.push(e,"cc31aqQf7VFCKZEvefOS9Xs","Item"),Object.defineProperty(i,"__esModule",{value:!0});var r=t("./Game"),o=cc._decorator,n=o.ccclass,s=o.property,c=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.numberSp=null,t.bg=null,t.particleNode=null,t._num=0,t.hideNum=0,t}return __extends(t,e),t.prototype.showNumber=function(t,e){if(void 0===e&&(e=!1),0==(this._num=t))return this.bg.active=!0,void(this.numberSp.spriteFrame=null);var i=r.default.instance.numberAtlas;if(this.numberSp.spriteFrame=i.getSpriteFrame(t+""),e){this.numberSp.node.scale=.5;var o=cc.scaleTo(.1,1);this.numberSp.node.runAction(o)}},t.prototype.playParticle=function(){var t=this;cc.log("播放特效"),this.particleNode.node.active=!0,this.particleNode.resetSystem(),this.particleNode.enabled=!0,this.scheduleOnce(function(){t.particleNode.stopSystem(),t.particleNode.enabled=!1},.5)},t.prototype.isNum=function(){return 0!=this._num},t.prototype.getNum=function(){return this._num},t.prototype.setHideNum=function(t){this.hideNum=t},t.prototype.getHideNum=function(){return this.hideNum},__decorate([s(cc.Sprite)],t.prototype,"numberSp",void 0),__decorate([s(cc.Node)],t.prototype,"bg",void 0),__decorate([s(cc.ParticleSystem)],t.prototype,"particleNode",void 0),t=__decorate([n],t)}(cc.Component);i.default=c,cc._RF.pop()},{"./Game":"Game"}]},{},["AudioMgr","Game","Hall","Item"]);