const vscode = require('vscode');

console.log('cors - 扩展已被执行');

let diagnosticCollection;

function activate(ctx) {
  console.log('cors - 扩展已激活');

  ctx.subscriptions.push(vscode.Disposable())
  diagnosticCollection = vscode.languages.createDiagnosticCollection('jsonx')
  ctx.subscriptions.push(diagnosticCollection);


  vscode.workspace.onDidChangeTextDocument(e => {
    // 清除
    diagnosticCollection.clear();
    // debugger // e.document.getText()
    // check
    // check(e.document.uri.fsPath, {}).then(err => {
    //   debugger
    // })
    // return false
    let canonicalFile = vscode.Uri.file(e.document.uri.fsPath).toString();
    // 第几行（下标从0开始，第几个 - 第几行，直到第几个）
    let range = new vscode.Range(11, 2, 11, 13);
    // 输出一共行数 与 第几行
    // 对每一行进行规则校验 然后添加错误 再最后输出
    console.log(e.document.lineCount, e.document.lineAt(0))
    // let diagnosticMap = new Map()
    // // let diagnostics = diagnosticMap.get(canonicalFile);
    // let diagnostics = diagnosticMap.get(canonicalFile);
    // diagnostics.push(new vscode.Diagnostic(range, '错误！！', 'asd'));
    // diagnosticMap.set(canonicalFile, diagnostics);
    diagnosticCollection.set(vscode.Uri.parse(canonicalFile), [
      new vscode.Diagnostic(range, '[jsonx]: 报错玩玩')
    ]);
  });
  vscode.languages.registerHoverProvider({
    scheme: 'file',
    language: 'jsonx'
  }, {
    provideHover(document, position, token) {
      // new Breakpoint()
      return {
        contents: ['欢迎使用新文本工具 - json']
      };
    }
  });
  // vscode.languages.registerTypeDefinitionProvider({
  //   scheme: 'file',
  //   language: 'jsonx'
  // }, {
  //   provideHover(document, position, token) {
  //     debugger
  //     return {
  //       contents: ['Hover Content']
  //     };
  //   }
  // });
}

function deactivate() {
  console.log('cors - 扩展已退出')
}

exports.activate = activate;

module.exports = {
  activate,
  deactivate
}