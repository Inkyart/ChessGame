/**
 * @file 棋子操作方法文件
 * @description 包含切换当前点击棋子,移动棋子,撤销移动棋子,棋子被吃,取消棋子被吃
 * @author 夜明筱笙
 */

import Variables from "../script/Env"
import LatticeUtils from "./LatticeUtils"
import Chess from "../script/chess"
import VariableUtils from "./VariablesUtils"
import ChessboardUtils from "./ChessboardUtils"


/**
 * 棋子操作方法命名空间
 * - 切换当前点击棋子
 * - 移动棋子
 * - 撤销移动棋子
 * - 棋子被吃
 * - 取消棋子被吃
 */
namespace ChessUtils {
    /**
     * 切换当前点击棋子 返回旧单击棋子
     * @param Chess 当前点击的棋子
     * @param GoalList 当前点击棋子的可到达格子坐标列表
     */
    export const toggleOnclickChess = (Chess: Chess, GoalList: [number, number][]): void => {
        // 判断是哪一方
        if (Variables.Color) Variables.RedOnclickChess = Chess
        else Variables.BlackOnclickChess = Chess

        Variables.ChessColor = Chess.getInfo().chess_color
        // 有棋子激活
        Variables.Active = true
        // 如果当前点击棋子颜色和当前行动方相同 激活格子
        if (Variables.ChessColor === Variables.Color) LatticeUtils.activeLattice(GoalList)
    }
    /**
     * 移动棋子
     * @param _toX 要到的格子的x轴
     * @param _toY 要到的格子的y轴
     * @param fn 操作方法
     * - true 正常移动
     * - false 撤销移动
     */
    export const moveChess = (_toX: number, _toY: number, fn: boolean = true): void => {
        // 首先判断颜色 如果是撤销则不需要判断
        if (!(Variables.Color === Variables.ChessColor) && fn) return
        /** 获取要到达的格子 */
        const toLattice = document.getElementsByClassName(`lattice row-${_toY} column-${_toX}`)[0]
        /** 获取棋子 */
        const chess = Variables.Color ? Variables.RedOnclickChess : Variables.BlackOnclickChess
        const info = chess.getInfo()
        const [x, y] = info.chess_coordinate
        // 首先判断是否存在棋子 且 不是当前格子
        if (toLattice.children.length && `${x},${y}` !== `${_toX},${_toY}`) {
            // 遍历棋子列表
            for (const EatChess of Variables.ChessList) {
                // 获取棋子x，y轴
                const [x, y] = EatChess.getInfo().chess_coordinate
                // 如果xy对应
                if (x === _toX && y === _toY) eat(EatChess)
            }
        }
        // 添加到到达格子
        toLattice.append(chess.removeChess())
        // 变更当前棋子坐标
        chess.setCoordinate(_toX, _toY, fn)
        // 操作当前棋子移动计数
        chess.operateMoveCount(Variables.MoveCount, fn)
        // 修改计数
        VariableUtils.setMoveCount(fn)
        // 操作计数对应的坐标
        VariableUtils.operateMoveList(fn, [_toX, _toY])
        // 取消激活棋子
        Variables.Active = false
        // 变更最近点击棋子
        Variables.LastOnclickChess = chess
        // 变更颜色方
        VariableUtils.setColor(!Variables.Color)
        // 重置点击棋子
        Variables.RedOnclickChess = null
        Variables.BlackOnclickChess = null
        // 清空激活格子
        LatticeUtils.activeLattice([])
        ChessboardUtils.reverseChessboard()

    }

    /** 撤销棋子 */
    export const revokeMove = (): void => {
        // 如果存在移动次数
        if (Variables.MoveCount) {
            // 首先遍历棋子列表
            for (const chess of Variables.ChessList) {
                // 获取遍历所得棋子最后移动计数和最后坐标（非当前坐标）
                const { chess_moveCount, chess_coordinateList } = chess.getInfo()
                const lastMove = chess_moveCount[chess_moveCount.length - 1]
                // 对比全局变量移动计数（移动计数-1）
                if (lastMove === Variables.MoveCount - 1) {
                    const [x, y] = chess_coordinateList[chess_coordinateList.length - 2]
                    const [_x, _y] = chess_coordinateList[chess_coordinateList.length - 1]
                    // 将两方当前棋子都变更为当前棋子
                    Variables.BlackOnclickChess = chess
                    Variables.RedOnclickChess = chess
                    moveChess(x, y, false)
                    // 如果被吃棋子列表中存在棋子
                    if (Variables.EatChessList.length) cancelEat(_x, _y)
                    break
                }
            }
        }
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
            Variables.ChessList.splice(Variables.ChessList.indexOf(Chess), 1)
            // 添加到被吃棋子列表中
            Variables.EatChessList.push([Chess, Variables.MoveCount])
            Chess.removeChess()
        }
    }

    /**
     * 取消棋子被吃
     */
    export const cancelEat = (x: number, y: number): void => {
        // 如果不存在被吃棋子
        if (!Variables.EatChessList.length) return

        // 获取最后被吃棋子信息
        const lastEatChessInfo = Variables.EatChessList[Variables.EatChessList.length - 1]
        // 获取最后被吃棋子
        const lastEatChess = lastEatChessInfo[0]
        // 获取最后被吃棋子被吃坐标
        const [lastEatX, lastEatY] = lastEatChess.getInfo().chess_coordinate
        // 对比被吃棋子被吃坐标和棋子当前坐标
        if (lastEatX === x && lastEatY === y) {
            // 这个坐标涉及两个棋子 移动上个棋子时删除了坐标和减少了移动计数
            VariableUtils.operateMoveList(true, [x, y])
            // 计数加一
            VariableUtils.setMoveCount(true)
            VariableUtils.setColor(!Variables.Color)
            // 将最后被吃棋子从被吃列表中移出
            const info = Variables.EatChessList.pop()
            const [chess, ] = info
            // 从移动列表中取出当前棋子被吃位置
            const [_x, _y] = Variables.MoveList.pop()
            Variables.BlackOnclickChess = chess
            Variables.RedOnclickChess = chess
            // 重新将当前棋子添加到棋子列表
            Variables.ChessList.push(chess)
            chess.setCoordinate(_x, _y, true)
            chess.toggleEatStatus()
            // 将当前棋子恢复到被吃位置
            moveChess(_x, _y, false)
        }
    }
}
export default ChessUtils
