import { chessRule } from './interFace';
/**
 * @file 工具函数文件
 */

import { Variables } from "./Env"
import { SetVariables, Variable } from "./interFace"
import Chess from "./chess"


/**
 * 修改移动次数
 * @param Fn 修改方法
 * - true + 1
 * - false - 1
 */
export const setMoveCount = (Fn: boolean): SetVariables<number> => {
    Variables['MoveCount'] += Fn ? 1 : -1
    return {
        changeFields: 'MoveCount',
        oldValue: Variables.MoveCount + (Fn ? 1 : -1),
        newValue: Variables.MoveCount,
        success: true
    }
}

/**
 * 棋子列表 和 被吃棋子列表 操作方法
 * @param fn 操作方法
 * - true 添加
 * - false 删除
 * @param list 需要进行操作的列表字段
 * @param chess 需要添加的棋子
 */
export const operateList = (fn: boolean, list: string, chess?: Chess): Chess => {
    if (fn) Variables[list].push(chess)
    else return Variables[list].pop()
    return chess
}

/** 删除所有棋子 */
export const removeChess = (): void => {
    /** chess 用于获取所有棋子 */
    const chess: HTMLCollectionOf<Element> = document.getElementsByClassName('.chess')
    /** 
     * 遍历获取的棋子数组
     * 然后调用父节点的删除子元素方法
     * 删除对应的棋子元素
     */
    for (let item = 0; item < chess.length; item++) chess[item].parentNode.removeChild(chess[item])
}

/** 撤销棋子 */
export const revokeMove = () => {
    // 获取最后被吃掉棋子
    const [chess, eatCount] = Variables.EatChessList[Variables.EatChessList.length - 1]
    // 如果最后吃掉的棋子时的移动计数和当前移动计数一致
    if (eatCount === Variables.MoveCount) eat(chess)
    // 否则遍历棋子列表
    else {
        for (const chess of Variables.ChessList) {
            // 获取当前遍历棋子的最后移动计数
            const moveCount = chess.getInfo().chess_moveCount
            // 如果当前遍历的棋子的最后移动计数等于当前移动计数
            if (moveCount[moveCount.length - 1] === Variables.MoveCount) {
                // 则将当前棋子移动到上个位置
                const [x, y] = Variables.MoveList.pop()

                moveChess(x, y, false)

                setMoveCount(false)
                break
            }
        }
    }
}

/** 重置全局变量 返回旧变量值 */
export const resetEnv = (): Variable => {
    /** 旧变量值 */
    const oldValue = {
        OnclickChess: Variables.Chess,
        OldOnclickChess: Variables.OldOnclickChess,
        ChessColor: Variables.ChessColor,
        ChessList: Variables.ChessList,
        MoveCount: Variables.MoveCount,
        Active: Variables.Active,
        Color: Variables.Color,
        EatChessList: Variables.EatChessList,
        MoveList: Variables.MoveList,
        Reset: Variables.Reset,
        revokeMove: Variables.revokeMove
    }
    Variables.OnclickChess = null
    Variables.OldOnclickChess = null
    Variables.ChessColor = null
    Variables.ChessList = []
    Variables.MoveCount = 0
    Variables.Active = false
    Variables.Color = true
    Variables.EatChessList = []
    Variables.MoveList = []
    return oldValue
}



/** 删除所有棋子的active类名*/
export const removeChessActive = (): void => {
    /** 只有一个激活棋子 */
    const chess = document.getElementsByClassName('chess active')[0]
    if (chess) chess.classList.remove('active')
}

/** 
 * 激活格子 
 * @param _goalList 可到达的格子坐标列表
 */
export const activeLattice = (_goalList: [number, number][]): void => {
    // 首先取消激活的所有格子
    const activeLattice = document.getElementsByClassName('lattice')
    for (let i = 0; i < activeLattice.length; i++) activeLattice[i].classList.remove('lattice-active')

    for (const [x, y] of _goalList) {
        const lattice = document.getElementsByClassName(`lattice row-${y} column-${x}`)[0]
        lattice.classList.add('lattice-active')
    }
}

/**
 * 移动棋子
 * @param _toX 要到的格子的x轴
 * @param _toY 要到的格子的y轴
 * @param fn 操作方法
 * - true 正常移动
 * - false 撤销移动
 */
export const moveChess = (_toX: number, _toY: number, fn: boolean): void => {
    /** 获取要到达的格子 */
    const toLattice = document.getElementsByClassName(`lattice row-${_toY} column-${_toX}`)[0]
    /** 获取棋子 旧点击棋子优先 */
    const chess = (Variables.OldOnclickChess || Variables.OnclickChess)
    const [y, x] = chess.getInfo().chess_coordinate
    // 首先判断是否存在棋子 且 不是当前格子
    if (toLattice.children.length && `${x},${y}` !== `${_toX},${_toY}`) {
        // 遍历棋子列表
        for (const EatChess of Variables.ChessList) {
            // 获取棋子x，y轴
            const [x, y] = EatChess.getInfo().chess_coordinate
            // 如果xy对应
            if (x === _toX && y === _toY) {
                console.log(EatChess)
                eat(EatChess)
            }
        }
    }
    // 添加到到达格子
    toLattice.append(chess.removeChess())
    // 变更当前棋子坐标
    chess.setCoordinate(_toX, _toY)
    
    // 操作当前棋子移动计数
    chess.operateMoveCount(Variables.MoveCount, fn)
    // 取消激活棋子
    Variables.Active = false
    // 重置点击棋子
    Variables.OldOnclickChess = null
    Variables.OnclickChess = null
    // 清空激活格子
    activeLattice([])

}


/**
 * 棋子被吃
 * @param Chess 被吃的棋子
 */
export const eat = (Chess: Chess): void => {
    // 首先变更状态
    const eatStatus = Chess.toggleEatStatus()
    // 如果被吃则添加当前棋子到被吃棋子中
    if (eatStatus) {
        // 将当前棋子从棋子列表中移出
        Variables.ChessList.splice(Variables.ChessList.indexOf(this))
        // 添加到被吃棋子列表中
        Variables.EatChessList.push([Chess, Variables.MoveCount])
        Chess.removeChess()
    }
    // 否则没有取消被吃状态
    else {
        // 将当前棋子从被吃列表中移出
        const info = Variables.EatChessList.splice(Variables.EatChessList.indexOf([this, Variables.MoveCount]))[0]
        // 从移动列表中取出当前棋子被吃位置
        const [x, y] = Variables.MoveList[info[1]]
        // 重新将当前棋子添加到棋子列表
        Variables.ChessList.push(Chess)
        // 将当前棋子恢复到被吃位置
        moveChess(x, y, false)
    }
}

/**
 * 切换当前点击棋子 返回旧单击棋子
 * @param Chess 当前点击的棋子
 * @param GoalList 当前点击棋子的可到达格子坐标列表
 */
export const toggleOnclickChess = (Chess: Chess, GoalList: [number, number][]): Chess | null => {
    const oldOnclickChess = Variables.OldOnclickChess
    // 如果存在一个被点击的棋子
    if (Variables.OnclickChess) {
        const { chess_color } = Variables.OnclickChess.getInfo()
        // 如果两次点击棋子不同色
        if (chess_color !== Chess.getInfo().chess_color) Variables.OldOnclickChess = Variables.OnclickChess
    }
    Variables.OnclickChess = Chess
    // 有棋子激活
    Variables.Active = true
    // 激活格子
    activeLattice(GoalList)
    return oldOnclickChess
}

/**
 * 点击格子工具函数
 * @param lattice 
 */
export const onclickLattice = (lattice: HTMLDivElement): void => {
    /** 获取当前格子 x y 轴 */
    const [, y, x] = lattice.className.match(/row-(.{1,2}) column-(.{1})/)
    // 当前有棋子被激活 且 当前格子被激活 移动棋子
    if (Variables.Active && lattice.classList.contains('lattice-active')) moveChess(parseInt(x), parseInt(y), true)
}