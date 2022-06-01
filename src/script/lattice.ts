/**
 * @file 象棋的格子文件
 * @author 夜明筱笙
 * @description 象棋的隐藏格子，非显示的 canvas 格子
*/

/** 导入棋子模块 */
import Chess from "./chess"
import Env from "./Env"
/** 导入棋子初始化信息 */
import { InitInfo } from "./interFace"
import Rule from "./rule"


/**
 * 格子类
 */
export default class Lattice {

    private _infoList: Array<InitInfo>

    /** 信息索引 */
    private _index: number = 0

    /** 格子的序号 */
    private _order: number = 0

    /** 格子的行号 */
    private _row: number = 1

    /** 格子的列号 */
    private _column: number = 1

    private _chessList: Array<Chess> = []

    constructor(infoList: Array<InitInfo>) {
        this._infoList = infoList
        this.draw()
    }


    /** 用于生成 90 个格子 */
    draw(): void {
        for (; this._order < 90; this._order++) {
            /**
             * 如果 列数 大于 9
             * 因为 一行只需要九个 格子
             * 所以 column 重置为 1
             * row 自加 因为到了新行
             */
            if (this._column > 9) {
                this._column = 1
                this._row++
            }
            /** 
             * 创建格子的同时 添加 棋子 
             * 跳过当前循环
             * 如果不跳过 那么会执行 if 下的 语句
             * 会 绘制 多余的 格子
             */
            if (this._order === this._infoList[this._index].goal) this.addChess()
            else this.addLattice()
        }
    }



    /** 删除所有棋子 */
    removeChess(): void {
        /** chess 用于获取所有棋子 */
        const chess: HTMLCollectionOf<Element> = document.getElementsByClassName('.chess')
        /** 
         * 遍历获取的棋子数组
         * 然后调用父节点的删除子元素方法
         * 删除对应的棋子元素
         */
        for (let item = 0; item < chess.length; item++) chess[item].parentNode.removeChild(chess[item])
    }



    /** 添加 棋子 */
    addChess(): void {
        /** 创建棋子 */
        const chess = new Chess(
            [this._column, this._row],
            this._infoList[this._index].text,
            this._infoList[this._index].color
        )
        const rule = new Rule(chess)
        chess.addEvent(rule)
        this.addLattice(chess.create())
        this._chessList.push(chess) // 将 棋子 添加到 棋子列表中
        this._index++
    }



    /** 添加 格子 */
    addLattice(chess: HTMLElement = undefined): void {

        // 获取 棋盘 内容
        const content: Element = document.getElementsByClassName('content')[0]
        // 创建 棋盘 格子
        const lattice: HTMLDivElement = document.createElement('div')
        // 创建 点位
        const point: HTMLDivElement = document.createElement('div')
        // 为 格子 设置 类名
        lattice.setAttribute('class', `lattice row-${this._row} column-${this._column} serial-${this._order}`)
        // 为格子添加单击事件
        this.addEvent(lattice)
        // 为 点位 设置 类名
        point.setAttribute('class', 'point hidden')
        // 将 点位 添加 到 格子 中
        lattice.appendChild(point)
        // 如果 参数 chess 不为 undefined 即 有参数 
        if (chess !== undefined) lattice.appendChild(chess)  // 将 棋子 添加到 格子中
        // 将 格子 添加 到 棋盘中
        content.appendChild(lattice)
        // 增加 当前 列号
        this._column++
    }

    /** 获取棋子列表 */
    getChessList(): Array<Chess> {
        return this._chessList
    }

    addEvent(lattice: HTMLDivElement): void {
        lattice.onclick = e => {
            // 首先获取当前格子中是否有显示的点位
            const showPoint = lattice.children[0].classList.length <= 1
            // 如果有显示点位
            if (showPoint) {
                // 如果有棋子存在
                if (lattice.children[1]) {
                    // 删除当前激活棋子
                    // 将棋子添加到当前格子下
                    lattice.appendChild(Env.Chess)
                    Env.Chess.remove()
                }
            }
        }
    }
}
