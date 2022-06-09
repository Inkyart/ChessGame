
/**
 * @file 棋子点位数据文件
 * @author 夜明筱笙
 * @description 象棋的点位数据文件 存有一个获取棋子可以到达格子的函数
 */
import { PointData } from './interFace';

/**
 * 获取棋子点位函数
 * @param x 棋子x坐标
 * @param y 棋子y坐标
 * @param text 棋子文本
 * @param crossTheRiver 棋子是否过河 可选参数
 */
export default function (x: number, y: number, text: string, crossTheRiver?: boolean): PointData {
    if (["兵", "卒"].includes(text)) {
        // 未过河
        if (!crossTheRiver) {
            return {
                point: [
                    text === '兵' ? [x, y + 1] : [x, y - 1]
                ]
            }
        } else return {
            point: [
                text === '兵' ? [x, y + 1] : [x, y - 1],
                [x + 1, y],                     // 右移
                [x - 1, y]                      // 左移
            ]
        }
    }
    if (["马", "馬"].includes(text)) {
        return {
            point: [
                [x + 1, y - 2],                 // 右上偏上 
                [x - 1, y - 2],                 // 左上偏上 
                [x + 1, y + 2],                 // 右下偏下 
                [x - 1, y + 2],                 // 左下偏下 
                [x - 2, y + 1],                 // 左上偏左 
                [x - 2, y - 1],                 // 左下偏左 
                [x + 2, y + 1],                 // 右下偏右 
                [x + 2, y - 1]                  // 右上偏右 
            ],
            edge: [
                [x, y - 1],                     // 前一点位
                [x, y - 1],                     // 前一点位
                [x, y + 1],                     // 后一点位
                [x, y + 1],                     // 后一点位
                [x - 1, y],                     // 左一点位
                [x - 1, y],                     // 左一点位
                [x + 1, y],                     // 右一点位
                [x + 1, y]                      // 右一点位
            ]
        }
    }
    if (["相", "象"].includes(text)) {
        return {
            point: [
                [x + 2, y + 2],                 // 右上
                [x - 2, y + 2],                 // 左上
                [x - 2, y - 2],                 // 左下
                [x + 2, y - 2]                  // 右下
            ],
            edge: [
                [x + 1, y + 1],                 // 右上
                [x - 1, y + 1],                 // 左上
                [x - 1, y - 1],                 // 左下
                [x + 1, y - 1]                  // 右下
            ]
        }
    }
    if (["士", "仕"].includes(text)) {
        return {
            point: [
                [x + 1, y + 1],                 // 右上
                [x + 1, y - 1],                 // 右下
                [x - 1, y - 1],                 // 左下
                [x - 1, y + 1]                  // 左上
            ],
            edge: [
                [4, 5, 6],                      // 九宫格三个列
                [1, 2, 3, 8, 9, 10]             // 九宫格三个行
            ]
        }
    }
    if (["将", "帅"].includes(text)) {
        return {
            point: [
                [x + 1, y],                     // 右移
                [x - 1, y],                     // 左移
                [x, y - 1],                     // 上移
                [x, y + 1]                      // 下移
            ],
            edge: [
                [4, 5, 6],                      // 九宫格三个列
                [1, 2, 3, 8, 9, 10]             // 九宫格三个行
            ]
        }
    }
}
