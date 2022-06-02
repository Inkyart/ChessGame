/**
 * @file 变量文件
 */

import Chess from "./chess";
import { Variable, SetVariable } from "./interFace";
export namespace ENV {
    /** 全局变量 */
    export const Variable: Variable = {
        Chess: null,
        ChessColor: null,
        ChessList: [],
        MoveCount: 0,
        Active: false,
        Color: true,
        EatChessList: [],
        MoveList: []
    }
    /**
     * 修改变量
     * @param stringIndex 变量对象字段的字符串索引
     * @param value 需要修改的新值
     * @returns 
     */
    export const setVariable = <T>(stringIndex: string, value: T): SetVariable<T> | null => {
        // 首先获取旧值
        const oldValue = <T>getVariable(stringIndex)
        // 变更新值
        Variable[stringIndex] = value
        // 返回结果
        return {
            changeFields: stringIndex,
            oldValue: oldValue,
            newValue: value,
            success: true
        }
    }
    /**
     * 获取变量
     * @param stringIndex 变量对象字段的字符串索引
     */
    export const getVariable = <T>(stringIndex: string): T => Variable[stringIndex]

    /**
     * 修改移动次数
     * @param Fn 修改方法
     * - true + 1
     * - false - 1
     */
    export const setMoveCount = (Fn: boolean): SetVariable<number> => {
        Variable['MoveCount'] += Fn ? 1 : -1
        return {
            changeFields: 'MoveCount',
            oldValue: <number>getVariable('MoveCount') + (Fn ? 1 : -1),
            newValue: getVariable('MoveCount'),
            success: true
        }
    }

    /**
     * 将棋子添加到棋子列表中
     * @param chess 
     */
    export const addChessList = (chess: Chess): void => { Variable.ChessList.push(chess) }

    /**
     * 将棋子添加到被吃棋子列表中
     * @param chess 
     */
    export const addEatChessList = (chess: Chess): void => { Variable.EatChessList.push([chess, Variable.MoveCount]) }

    /** 撤销棋子 */
    export const revokeMove = () => {
        // 获取最后被吃掉棋子
        const lastEatChess = Variable.EatChessList[Variable.EatChessList.length - 1]
        // 如果最后吃掉的棋子时的移动计数和当前移动计数一致
        if (lastEatChess[1] === Variable.MoveCount) {
            // 将棋子删除
            const chess = Variable.EatChessList.pop()[0]
            // 解构出被吃位置
            const [x, y] = Variable.MoveList[lastEatChess[1]]
            // 移动棋子
            chess.moveChess(x, y)
        }else {
            for(const chess of Variable.ChessList) {
                const moveCount = chess.getInfo().chess_moveCount
                // 如果当前遍历的棋子的最后移动计数等于当前移动计数
                if (moveCount[moveCount.length - 1] === Variable.MoveCount) {
                    const [x, y] = ENV.Variable.MoveList.pop()
                    chess.moveChess(x, y)
                }
            }
        }
    }


}
export default ENV
