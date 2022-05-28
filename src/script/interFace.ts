/**
 * @file 象棋的接口文件
 * @author 夜明筱笙
*/

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
    color: string
    /** 是否同色 */
    homochromatic: boolean

}

/** 棋子规则 */
export type chessRule = () => number[]

/** 返回棋子规则 */
export type returnChessRule = () => chessRule
