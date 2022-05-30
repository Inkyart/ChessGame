import { LatticeInfo } from './interFace';
/**
 * @file 象棋的规则文件
 * @author 夜明筱笙
 */

/** 导入棋子 */
import Chess from "./chess";

/**
 * 规则类
 */
export default class Rule {
    /** 需要判定的 棋子 本身 */
    private _chess: Chess;

    /** 需要判定的 棋子 文本 */
    private _text: string;

    /** 需要判定的 棋子 颜色 */
    private _color: boolean;

    /** 需要判定的 棋子 当前坐标 */
    private _goal: number[];

    /** 需要判定的 棋子 是否过河 */
    private _crossTheRiver: boolean;

    /** 当前棋子可以到达的坐标 */
    private _goalList: number[][];

    /** 当前棋子规则处理方法 */
    public _method: Function;

    /** x坐标 */
    private _x: number

    /** y坐标 */
    private _y: number


    /**
     * @param chess 需要判定的棋子
     */
    constructor(chess: Chess) {
        // 获取棋子信息
        this._chess = chess;

        const chessInfo = this._chess.getInfo();
        this._color = chessInfo.chess_color
        this._text = chessInfo.chess_text;
        this._x = chessInfo.chess_coordinate[0]
        this._y = chessInfo.chess_coordinate[1]
        this.updateInfo();
        this.rule();
    }

    public method(): number[][] {
        // 重置坐标组
        this._goalList = [];
        // 更新棋子数据
        this.updateInfo();
        this._method();
        return this.getGoalList();
    }

    /** 判定棋子规则 */
    private rule(): void {
        if (["炮"].includes(this._text)) this._method = this.gun
        else if (["兵", "卒"].includes(this._text)) this._method = this.soldier
        else if (["马", "馬"].includes(this._text)) this._method = this.horse
        else if (["相", "象"].includes(this._text)) this._method = this.elephant
        else if (["车", "車"].includes(this._text)) this._method = this.car
        else if (["士", "仕"].includes(this._text)) this._method = this.scholar
        else if (["将", "帅"].includes(this._text)) this._method = this.general
    }

    /** 获取棋子可移动坐标组 */
    private getGoalList(): number[][] {
        return this._goalList;
    }

    /** 更新棋子数据 */
    private updateInfo(): void {
        const chessInfo = this._chess.getInfo();
        this._goal = chessInfo.chess_coordinate;
        this._crossTheRiver = chessInfo.chess_crossTheRiver;
    }

    /**
     * 获取格子中是否存在棋子 且 是否 与当前判定棋子同色
     * @param row 格子的行号
     * @param column 格子的列号
     * @param color 当前判定的棋子颜色
     */
    private getLatticeChessColor(row: number, column: number, color: boolean): LatticeInfo {

        /** 返回信息 */
        const result: LatticeInfo = {
            existenceChess: false,
            color: null,
            homochromatic: true
        }
        /** 获取对应格子 */
        const lattice = document.getElementsByClassName(`lattice row-${row} column-${column}`)[0]
        // 如果格子中存在棋子 因为有隐藏点位存在 所以 棋子是格子的第二个子元素
        if (lattice?.childElementCount > 1) {
            result.existenceChess = true

            // 获取 第二个子元素
            const chess = lattice.children[1]
            result.color = chess.classList[1] === 'red'
            result.homochromatic = result.color === color
        }
        return result
    }

    /**
     * 棋子炮的工具方法
     * @param x 格子x轴
     * @param y 格子y轴
     * @param firstChess 第一个棋子是否存在
     */
    private gunUtil(x: number, y: number, firstChess: boolean): boolean {
        /** 获取对应格子信息 */
        const LatticeInfo: LatticeInfo = this.getLatticeChessColor(y, x, this._color)
        // 不存在棋子
        if (!firstChess && !LatticeInfo.existenceChess) {
            this._goalList.push([x, y])
            return false
        }
        // 存在一个棋子 且 第一个棋子不存在
        if (LatticeInfo.existenceChess && !firstChess) {
            return true
        }
        // 存在棋子 第一个棋子存在 且 是异色棋子
        if (LatticeInfo.existenceChess && firstChess && !LatticeInfo.homochromatic) {
            this._goalList.push([x, y])
            return true
        }
        return firstChess
    }

    /** 
     * 棋子 炮 
     * 炮能够上下左右移动
     * 同时可以吃到所在上下左右任意直线上
     * 以自己为起点的第二个异色棋子
     */
    private gun(): void {
        // 是否存在第一个棋子
        const firstChess = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        for (let i = 1; i < 9; i++) {
            // 四条直线
            if (this._y - i >= 1) {
                firstChess.up = this.gunUtil(this._x, this._y - i, firstChess.up)
            }
            if (this._y + i <= 9) {
                firstChess.down = this.gunUtil(this._x, this._y + i, firstChess.down)
            }
            if (this._x - i >= 1) {
                firstChess.left = this.gunUtil(this._x - i, this._y, firstChess.left)
            }
            if (this._x + i <= 9) {
                firstChess.right = this.gunUtil(this._x + i, this._y, firstChess.right)
            }
        }
    }


    /** 
     * 棋子 兵 卒 
     * 兵卒只能往前
     * 唯一不同的是 如果过河了，那么可以左右移动
     */
    private soldier(): void {
        if (this._color) {
            if (this._y + 1 <= 9) this._goalList.push([this._x, this._y + 1])
        } else {
            if (this._y - 1 >= 1) this._goalList.push([this._x, this._y - 1])
        }
        if (this._crossTheRiver) {
            if (this._x + 1 <= 9) this._goalList.push([this._x + 1, this._y])
            if (this._x - 1 >= 1) this._goalList.push([this._x - 1, this._y])
        }
    }


    /** 
     * 馬 马 
     * 马走日
     */
    private horse(): void {
        const point = [
            [this._x + 1, this._y - 2, /** this._x, this._y - 1 */],
            [this._x - 1, this._y - 2, /** this._x, this._y - 1 */],
            [this._x + 1, this._y + 2, /** this._x, this._y + 1 */],
            [this._x - 1, this._y + 2, /** this._x, this._y + 1 */],
            [this._x - 2, this._y + 1, /** this._x - 1, this._y */],
            [this._x - 2, this._y - 1, /** this._x - 1, this._y */],
            [this._x + 2, this._y + 1, /** this._x + 1, this._y */],
            [this._x + 2, this._y - 1, /** this._x + 1, this._y */]
        ]
        console.log(point)
        for (const [x1, y1] of point) {
            if (y1 <= 10 && y1 >= 1 && x1 <= 9 && x1 >= 1) this._goalList.push([x1, y1])
        }
    }
    /** 相 象 */
    private elephant(): void { 
        if (!this._crossTheRiver) {

        }
    }
    /** 车 車 */
    private car(): void { }
    /** 士 仕 */
    private scholar(): void { }
    /** 将 帅 */
    private general(): void { }
}
