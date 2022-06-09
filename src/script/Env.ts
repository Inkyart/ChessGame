/**
 * @file 全局变量文件
 * @author 夜明筱笙
 * @description 存放全局变量
 */

import { Variable } from "./interFace";

/** 全局变量 */
const Variables: Variable = {
    RedOnclickChess: null,
    BlackOnclickChess: null,
    LastOnclickChess: null,
    ChessColor: null,
    ChessList: [],
    MoveCount: 0,
    Active: false,
    Color: true,
    EatChessList: [],
    MoveList: [],
}
export default Variables
