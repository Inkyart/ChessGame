/**
 * @file 象棋的接口文件
 * @author 夜明筱笙
*/

import Chess from "./chess"

/** 全局变量 */
export interface Env {
    /** 当前单击棋子 */
    Chess: HTMLDivElement | null
    /** 当前单击棋子颜色 */
    ChessColor: boolean | null
    /** 悔棋列表 */
    ChessList: Array<Chess>
    /** 当前移动棋子次数 */
    MoveCount: number
    /** 当前是否有棋子激活 */
    active: boolean
    /** 
     * 当前是哪一方棋子 
     * - true red
     * - false black
     */
    color: boolean | null

}

/**
 * 用于规范棋子信息
*/
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
    /** 棋子是否过河 */
    chess_crossTheRiver: boolean
}

/**
 * 棋子初始信息
 */
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

/**
 * 格子信息
 */
export interface LatticeInfo {
    /** 是否存在棋子 */
    existenceChess: boolean
    /**  棋子颜色 */
    color: boolean | null
    /** 是否同色 */
    homochromatic: boolean
}

/** 
 * 字符串索引
 */
export interface StringIndex {
    [index: string]: boolean
}

/** 第一个棋子是否存在 */
export interface FirstChess extends StringIndex {
    up: boolean
    down: boolean
    right: boolean
    left: boolean
}

/** 点位数据 */
export interface PointData {
    point: number[][]
    edge?: number[][]
}

/** 棋子规则 */
export type chessRule = () => number[]

/** 返回棋子规则 */
export type returnChessRule = () => chessRule
