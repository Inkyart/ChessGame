/**
 * @file 象棋的主程序
 * @author 夜明筱笙
*/


/** 导入 棋子文件 格子文件 初始化文件 */
import Lattice from "./script/lattice";
import Init from "./script/Init";

// 导入默认数据
import data from './data/default.json'
import Variables from "./script/Env";
import ChessboardUtils from "./utils/ChessboardUtils";
import VariableUtils from "./utils/VariablesUtils";
import ChessUtils from "./utils/ChessUtils";
const { resetEnv } = VariableUtils
const { revokeMove } = ChessUtils
const { resetChessBoard, reverseChessboard } = ChessboardUtils

reverseChessboard()

/** 先初始化 棋盘 */
const init = new Init()
const MainLattice = new Lattice(data)

document.getElementById('btn-revoke').onclick = () => {revokeMove()}
document.getElementById('btn-reset').onclick = () => {
    const _data = resetEnv()
    console.log('上局数据', _data)
    resetChessBoard()
    MainLattice.reset(data)
}
document.getElementById('getInfo').onclick = () => {
    const info = getVariableInfo()
    for(const item of info) console.log(item)
}


/** 获取全局变量并输出信息 */
const getVariableInfo = (): any => {
    const {
        RedOnclickChess,
        BlackOnclickChess,
        LastOnclickChess,
        ChessColor,
        ChessList,
        MoveCount,
        Active,
        Color,
        EatChessList,
        MoveList
    } = Variables
    const data = [
        {'红方点击棋子': RedOnclickChess},
        {'黑方点击棋子': BlackOnclickChess},
        {'上个点击棋子': LastOnclickChess},
        {'棋子列表': ChessList},
        {'移动坐标列表': MoveList},
        {'被吃棋子列表': EatChessList},
        `当前棋子方: ${Color ? '红方' : '黑方'}`,
        `当前点击棋子颜色: ${ChessColor ? '红' : '黑'}`,
        `移动计数: 共移动${MoveCount}次`,
        `当前是否有棋子激活: ${Active ? '是' : '否'}`
    ]
    return data
}
