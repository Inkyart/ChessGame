/**
 * @file 变量工具函数文件
 * @description 包含了重置变量，修改移动计数，操作棋子移动坐标列表，操作被吃棋子坐标列表
 * @author 夜明筱笙
 */

import Variables from "../script/Env"
import { SetVariables, Variable } from "../script/interFace"
import Chess from "../script/chess"

/** 
 * 变量操作命名空间
 * - 重置变量
 * - 修改移动计数
 * - 操作棋子移动坐标列表
 * - 操作移动坐标列表
 * - 设置移动方
 */
namespace VariableUtils {
    /** 重置全局变量 返回旧变量值 */
    export const resetEnv = (): Variable => {
        /** 旧变量值 */
        const oldValue = {
            RedOnclickChess: Variables.RedOnclickChess,
            BlackOnclickChess: Variables.BlackOnclickChess,
            RedGeneral: Variables.RedGeneral,
            BlackGeneral: Variables.BlackGeneral,
            ChessColor: Variables.ChessColor,
            ChessList: Variables.ChessList,
            MoveCount: Variables.MoveCount,
            Active: Variables.Active,
            Color: Variables.Color,
            EatChessList: Variables.EatChessList,
            MoveList: Variables.MoveList,
            Reset: Variables.Reset,
            revokeMove: Variables.revokeMove,
            LastOnclickChess: Variables.LastOnclickChess
        }
        Variables.RedOnclickChess = null
        Variables.BlackOnclickChess = null
        Variables.ChessColor = null
        Variables.ChessList = []
        Variables.MoveCount = 0
        Variables.Active = false
        Variables.Color = true
        Variables.EatChessList = []
        Variables.MoveList = []
        return oldValue
    }
    
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
     * 棋子列表操作方法
     * @param fn 操作方法
     * - true 添加
     * - false 删除
     * @param data 需要添加的棋子
     */
    export const operateChessList = (fn: boolean, data?: Chess): Chess => {
        if (fn) Variables.ChessList.push(data)
        else return Variables.ChessList.pop()
        return data
    }

    /**
     * 移动坐标列表操作方法
     * @param fn 操作方法
     * - true 添加
     * - false 删除
     * @param data 操作数据
     */
    export const operateMoveList = (fn: boolean, data?: [number, number]): [number, number] => {
        if (fn) Variables.MoveList.push(data)
        else return Variables.MoveList.pop()
        return data
    }

    /**
     * 设置移动方
     * @param color 
     */
    export const setColor = (color: boolean): void => {Variables.Color = color}
}
export default VariableUtils
