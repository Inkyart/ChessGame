
/**
 * @file 象棋的棋子类文件
 * @author 夜明筱笙
*/

/** 导入接口 */
import { ChessInfo } from "./interFace"
import Rule from "./rule"
import { toggleOnclickChess } from './utils';

/** 象棋的棋子类 */
export default class Chess {

    /** 
     * 棋子坐标 
     * - 0 为 x 坐标
     * - 1 为 y 坐标
     */
    private _coordinate: [number, number]

    /** 棋子文本 */
    private _text: string

    /** 是否激活 */
    private _active: boolean = false

    /** 移动计数 */
    private _moveCount: number[] = []

    /** 坐标列表,用于撤销 */
    private _coordinateList: [number, number][] = []

    /** 棋子颜色*/
    private _color: boolean

    /** 是否被吃 */
    private _eat: boolean = false

    /** 当前棋子 */
    private _chess: HTMLElement = document.createElement('div')

    /** 当前棋子是否过河 */
    private _crossTheRiver: boolean

    /** 当前棋子可以到达的坐标 */
    private _goalList: [number, number][] = []

    /**
     * @param coordinate 棋子初始坐标
     * @param text 棋子文本
     * @param color 棋子颜色 
     * - true red
     * - false black
     */
    constructor(coordinate: [number, number], text: string, color: boolean) {
        this._color = color
        this.setCoordinate(coordinate[0], coordinate[1], true)
        this._text = text
    }

    public getGoalList(): [number, number][] {
        return this._goalList
    }

    /** 
     * 用于创建 棋子 
     */
    public create(): HTMLElement {

        /** 设置类名, 并添加颜色 */
        this._chess.setAttribute('class', `chess${this._color ? ' red' : ' black'}`)

        /** 棋子文本 */
        const chess_text = document.createElement('span')
        chess_text.innerText = this._text

        /** 将棋子文本添加到棋子容器中 */
        this._chess.appendChild(chess_text)
        return this._chess
    }

    /** 获取棋子信息 */
    public getInfo(): ChessInfo {
        if (this._color) this._crossTheRiver = this._coordinate[1] > 5
        else this._crossTheRiver = this._coordinate[1] < 6

        return {
            chess_active: this._active,
            chess_color: this._color,
            chess_eat: this._eat,
            chess_text: this._text,
            chess_coordinate: this._coordinate,
            chess_coordinateList: this._coordinateList,
            chess_crossTheRiver: this._crossTheRiver,
            chess_moveCount: this._moveCount
        }
    }

    public getChess(): HTMLElement {
        return this._chess
    }

    /** 用于添加事件 */
    public addEvent(rule: Rule): void {
        // 绑定单击事件
        this._chess.onclick = () => {
            this._goalList = rule.method()
            toggleOnclickChess(this, this._goalList)
        }
    }

    /** 切换棋子激活状态 */
    public toggleActive(): void {
        if (this._active) this._chess.classList.add('active')
        else this._chess.classList.remove('active')
    }

    /** 删除并返回当前棋子 */
    public removeChess(): HTMLElement {
        this._chess.remove()
        return this._chess
    }

    /**
     * 修改坐标轴
     * @param x x轴
     * @param y y轴
     * @param fn 设置方法
     * - true 添加
     * - false 删除
     */
    public setCoordinate(x: number, y: number, fn: boolean): void {
        this._coordinate = [x, y]
        if (fn) this._coordinateList.push(this._coordinate)
        else this._coordinateList.pop()
    }

    /**
     * 操作移动计数 返回操作的移动计数
     * @param num 移动计数
     * @param fn 操作方式
     * - true push
     * - false pop
     */
    public operateMoveCount(num: number, fn: boolean): number {
        if (fn) this._moveCount.push(num)
        else return this._moveCount.pop()
        return num
    }

    /**
     * 切换当前棋子的是否被吃状态 返回当前棋子是否被吃
     */
    public toggleEatStatus(): boolean {
        this._eat = !this._eat
        return this._eat
    }
}
