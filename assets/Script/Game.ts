import Item from "./Item";
import AudioMgr from "./AudioMgr";

const { ccclass, property } = cc._decorator;
export interface locationInfo {
    l: number;   //行数
    r: number;   //列数
}

export enum slideDirection {
    LeftRight = 1,
    UpDown = 2,
}
export enum direction {
    left,
    right,
    up,
    down,
}


@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    squareItem: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Label)
    scoreLab: cc.Label = null;

    @property(cc.Label)
    stepLab: cc.Label = null;

    @property(cc.Node)
    gameOverNode: cc.Node = null;

    @property(cc.SpriteAtlas)
    gameAtlas: cc.SpriteAtlas = null;

    //上一次触摸点位置
    _pos: cc.Vec2 = null;

    _endPos: cc.Vec2 = null; //结束点
    _startPos: cc.Vec2 = null;//开始点
    _cancelPos: cc.Vec2 = null;//取消点

    //分数
    _score: number = 0;
    //步数
    _step: number = 0;

    //每一行的格子数
    squareNum: number = 4;

    //格子的二维数组  横向
    _sqrt: cc.Node[][] = null;

    //格子的二维数组  竖向
    _sqrt2: cc.Node[][] = null;

    //滑动方向 默认向左划
    _direction: direction = direction.left;
    _slide: slideDirection = slideDirection.LeftRight;

    _AudioMgr: AudioMgr = null;

    _clickFlag: boolean = true;
    /**
     * 2048 小方块
     * 每一步都出现一个方块 2 
     * 游戏开始 有两个随机数字 (2,4)或(2,2)
     * 2,4,8,16,32,64,128,256,512,1024,2048
     */
    onLoad() {
        this._AudioMgr = new AudioMgr();
        // this._AudioMgr.playBGM("bg.mp3");

        //初始化
        this.initGame();

        this.content.width = this._sqrt[0][0].width * this.squareNum + (this.squareNum + 1) * 20;
        this.content.height = this._sqrt[0][0].height * this.squareNum + (this.squareNum + 1) * 20;

        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancel, this);
        // this.node.on(cc.Node.EventType.TOUCH_MOVE, this.touchMove, this);

    }

    initGame() {

        this._sqrt = new Array();
        this._sqrt2 = new Array();

        //多维数组不能直接定义多维，只能层层定义，很多高级语言都是如此
        for (let i = 0; i < this.squareNum; i++) {
            this._sqrt2[i] = new Array();//多维数组层层定义
        }

        for (let i = 0; i < this.squareNum; i++) {
            this._sqrt[i] = new Array();//多维数组层层定义
            for (let j = 0; j < this.squareNum; j++) {
                let item = cc.instantiate(this.squareItem);
                item.name = i + "" + j;
                // item.getComponent(Item).showNumber(0);
                this._sqrt[i][j] = item;
                this._sqrt2[j][i] = item;
                this.content.addChild(item);
                //计算位置
                this.initPos(item, i, j);
            }
        }

        this.scheduleOnce(() => {
            //随机两个存在的数字
            this.initGrid();
        }, 0.2);

    }

    //初始化位置 ，不用layout组件
    initPos(item: cc.Node, i: number, j: number) {
        // let x = item.width * i + item.width / 2 + (i + 1) * 20;
        // let y = item.height * j + item.width / 2 + (j + 1) * 20;
        let x = item.width * j + item.width / 2 + (j + 1) * 20;
        let y = item.height * i + item.width / 2 + (i + 1) * 20;
        item.position = cc.v2(x, -y);
    }

    initGrid() {
        let location1 = this.randomLocation();
        let location2 = this.randomLocation();
        let grid1 = this.randomNumber();
        let grid2 = this.randomNumber();

        //获取随机到的两个数的节点
        let item1 = this.content.getChildByName(location1.l + "" + location1.r);
        let item2 = this.content.getChildByName(location2.l + "" + location2.r);
        item1.getComponent(Item).showNumber(grid1);
        item2.getComponent(Item).showNumber(grid2);
    }

    /**
     * 设置面板信息
     */
    setLabInfo() {
        this.scoreLab.string = this._score + "";
        this.stepLab.string = this._step + "";
    }

    touchEnd(event) {
        if (this._clickFlag) {
            this._clickFlag = false;
            let pos = event.getLocation()
            this._endPos = cc.v2(pos.x, pos.y);
            this.checkSlideDirection(this._endPos);
            this._step++;
            this.setLabInfo();
        } else {
            cc.log("你点的太快了");
        }

    }

    touchStart(event) {
        let pos = event.getLocation()
        this._startPos = cc.v2(pos.x, pos.y);
    }

    touchCancel(event) {
        if (this._clickFlag) {
            this._clickFlag = false;
            let pos = event.getLocation()
            this._cancelPos = cc.v2(pos.x, pos.y);
            this.checkSlideDirection(this._cancelPos);
            this._step++;
            this.setLabInfo();
        } else {
            cc.log("你点的太快了");
        }
    }

    /**
     * 检测滑动方向
     */
    checkSlideDirection(point: cc.Vec2) {
        //计算滑动的角度
        let subVect = cc.pSub(this._startPos, point);
        let radian = cc.pToAngle(subVect);//弧度
        let degrees = cc.radiansToDegrees(radian);//弧度转度数
        // degrees = 90 - degrees;
        if ((degrees >= 45 && degrees <= 135) ||
            (degrees <= -45 && degrees >= - 135)) {
            this._slide = slideDirection.UpDown;
        } else {
            this._slide = slideDirection.LeftRight;
        }

        if (this._slide == slideDirection.LeftRight) {
            if (this._startPos.x > point.x) {
                //左滑
                this._direction = direction.left;
            }

            if (this._startPos.x < point.x) {
                //右滑
                this._direction = direction.right;
            }
        } else {
            if (this._startPos.y > point.y) {
                this._direction = direction.down;
            }

            if (this._startPos.y < point.y) {
                this._direction = direction.up;
            }
        }

        this.slideSquare();
    }


    /**
     * 滑动
     * @param sd  滑动方向
     */
    slideSquare() {
        //判断游戏是否该结束
        if (this.checkGameOver()) {
            cc.log("游戏结束");
            this.gameOver();
            return;
        }

        //移动位置  所有块往一个方向移动
        this.moveSqrt();

        this.scheduleOnce(() => {
            //检测合并
            let flag = this.checkAllMerge();


            // this.randomSqrtInNULL();
            cc.log("flag--->>>", flag);
            if (flag) {
                this.slideSquare();
            } else {
                //随机生成 数字块
                this.randomSqrtInNULL();
            }
        }, 0.3);
    }

    /**
     * 游戏结束
     */
    gameOver() {
        this.gameOverNode.active = true;
        // this.

        //设置分数和步数

        //重新开始按钮

    }

    /**
     * 检查游戏是否结束
     */
    checkGameOver() {
        let len = this.content.childrenCount;
        let flag = true;
        for (let i = 0; i < len; i++) {
            let item = this.content.children[i]
            let isNum = item.getComponent(Item).isNum();
            if (!isNum) {
                flag = false;
            }
        }
        if (flag) {
            //检测是否能进行合并
            let isGameOver = this.checkGameOverAllMerge();
            //还可以继续消除合并
            if (isGameOver) {
                flag = false;
            }
        }
        return flag;
    }

    /**
   * 将所有块往一个方向移动
   */
    moveSqrt() {
        if (this._slide == slideDirection.LeftRight) { //左右
            for (let i = 0; i < this.squareNum; i++) {
                this.calcHorizontalSlidePosition(i);
                // this.calcHorizontalSlidePosition3(i);
            }
        } else {   //上下
            for (let i = 0; i < this.squareNum; i++) {
                this.calcVerticalSlidePosition(i);
            }
        }
    }

    //检测所有的合并项
    checkAllMerge() {
        let flag = false;
        //排完序后  在检测 相同数字合并
        for (let i = 0; i < this.squareNum; i++) {
            for (let j = 0; j < this.squareNum; j++) {
                if (this._direction == direction.left) {
                    if (j < this.squareNum - 1) {
                        let isModify = this.checkTwoMerge(this._sqrt[i][j], this._sqrt[i][j + 1]);
                        if (isModify) {
                            flag = true;
                        }
                    }
                } else if (this._direction == direction.right) {
                    if (j < this.squareNum - 1) {
                        let isModify = this.checkTwoMerge(this._sqrt[i][this.squareNum - j - 1], this._sqrt[i][this.squareNum - j - 2]);
                        if (isModify) {
                            flag = true;
                        }
                    }
                } else if (this._direction == direction.up) {
                    if (j < this.squareNum - 1) {
                        let isModify = this.checkTwoMerge(this._sqrt2[i][j], this._sqrt2[i][j + 1]);
                        if (isModify) {
                            flag = true;
                        }
                    }
                } else if (this._direction == direction.down) {
                    if (j < this.squareNum - 1) {
                        let isModify = this.checkTwoMerge(this._sqrt2[i][this.squareNum - j - 1], this._sqrt2[i][this.squareNum - j - 2]);
                        if (isModify) {
                            flag = true;
                        }
                    }
                }
            }
        }
        return flag;
    }

    checkGameOverAllMerge() {
        //排完序后  在检测 相同数字合并
        for (let i = 0; i < this.squareNum; i++) {
            for (let j = 0; j < this.squareNum; j++) {
                if (j < this.squareNum - 1) {
                    let isModify = this.checkTwoCanBeMerge(this._sqrt[i][j], this._sqrt[i][j + 1]);
                    if (isModify) {
                        return true;
                    }
                }
                if (j < this.squareNum - 1) {
                    let isModify = this.checkTwoCanBeMerge(this._sqrt[i][this.squareNum - j - 1], this._sqrt[i][this.squareNum - j - 2]);
                    if (isModify) {
                        return true;
                    }
                }
                if (j < this.squareNum - 1) {
                    let isModify = this.checkTwoCanBeMerge(this._sqrt2[i][j], this._sqrt2[i][j + 1]);
                    if (isModify) {
                        return true;
                    }
                }
                if (j < this.squareNum - 1) {
                    let isModify = this.checkTwoCanBeMerge(this._sqrt2[i][this.squareNum - j - 1], this._sqrt2[i][this.squareNum - j - 2]);
                    if (isModify) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    //在空白块中随机生成一个 数字块
    randomSqrtInNULL() {
        let len = this.content.childrenCount;

        let nullList = new Array();

        for (let i = 0; i < len; i++) {
            let item = this.content.children[i]
            let isNum = item.getComponent(Item).isNum();
            if (!isNum) {
                nullList.push(item);
            }
        }
        let index = Math.floor(Math.random() * nullList.length);
        let num = this.randomNumber();

        if (nullList.length == 0) {
            this._clickFlag = true;
            return;
        }

        //延迟0.2s
        this.scheduleOnce(() => {
            this._AudioMgr.playSFX("click.mp3");
            nullList[index].getComponent(Item).showNumber(num);
            this._clickFlag = true;
        }, 0.2);
    }



    /**
     * 计算水平滑动
     * 计算一行内所有数字块的位置,并进行 移动
     * @param line 行
     */
    calcHorizontalSlidePosition(line: number) {
        let lineList = this._sqrt[line];
        let flagList = new Array();

        if (this._direction == direction.left) {
            for (let i = 0; i < lineList.length; i++) {
                let isNum = lineList[i].getComponent(Item).isNum();
                if (isNum) {
                    flagList.push(i);
                }
            }
        } else {
            for (let i = lineList.length - 1; i >= 0; i--) {
                let isNum = lineList[i].getComponent(Item).isNum();
                if (isNum) {
                    flagList.push(i);
                }
            }
        }

        //从左0开始依次把数字块 按顺序排
        //根据方向排列
        for (let i = 0; i < flagList.length; i++) {
            let oldNode: cc.Node = null;
            let targetNode: cc.Node = null;

            // if (this._direction == direction.left) {
            // let num = lineList[flagList[i]].getComponent(Item).getNum();
            // lineList[i].getComponent(Item).showNumber(num);

            oldNode = lineList[flagList[i]];
            let num = oldNode.getComponent(Item).getNum();
            // cloneNode.getComponent(Item).showNumber(num);
            // cloneNode.position = oldNode.position;
            // cloneNode.name = num + "";
            oldNode.name = num + "";
            if (this._direction == direction.left) {
                targetNode = lineList[i];
            } else {
                targetNode = lineList[lineList.length - i - 1];
            }

            oldNode.getComponent(Item).showNumber(0);
            this.positionMoveAction(oldNode, targetNode);
            // } else if (this._direction == direction.right) {
            //     // let num = lineList[flagList[flagList.length - i - 1]].getComponent(Item).getNum();
            //     // lineList[lineList.length - i - 1].getComponent(Item).showNumber(num);
            //     oldNode = lineList[flagList[flagList.length - i - 1]];
            //     let num = oldNode.getComponent(Item).getNum();
            //     // cloneNode.getComponent(Item).showNumber(num);
            //     // cloneNode.position = oldNode.position;
            //     // cloneNode.name = num + "";
            //     oldNode.name = num + "";
            //     targetNode = lineList[lineList.length - i - 1];
            //     oldNode.getComponent(Item).showNumber(0);
            // }

            //A克隆一个节点A1,然后把节点A置空,然后移动到指定节点B位置
            // cloneNode = cc.instantiate(lineList[flagList[i]]);
            // this.content.addChild(cloneNode);
            // targetNode = lineList[i];
            // let runTime = Math.floor(Math.abs(oldNode.x - targetNode.x) / cloneNode.width) * 0.1;
            // let moveAct = cc.moveTo(runTime, targetNode.position);
            // cloneNode.runAction(cc.sequence(moveAct, cc.callFunc(() => {
            //     targetNode.getComponent(Item).showNumber(Number(cloneNode.name));
            //     this.content.removeChild(cloneNode);
            //     cloneNode.removeFromParent();
            //     cloneNode.destroy();
            // })));
        }

        //置空 之前的块
        // for (let i = 0; i < lineList.length; i++) {
        //     if (this._direction == direction.left) {
        //         if (i > flagList.length - 1) {
        //             lineList[i].getComponent(Item).showNumber(0);
        //         }
        //     } else if (this._direction == direction.right) {
        //         if (i < lineList.length - flagList.length) {
        //             lineList[i].getComponent(Item).showNumber(0);
        //         }
        //     }
        // }
    }

    /**
     * 竖直滑动
     * 计算一列内所有数字块的位置,并进行 移动
     */
    calcVerticalSlidePosition(row: number) {
        let rowList = this._sqrt2[row];
        let flagList = new Array();
        for (let i = 0; i < rowList.length; i++) {
            let isNum = rowList[i].getComponent(Item).isNum();
            if (isNum) {
                flagList.push(i);
            }
        }

        //从左0开始依次把数字块 按顺序排
        //根据方向排列
        for (let i = 0; i < flagList.length; i++) {
            let oldNode: cc.Node = null;
            // let cloneNode: cc.Node = cc.instantiate(this.squareItem);
            let targetNode: cc.Node = null;

            if (this._direction == direction.up) {
                // let num = rowList[flagList[i]].getComponent(Item).getNum();
                // rowList[i].getComponent(Item).showNumber(num);

                oldNode = rowList[flagList[i]];
                let num = oldNode.getComponent(Item).getNum();
                // cloneNode.getComponent(Item).showNumber(num);
                // cloneNode.position = oldNode.position;
                // cloneNode.name = num + "";
                oldNode.name = num + "";
                targetNode = rowList[i];
                oldNode.getComponent(Item).showNumber(0);
            } else if (this._direction == direction.down) {
                // let num = rowList[flagList[flagList.length - i - 1]].getComponent(Item).getNum();
                // rowList[rowList.length - i - 1].getComponent(Item).showNumber(num);

                oldNode = rowList[flagList[flagList.length - i - 1]];
                let num = oldNode.getComponent(Item).getNum();
                oldNode.name = num + "";
                // cloneNode.getComponent(Item).showNumber(num);
                // cloneNode.position = oldNode.position;
                // cloneNode.name = num + "";
                targetNode = rowList[rowList.length - i - 1];
                oldNode.getComponent(Item).showNumber(0);
            }

            //A克隆一个节点A1,然后把节点A置空,然后移动到指定节点B位置
            // cloneNode = cc.instantiate(lineList[flagList[i]]);
            // this.content.addChild(cloneNode);
            this.positionMoveAction(oldNode, targetNode);
        }

        //置空 之前的块
        // for (let i = 0; i < rowList.length; i++) {
        //     if (this._direction == direction.up) {
        //         if (i > flagList.length - 1) {
        //             rowList[i].getComponent(Item).showNumber(0);
        //         }
        //     } else if (this._direction == direction.down) {
        //         if (i < rowList.length - flagList.length) {
        //             rowList[i].getComponent(Item).showNumber(0);
        //         }
        //     }
        // }
    }

    /**
     * 随机一个数字  2/4
     */
    randomNumber(): number {
        return Math.random() < 0.8 ? 2 : 4;
    }

    /**
     * 随机获取一个位置
     */
    randomLocation(): locationInfo {
        let line = Math.floor(Math.random() * this.squareNum);
        let row = Math.floor(Math.random() * this.squareNum);
        return { l: line, r: row };
    }

    /**
     * 是否能合并  并不合并
     */
    checkTwoCanBeMerge(one: cc.Node, two: cc.Node) {
        let item1 = one.getComponent(Item);
        let item2 = two.getComponent(Item);
        let oneFlag = item1.isNum();
        let twoFlag = item2.isNum();
        if (oneFlag && twoFlag) {
            let num1 = item1.getNum();
            let num2 = item2.getNum();
            if (num1 == num2) {
                return true;
            }
        } else if (!oneFlag && twoFlag) {
            return true;
        } else {
            return false;
        }
        return false;
    }

    /**
     * 检测两个合并   能合并就合并
     */
    checkTwoMerge(one: cc.Node, two: cc.Node): boolean {
        let item1 = one.getComponent(Item);
        let item2 = two.getComponent(Item);

        let oneFlag = item1.isNum();
        let twoFlag = item2.isNum();

        if (oneFlag && twoFlag) {
            let num1 = item1.getNum();
            let num2 = item2.getNum();
            if (num1 == num2) {
                //合并两个
                item1.showNumber(num1 * 2);
                item2.showNumber(0);
                // let cloneNode: cc.Node = cc.instantiate(this.squareItem);
                // cloneNode.getComponent(Item).showNumber(num2);
                // cloneNode.position = two.position;
                // cloneNode.name = num2 + "";
                two.name = num2 * 2 + "";
                this.positionMoveAction(two, one);
                //进行飞行动作
                this._score += num1;
                cc.log("合并两个--->>>");
                item1.playParticle();
                return true;
            }
        } else if (!oneFlag && twoFlag) {
            let num = item2.getNum();
            item1.showNumber(num);
            item2.showNumber(0);
            return true;
        } else {
            // this._isContinue = false;
            return false;
        }
        return false;
    }

    /**
     * move动作
     */
    positionMoveAction(oldNode: cc.Node, targetNode: cc.Node) {

        cc.log("oldName--->>>", oldNode.name);

        let cloneNode: cc.Node = cc.instantiate(this.squareItem);
        cloneNode.getComponent(Item).showNumber(Number(oldNode.name));
        cloneNode.position = oldNode.position;
        cloneNode.name = oldNode.name;
        this.content.addChild(cloneNode);

        let runTime;
        if (this._slide == slideDirection.LeftRight) {
            runTime = Math.floor(Math.abs(oldNode.x - targetNode.x) / cloneNode.height) * 0.1;
        } else {
            runTime = Math.floor(Math.abs(oldNode.y - targetNode.y) / cloneNode.height) * 0.1;
        }
        let moveAct = cc.moveTo(runTime, targetNode.position);
        cloneNode.runAction(cc.sequence(moveAct, cc.callFunc(() => {
            targetNode.getComponent(Item).showNumber(Number(cloneNode.name));
            this.content.removeChild(cloneNode);
            cloneNode.removeFromParent();
            cloneNode.destroy();
        })));
    }

    /**
     * 重新开始游戏
     */
    reSetGame() {
        this.content.removeAllChildren();
        this._sqrt = null;
        this._sqrt2 = null;

        this._score = 0;
        this._step = 0;
        this._clickFlag = true;
        this.gameOverNode.active = false;
        this.initGame();
    }

    /**
     * 返回大厅
     */
    returnToHall() {
        cc.director.loadScene("main");
    }


    calcHorizontalSlidePosition2(line: number) {
        let lineList = this._sqrt[line];
        let flagList = new Array();
        let numList = new Array();
        //映射，代表移动的目标角标
        let targetList = new Array();
        for (let i = 0; i < lineList.length; i++) {
            let isNum = lineList[i].getComponent(Item).isNum();
            if (isNum) {
                flagList.push(i);
                numList.push(lineList[i].getComponent(Item).getNum());
            }
        }

        for (let i = 0; i < flagList.length; i++) {
            lineList[i] = numList[i];
            flagList[i]
            if (numList[i + 1] && numList[i] == numList[i + 1]) {

            }
        }
    }

    /**
     * 数组排序
     */
    sortArray(numList: Array<number>) {
        let newList = new Array();
        let index = -1;
        //先进行合并操作，合并一次，就更新一下数组，冒泡排序
        for (let i = 0; i < numList.length; i++) {
            if (numList[i + 1] && numList[i] == numList[i + 1]) {
                //合并,并放到新数组里
                newList.push(numList[i] * 2);
                index = i + 1;
                break;
            }
        }
        //合并之后更新一下数组，并且再次进行排序
        if (index > 0) {
            numList[index] = 0;
            return this.sortArray(numList);
        }
        return newList;
    }


    /**
    * 计算水平滑动
    * 计算一行内所有数字块的位置,并进行 移动
    * @param line 行
    */
    calcHorizontalSlidePosition3(line: number) {
        let lineList = this._sqrt[line];
        let flagList = new Array();
        for (let i = 0; i < lineList.length; i++) {
            let isNum = lineList[i].getComponent(Item).isNum();
            if (isNum) {
                flagList.push(i);
            }
        }


        cc.log("flagList.length-->>", flagList.length);
        //从左0开始依次把数字块 按顺序排
        //根据方向排列
        for (let i = 0; i < flagList.length; i++) {
            let oldNode: cc.Node = null;
            let targetNode: cc.Node = null;

            if (this._direction == direction.left) {

                oldNode = lineList[flagList[i]]
                oldNode.name = oldNode.getComponent(Item).getNum() + "";
                targetNode = lineList[i];

                //移动
                if (i > 0) {
                    if (lineList[flagList[i - 1]].getComponent(Item).getNum() == lineList[flagList[i]].getComponent(Item).getNum()) {
                        //可以合并; 并且目标节点是上一个节点
                        cc.log("可以合并");
                        targetNode = lineList[i - 1];
                    } else {
                        //不能合并
                    }
                } else {
                }
                cc.log(oldNode.getComponent(Item).getNum());
                cc.log(targetNode.getComponent(Item).getNum());
                // let num = lineList[flagList[i]].getComponent(Item).getNum();
                // lineList[i].getComponent(Item).showNumber(num);

            } else if (this._direction == direction.right) {
                // let num = lineList[flagList[flagList.length - i - 1]].getComponent(Item).getNum();
                // lineList[lineList.length - i - 1].getComponent(Item).showNumber(num);
            }

            this.positionMoveAction(oldNode, targetNode);
        }

    }
}
