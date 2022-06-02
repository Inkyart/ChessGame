/**
 * @file 象棋的棋子类文件
 * @author 夜明筱笙
*/

/** 导入接口 */
import { ChessInfo } from "./interFace"
import Rule from "./rule"
import ENV from "./Env"

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

    /** 移动计数 */
    private _moveCount: number[] = []

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
    private _goalList: number[][] = []

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
            // 如果当前没有棋子激活 或 现在是当前棋子颜色方行动
            if (!ENV.Variable.active || ENV.Variable.ChessColor === ENV.Variable.color) {
                // 删除所有棋子的 active
                const chess = document.getElementsByClassName('chess active')[0]
                if (chess) chess.className = `${chess.classList[0]} ${chess.classList[1]}`
                this._chess.className += ' active'
                // 删除点位

                this._goalList = rule.method()

            }
        }
    }

    /**
     * 移动棋子
     * @param _toX 要到的格子的x轴
     * @param _toY 要到的格子的y轴
     */
    public moveChess(_toX: number, _toY: number): void {
        /** 获取要到达的格子 */
        const toLattice = document.getElementsByClassName(`lattice row-${_toY} column-${_toX}`)[0]
        // 首先判断是否存在棋子
        if (toLattice.children.length > 1) {
            // 遍历棋子列表
            for (const chess of ENV.Variable.ChessList) {
                // 获取棋子x，y轴
                const [x, y] = chess.getInfo().chess_coordinate
                // 如果xy对应
                if (x === _toX && y === _toY) {
                    chess.eat()
                }
            }
        }
        // 否则是 不存在棋子 和 是异色棋子
        this._chess.remove()
        // 添加到到达格子
        toLattice.append(this._chess)
        // 变更当前棋子坐标
        this._coordinate = [_toX, _toY]
    }

    /** 棋子被吃 */
    private eat(): void {
        // 首先变更状态
        this._eat = !this._eat
        // 如果被吃则添加当前棋子到被吃棋子中
        if (this._eat) {
            // 将当前棋子从棋子列表中移出
            ENV.Variable.ChessList.splice(ENV.Variable.ChessList.indexOf(this))
            // 添加到被吃棋子列表中
            ENV.Variable.EatChessList.push([this, ENV.Variable.MoveCount])
        }
        // 否则没有取消被吃状态
        else {
            // 将当前棋子从被吃列表中移出
            const info = ENV.Variable.EatChessList.splice(ENV.Variable.EatChessList.indexOf([this, ENV.Variable.MoveCount]))[0]
            // 从移动列表中取出当前棋子被吃位置
            const [x, y] = ENV.Variable.MoveList[info[1]]
            // 重新将当前棋子添加到棋子列表
            ENV.Variable.ChessList.push(this)
            // 将当前棋子恢复到被吃位置
            this.moveChess(x, y)
        }
    }
}
