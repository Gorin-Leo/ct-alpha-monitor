# CT Alpha Monitor

一个中文 CT 代币实时行情看板，使用 Binance Alpha 公开行情，支持 K 线、MACD、候选价位与波动稳定度观察。不需要 API Key，不连接交易账户，不执行交易。

## 功能

- 1 分钟 / 5 分钟 K 线，每 5 秒请求更新，北京时间显示。
- 鼠标滚轮缩放、按住左键拖动、双击恢复默认视图。
- 十字光标显示时间和价格，最新 K 线显示倒计时。
- EMA20、EMA60、成交额与 MACD（12、26、9）。
- 已收盘 K 线上的买卖候选三角形；点击标记查看对应时间和参考价位。
- 止损、止盈参考和可调整的收益风险倍数；交易金额以 USDT 输入。
- 红 / 黄 / 绿稳定度看板、当前判读与未来数根 K 线的条件情景。

## 本地运行（Windows）

1. 安装 Node.js 22 或更新版本：https://nodejs.org/
2. 下载或克隆本仓库；如果下载 ZIP，先解压。
3. 在项目文件夹地址栏输入 `powershell`，按回车。
4. 输入以下命令：

```powershell
npm start
```

5. 浏览器打开 http://127.0.0.1:4173 。终端保持打开，按 Ctrl+C 停止。

本地启动无第三方依赖，不需要先运行 npm install。若 PowerShell 阻止 npm.ps1，可改用 `npm.cmd start` 或 `node scripts/preview.mjs`。

行情需要运行电脑能够访问 Binance 的公开接口。网络限制、接口限流或上游接口变化都可能导致无法更新；本地服务启动成功不代表行情接口一定可用。

## 可选：部署到 Cloudflare Workers

已提供 `wrangler.toml`，入口为 `worker/index.js`。需要自己的 Cloudflare 账户和可用网络，在项目目录依次运行：

```powershell
npx wrangler login
npx wrangler deploy
```

首次运行会提示下载 Wrangler。登录后，deploy 会向你的账户发布 Worker；根据终端结果访问生成的网址。此部署路径提供了配置，但未在开源副本中执行线上部署。不要把账户凭证写进代码。GitHub Pages 仅提供静态托管，不能直接运行本项目的 Worker API。

## 项目结构

```text
worker/index.js                页面、Canvas 图表及行情代理
scripts/preview.mjs            本地 HTTP 服务（仅监听本机）
scripts/check-judgement.mjs    当前判读逻辑回归检查
package.json                  启动及测试命令
wrangler.toml                 可选的 Cloudflare Workers 配置
LICENSE                       MIT 许可证
```

运行检查：`npm test`。该检查覆盖部分判读逻辑，不代表完成了策略回测或所有浏览器交互测试。

## 数据与图例

- 代币：Concrete（CT），BSC 合约 `0x0a092e544da31150b439a1aaa1a3a2214a867f46`。
- Binance Alpha 行情标识：`ALPHA_1228USDT`，需自行核实上游是否仍使用该标识。
- 数据接口：`https://www.binance.com/bapi/defi/v1/public/alpha-trade` 下的 `/klines`、`/ticker`。
- 黄色实线为 EMA20，蓝色实线为 EMA60；黄色、蓝色水平虚线分别为近期高点和低点。
- 图中成交量区域采用接口的计价成交额字段，单位为 USDT。
- 时间显示为北京时间；倒计时依赖系统时间，非交易所权威校时。

## 候选规则与局限

买入候选主要结合前 6 根 K 线高点突破、EMA20 方向、MACD 柱变化及单根振幅；卖出候选主要结合前 6 根低点跌破、EMA20 和负 MACD 柱。相同方向标记有间隔约束；完整条件以 `worker/index.js` 中的 `scan` 为准。

稳定度基于最近已收盘 K 线的振幅和收盘变化，是波动分类，不是上涨概率。当前判读另有信号新鲜度、价格距离和风险条件，因此不一定与每个历史三角形一致。未来情景是有条件的描述，不是确定预测。

止盈参考使用可调整的收益风险倍数计算；不是收益保证。候选参考价不保证能够成交。指标初始化、样本长度、网络延迟与未收盘行情变化会影响显示。本项目没有证明这些规则存在稳定盈利优势，未计入手续费、滑点和流动性成本。仅供学习和行情观察，使用者自行判断交易风险。

## 开源与贡献

代码使用 MIT 许可证，见 LICENSE。该许可仅覆盖本项目代码，不授予 Binance 品牌、行情数据或服务的额外权利。本项目与 Binance 无隶属或背书关系。欢迎通过 Issue 反馈问题或提交 Pull Request；请勿提交 API Key、密码、账户信息或其他私人数据。

本仓库为独立发布副本，不包含原托管平台配置、访问授权名单或原 Git 历史。
