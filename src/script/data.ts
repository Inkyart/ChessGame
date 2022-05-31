
/**
 * @file 棋子点位数据文件
 * @author 夜明筱笙
 */
import { PointData } from './interFace';

export default function (x: number, y: number, text: string, crossTheRiver?: boolean): PointData {
    if (["兵", "卒"].includes(text)) {
        if (crossTheRiver) {
            return {
                point: [
                    [x, y + 1],
                    [x, y - 1]
                ]
            }
        } else return {
            point: [
                [x, y + 1],
                [x, y - 1],
                [x + 1, y],
                [x - 1, y]
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
                [x, y - 1, x + 1, y],           // 前一点位 右一点位
                [x, y - 1, x - 1, y],           // 前一点位 左一点位
                [x, y + 1, x + 1, y],           // 后一点位 右一点位
                [x, y + 1, x - 1, y],           // 后一点位 左一点位
                [x - 1, y, x, y + 1],           // 左一点位 上一点位
                [x - 1, y, x, y - 1],           // 左一点位 下一点味
                [x + 1, y, x, y + 1],           // 右一点位 下一点位
                [x + 1, y, x, y - 1]            // 右一点位 上一点位
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
                [x + 1, y + 1],
                [x + 1, y - 1],
                [x - 1, y - 1],
                [x - 1, y + 1]
            ],
            edge: [
                [4, 5, 6],
                [1, 2, 3, 8, 9, 10]
            ]
        }

    }
    if (["将", "帅"].includes(text)) {
        return {
            point: [
                [x + 1, y],
                [x - 1, y],
                [x, y - 1],
                [x, y + 1]
            ],
            edge: [
                [4, 5, 6],
                [1, 2, 3, 8, 9, 10]
            ]
        }
    }
}
