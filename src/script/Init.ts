/**
 * @file 棋盘的初始化文件 用于绘制棋盘背景
 * @author 夜明筱笙
*/

/**
 * 初始化类 初始化棋盘
 */
export default class Init {

	/** 获取 canvas */
	private _canvas: HTMLCanvasElement = document.getElementsByTagName('canvas')[0]

	/** canvas 上下文 */
	private _ctx: CanvasRenderingContext2D = this._canvas.getContext('2d')

	/** 棋盘格子大小 */
	private _size: number

	/** 格子初始 x 坐标 */
	private _x: number = 50

	/** 格子初始 y 坐标 */
	private _y: number = 50

	constructor() {
		/** 设置 canvas 宽高 */
		this._canvas.height = 1000
		this._canvas.width = 900
		/** 设置 格子 大小 */
		this._size = (this._canvas.height - 100) / 9
        this._ctx.fillStyle = 'rgb(255, 150, 70)'
        this._ctx.fillRect(0, 0, 900, 1000)
		/** 开始绘制棋盘 */
		this.drawLattice()
	}



	/** 绘制棋盘的格子 */
	drawLattice() {
		// 象棋棋盘 九行十列 先从 行 开始
		for (let i = 0; i < 8; i++) {
			// 如果 i 等于 4 即 到了 第五行 因为要有 河界 所以 跳过了
			if (i === 4) this._y += this._size

			// 因为 跳过了一行 所以 这里 只需要循环 8 次
			for (let j = 0; j < 8; j++) {
				// 到了指定坐标开始绘制九宫格
				if (
					(i === 0 && j === 3) || 
					(i === 6 && j === 3)
				) this.ninePace()

				// 绘制 格子
				this._ctx.strokeRect(this._x, this._y, this._size, this._size);
				this._x += this._size;
			}
			// 一行结束，x 坐标归零
			this._x = 50
			// y 坐标加一 表示新一行
			this._y += this._size
		}
	}



	/** 九宫格 */
	ninePace() {
		// 开始一个路径
		this._ctx.beginPath();
		// 将 线条移动到 x,y
		this._ctx.moveTo(this._x, this._y);
		// 画斜线
		this._ctx.lineTo(this._x + this._size * 2, this._y + this._size * 2);
		// 再移动到 x y
		this._ctx.moveTo(this._x + this._size * 2, this._y);
		// 画斜线
		this._ctx.lineTo(this._x, this._y + this._size * 2);
		// 描边
		this._ctx.stroke();
		// 关闭路径
		this._ctx.closePath();
	}

}
