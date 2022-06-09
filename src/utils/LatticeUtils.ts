/**
 * @file 棋盘格子操作方法文件
 * @description 包含了点击格子方法，激活格子方法，取消激活格子方法
 * @author 夜明筱笙
 */

import Variables from "../script/Env"
import ChessUtils from "./ChessUtils"

/**
 * 棋盘格子操作方法命名空间
 * - 点击格子方法
 * - 激活格子方法
 * - 取消激活格子方法
 */
namespace LatticeUtils {
    /**
     * 点击格子工具函数
     * @param lattice 
     */
    export const onclickLattice = (lattice: HTMLDivElement): void => {
        /** 获取当前格子 x y 轴 */
        const [, y, x] = lattice.className.match(/row-(.{1,2}) column-(.{1})/)
        // 当前有棋子被激活 且 当前格子被激活 移动棋子
        if (Variables.Active && lattice.classList.contains('lattice-active')) ChessUtils.moveChess(parseInt(x), parseInt(y), true)
    }

    /** 
     * 激活格子 
     * @param _goalList 可到达的格子坐标列表
     */
    export const activeLattice = (_goalList: [number, number][]): void => {
        // 首先取消激活的所有格子
        const activeLattice = document.getElementsByClassName('lattice')
        for (let i = 0; i < activeLattice.length; i++) activeLattice[i].classList.remove('lattice-active')

        for (const [x, y] of _goalList) {
            const lattice = document.getElementsByClassName(`lattice row-${y} column-${x}`)[0]
            lattice.classList.add('lattice-active')
        }
    }

    /** 删除所有棋子的active类名*/
    export const removeChessActive = (): void => {
        /** 只有一个激活棋子 */
        const chess = document.getElementsByClassName('chess active')[0]
        if (chess) chess.classList.remove('active')
    }
}
export default LatticeUtils
