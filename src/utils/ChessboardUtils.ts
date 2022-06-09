/**
 * @file 棋盘操作方法文件
 * @description 包含了反转棋盘和重置棋盘方法
 * @author 夜明筱笙
 */
import Variables from "../script/Env"

/**
 * 棋盘操作方法命名空间
 * - 反转棋盘
 * - 重置棋盘
 */
namespace ChessboardUtils {
    /** 反转棋盘 */
    export const reverseChessboard = (): void => {
        const chessboard = document.getElementsByClassName('chessboard')[0]
        chessboard.classList.toggle('reverse-red', Variables.Color)
        chessboard.classList.toggle('reverse-black', !Variables.Color)
    }
    /** 重置棋盘 */
    export const resetChessBoard = (): void => {
        /** chess 用于获取所有棋子 */
        const chess = document.getElementsByClassName('chess')
        const lattice = document.getElementsByClassName('lattice')
        for (let i = chess.length - 1; i >= 0; i--) chess[i].remove()
        for (let i = lattice.length - 1; i >= 0; i--) lattice[i].remove()
    }

}
export default ChessboardUtils
