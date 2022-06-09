/**
 * @file 象棋的接口文件
 * @author 夜明筱笙
 * @description 包含了全局变量，全局变量修改返回结果，棋子实例信息，棋子初始信息，格子信息，字符串索引，第一个棋子是否存在，点位数据，棋子规则等接口
*/

import Chess from "./chess"

/** 全局变量 */
export interface Variable extends StringIndex<any> {
    /** 红方单击棋子 */
    RedOnclickChess: Chess | null
    /** 黑方单击棋子 */
    BlackOnclickChess: Chess | null
    /** 上个单击棋子 */
    LastOnclickChess: Chess | null
    /** 当前单击棋子颜色 */
    ChessColor: boolean | null
    /** 棋子列表 */
    ChessList: Array<Chess>
    /** 当前移动棋子次数 */
    MoveCount: number
    /** 当前是否有棋子激活 */
    Active: boolean
    /** 
     * 当前是哪一方棋子 
     * - true red
     * - false black
     */
    Color: boolean
    /** 被吃棋子列表 [被吃棋子，被吃时的移动次数]*/
    EatChessList: Array<[Chess, number]>
    /** 移动坐标列表 */
    MoveList: [number,number][]
}
/** 全局变量修改结果返回值 */
export interface SetVariables<T> {
    /** 变更字段 */
    changeFields: string
    /** 旧值 */
    oldValue: T | null
    /** 新值 */
    newValue: T
    /** 是否修改成功 */
    success: boolean
}

/** 用于规范棋子信息 */
export interface ChessInfo {
    /** 棋子是否激活 */
    chess_active: boolean
    /** 棋子是否被吃 */
    chess_eat: boolean
    /** 棋子文本 */
    chess_text: string
    /** 
     * 棋子颜色 
     * - red 为 true
     * - black 为 false
     */
    chess_color: boolean
    /** 棋子坐标 */
    chess_coordinate: number[]
    /** 棋子坐标组 */
    chess_coordinateList: [number, number][]
    /** 棋子是否过河 */
    chess_crossTheRiver: boolean
    /** 棋子移动计数列表 */
    chess_moveCount: number[]
}

/** 棋子初始信息 */
export interface InitInfo {
    /** 棋子初始坐标 */
    goal: number
    /** 棋子初始文本 */
    text: string
    /** 
     * 棋子颜色 
     * - red 为 true
     * - black 为 false
     */
    color: boolean
}

/** 格子信息 */
export interface LatticeInfo {
    /** 是否存在棋子 */
    existenceChess: boolean
    /**  棋子颜色 */
    color: boolean | null
    /** 是否同色 */
    homochromatic: boolean
}

/**  字符串索引 */
export interface StringIndex<T> {
    [index: string]: T
}

/** 第一个棋子是否存在 */
export interface existenceChess extends StringIndex<[boolean, boolean]> {
    up: [boolean, boolean]
    down: [boolean, boolean]
    right: [boolean, boolean]
    left: [boolean, boolean]
}

/** 点位数据 */
export interface PointData {
    point: number[][]
    edge?: number[][]
}
