/**
 * @file 象棋的规则文件
 * @author 夜明筱笙
 * @description 棋子的规则类文件，负责判断棋子所需要的规则和返回规则
 */
// 导入棋子
import Chess from "./chess";
// 导入接口
import { LatticeInfo, existenceChess } from './interFace';
// 导入点位数据
import PointData from './data'

/** 规则类 */
export default class Rule {
    /** 需要判定的 棋子 本身 */
    private _chess: Chess;

    /** 需要判定的 棋子 文本 */
    private _text: string;

    /** 需要判定的 棋子 颜色 */
    private _color: boolean;

    /** 需要判定的 棋子 是否过河 */
    private _crossTheRiver: boolean;

    /** 当前棋子可以到达的坐标 */
    private _goalList: [number, number][];

    /** 当前棋子规则处理方法 */
    private _method: Function;

    /** x坐标 */
    private _x: number

    /** y坐标 */
    private _y: number

    /** 是否存在第一个棋子 炮 车用 */
    private _existenceChess: existenceChess = {
        up: [false, false],
        down: [false, false],
        left: [false, false],
        right: [false, false]
    }

    /** 点位 */
    private _point: number[][]

    /** 边界 */
    private _edge: number[][]

    /** 需要获取点位的棋子 */
    private _needGetPoint: string[] = ["兵", "卒", "马", "馬", "相", "象", "士", "仕", "将", "帅"]

    /**
     * @param chess 需要判定的棋子本身
     */
    constructor(chess: Chess) {
        // 获取棋子信息
        this._chess = chess;

        const chessInfo = this._chess.getInfo();
        this._color = chessInfo.chess_color
        this._text = chessInfo.chess_text;
        [this._x, this._y] = chessInfo.chess_coordinate
        this.rule();
    }

    public method(): [number, number][] {
        // 重置坐标组
        this._goalList = [];
        // 更新棋子数据
        this.updateInfo();
        this._method();
        return this._goalList;
    }

    /** 判定棋子规则 */
    private rule(): void {
        if (["兵", "卒", "将", "帅", "士", "仕"].includes(this._text)) this._method = this.currency
        else if (["马", "馬", "相", "象"].includes(this._text)) this._method = this.horseAndElephant
        else if (["车", "車", "炮"].includes(this._text)) this._method = this.gunAndCar
    }

    /** 更新棋子数据 */
    private updateInfo(): void {
        // 获取棋子信息
        const chessInfo = this._chess.getInfo();
        [this._x, this._y] = chessInfo.chess_coordinate;
        this._crossTheRiver = chessInfo.chess_crossTheRiver;

        if (this._needGetPoint.includes(this._text)) {
            // 获取点位信息
            const { point, edge } = PointData(this._x, this._y, this._text, this._crossTheRiver)
            this._point = point
            this._edge = edge
        }
    }

    /**
     * 获取格子中是否存在棋子 且 是否 与当前判定棋子同色
     * @param row 格子的行号
     * @param column 格子的列号
     */
    private getLatticeChessInfo(row: number, column: number): LatticeInfo {

        /** 返回信息 */
        const result: LatticeInfo = {
            existenceChess: false,
            color: null,
            homochromatic: false
        }
        /** 获取对应格子 */
        const lattice = document.getElementsByClassName(`lattice row-${row} column-${column}`)[0]
        if (lattice?.childElementCount === 1) {
            result.existenceChess = true

            // 获取 第二个子元素
            const chess = lattice.children[0]
            result.color = chess.classList[1] === 'red'
            result.homochromatic = result.color === this._color
        }
        return result
    }

    /**
     * 马和象共有函数
    */
    private horseAndElephant(): void {
        for (let i = 0; i < this._point.length; i++) {
            const
                /** 结构赋值 */
                [x, y, edgeX1, edgeY1] = [...this._point[i], ...this._edge[i]],
                /** 马 象 都有一个边界格子判定棋子存在 */
                { homochromatic } = this.getLatticeChessInfo(y, x)
            // 如果边界格子都存在棋子则跳过当前循环
            if (this.getLatticeChessInfo(edgeY1, edgeX1).existenceChess) continue
            if (y <= 10 && y >= 1 && x <= 9 && x >= 1 && !homochromatic) this._goalList.push([x, y])
        }
    }

    /**
     * 通用函数
     */
    private currency(): void {
        for (const [x, y] of this._point) {
            const { homochromatic } = this.getLatticeChessInfo(y, x)
            // 如果没有特别边界值限制
            if (!this._edge) {
                if (y <= 10 && y >= 1 && x <= 9 && x >= 1 && !homochromatic) this._goalList.push([x, y])
            }
            // 否则有
            else {
                if (this._edge[0].includes(x) && this._edge[1].includes(y) && !homochromatic) this._goalList.push([x, y])
            }
        }
    }

    /**
     * 炮和车共有函数
     */
    private gunAndCar(): void {
        this._existenceChess.up = [false, false]
        this._existenceChess.down = [false, false]
        this._existenceChess.left = [false, false]
        this._existenceChess.right = [false, false]
        for (let i = 1; i < 10; i++) {
            // 四条直线
            if (this._y - i >= 1 ) this.gunAndCarUtil(this._x, this._y - i, "up")
            if (this._y + i <= 10) this.gunAndCarUtil(this._x, this._y + i, "down")
            if (this._x - i >= 1 ) this.gunAndCarUtil(this._x - i, this._y, "left")
            if (this._x + i <= 9 ) this.gunAndCarUtil(this._x + i, this._y, "right")
        }
    }

    /**
    * 棋子 车，炮的工具方法
    * @param x 格子x轴
    * @param y 格子y轴
    * @param fields 棋子存在方向字段
    */
    private gunAndCarUtil(x: number, y: number, fields: string): void {
        // 判断类型 如果不是 车 就是炮
        const type = ['车', '車'].includes(this._text),
            [firstChess, secondChess] = this._existenceChess[fields]
        // 如果是车 第一个棋子存在
        if (type && firstChess) return
        /** 获取对应格子信息 */
        const { homochromatic, existenceChess } = this.getLatticeChessInfo(y, x)
        // 不存在棋子
        if (!firstChess && !existenceChess) this._goalList.push([x, y])
        // 存在棋子
        else {
            // 类型是车 存在一个棋子 第一个棋子不存在 且 是异色棋子
            if (type && existenceChess && !firstChess && !homochromatic) {
                this._goalList.push([x, y])
            }
            // 类型是炮 存在棋子 第一个棋子存在 第二个棋子不存在 且 是异色棋子
            if (!type && existenceChess && firstChess && !secondChess && !homochromatic) {
                this._existenceChess[fields][1] = true
                this._goalList.push([x, y])
            }
            this._existenceChess[fields][0] = true
        }
    }
}
