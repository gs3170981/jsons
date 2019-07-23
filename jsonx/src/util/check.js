const vscode = require('vscode');

module.exports = class Check {
  constructor(ctx) {
    this.ctx = ctx
    this.timer = 0
    this.diagnosticCollection = {}
    this.init()
  }
  init() {
    this.ctx.subscriptions.push(vscode.Disposable())
    this.diagnosticCollection = vscode.languages.createDiagnosticCollection('jsonx')
    this.ctx.subscriptions.push(this.diagnosticCollection);
  }
  check(e) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      let canonicalFile = vscode.Uri.parse(vscode.Uri.file(e.uri.fsPath).toString());
      let code = this.tipsRemove(e)
      try {
        JSON.parse(code)
      } catch ({
        message
      }) {
        let posIndex = message.lastIndexOf('position ')
        let errorNum = ~posIndex ? message.substring(posIndex + 9, message.length) : 0
        let errorPos = e.positionAt(errorNum)
        let range = new vscode.Range(errorPos.line, errorPos.character, errorPos.line, errorPos.character + 3);
        // https://code.visualstudio.com/api/references/vscode-api#DiagnosticSeverity
        this.diagnosticCollection.set(canonicalFile, [
          new vscode.Diagnostic(range, `[jsonx]: 该行含有错误\nposition:${message}\ntips:错误校验并不十分准确，请查看上下文本域排错`, 0)
        ]);
        return
      }
      this.diagnosticCollection.delete(canonicalFile)
    }, 500)
  }
  tipsRemove(e) {
    let newJson = ''
    for (let i = 0; i < e.lineCount; i++) {
      // 左引号、最右引号，左第二引号，冒号
      let l, r, l2, m, tipsSub, space
      let str = e.lineAt(i).text
      let tipsIndex = str.lastIndexOf('//')
      // 有注释的情况下
      if (~tipsIndex) {
        space = ''
        tipsSub = str.substring(tipsIndex, str.length)
        // 计算空格数
        for (let j = 0; j < tipsSub.length; j++) {
          space += ' '
        }
        r = tipsSub[tipsSub.length - 1] === '"'
        // 最右为引号，判断是否为字段内//的可能性
        if (r) {
          l = str.lastIndexOf('"', str.length - tipsIndex)
          l2 = str.lastIndexOf('"', str.length - l)
          m = str.lastIndexOf(':', str.length - l)
          // 不是字段
          if (l2 > m) {
            newJson += str.replace(tipsSub, space) + '\n'
          } else {
            // 是字段
            newJson += str + '\n'
          }
        } else {
          // 最右不是引号，直接替换空格
          newJson += str.replace(tipsSub, space) + '\n'
        }
      } else {
        newJson += str + '\n'
      }
    }
    return newJson
  }
}