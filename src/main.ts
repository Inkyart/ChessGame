/**
 * @file 象棋的主程序
 * @author 夜明筱笙
*/


/** 导入 棋子文件 格子文件 初始化文件 */
import Lattice from "./script/lattice";
import Init from "./script/Init";

// 导入默认数据
import data from './data/default.json'


/** 先初始化 棋盘 */
const init = new Init()
const MainLattice = new Lattice(data)
