/**
 * @file 象棋的棋子类文件
 * @author 夜明筱笙
*/



/** 导入接口 */
import Env from "./Env"
import { ChessInfo } from "./interFace"
import Rule from "./rule"


/** 象棋的棋子类 */
export default class Chess {

    /** 
     * 棋子坐标 
     * - 0 为 x 坐标
     * - 1 为 y 坐标
     */
    private _coordinate: number[]

    /** 棋子文本 */
    private _text: string

    /** 是否激活 */
    private _active: boolean = false

    /** 坐标列表,用于撤销 */
    private _coordinateList: number[][] = []

    /** 棋子颜色*/
    private _color: boolean

    /** 是否被吃 */
    private _eat: boolean = false

    /** 当前棋子 */
    private _chess: HTMLElement = document.createElement('div')

    /** 当前棋子是否过河 */
    private _crossTheRiver: boolean

    /** 当前棋子可以到达的坐标 */
    private _goalList: number[][]

    /** 删除点位 */
    private _removePoint: Function

    /**
     * @param coordinate 棋子初始坐标
     * @param text 棋子文本
     */
    constructor(coordinate: number[], text: string, color: boolean) {
        this._color = color
        this._coordinate = coordinate
        this._coordinateList.push(this._coordinate)
        this._text = text
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
            chess_crossTheRiver: this._crossTheRiver
        }
    }



    /** 用于添加事件 */
    public addEvent(rule: Rule): void {
        // 绑定单击事件
        this._chess.onclick = () => {
            // 如果当前没有棋子激活 或 现在是当前棋子颜色方行动
            if (!Env.active || Env.ChessColor === Env.color) {
                // 删除所有棋子的 active
                const chess = document.getElementsByClassName('chess active')[0]
                if (chess) chess.className = `${chess.classList[0]} ${chess.classList[1]}`
                this.resPoint()
                this._chess.className += ' active'
                // 获取可到达坐标
                this._goalList = rule.method()
                // 遍历坐标显示点位
            }
        }
        // const cEvent = new CustomEvent('a', {
        //     detail: {

        //     }
        // })
        // this._chess.addEventListener('a', e => {

        // })
        // this._chess.dispatchEvent(cEvent)
    }

    /** 重置所有点位 */
    private resPoint(): void {
        // 首先删除所有点位
        this.removePoint()
        for (const i of this._goalList) {
            const lattice = document.getElementsByClassName(`lattice row-${i[1]} column-${i[0]}`)[0]
            lattice.children[0].className = 'point show'
        }
    }

    /** 删除所有点位 */
    private removePoint(): void {
        const pointList = document.getElementsByClassName('point show')
        for (let i = 0; i < pointList.length; i++) pointList[i].className = 'point hidden'
    }
}
