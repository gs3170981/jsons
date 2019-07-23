const vscode = require('vscode');
const Check = require('./src/util/check');

console.log('jsonx - 扩展已被执行');

// let diagnosticCollection;

function activate(ctx) {
  console.log('jsonx - 扩展已激活');
  let JsonxCheck = new Check(ctx)
  vscode.workspace.textDocuments.forEach(e => e.languageId === 'jsonx' && JsonxCheck.check(e))
  // ctx.subscriptions.push(vscode.Disposable())
  // diagnosticCollection = vscode.languages.createDiagnosticCollection('jsonx')
  // ctx.subscriptions.push(diagnosticCollection);
  vscode.workspace.onDidOpenTextDocument(e => {
    e.languageId === 'jsonx' &&
      JsonxCheck.check(e)
  })
  vscode.workspace.onDidChangeTextDocument(e => {
    e.document.languageId === 'jsonx' &&
      JsonxCheck.check(e.document)
    // debugger // e.document.getText()
    // check
    // check(e.document.uri.fsPath, {}).then(err => {
    //   debugger
    // })
    // return false
    // let canonicalFile = vscode.Uri.file(e.document.uri.fsPath).toString();
    // 第几行（下标从0开始，第几个 - 第几行，直到第几个）
    // let range = new vscode.Range(11, 2, 11, 13);
    // 输出一共行数 与 第几行
    // 对每一行进行规则校验 然后添加错误 再最后输出
    // console.log(e.document.lineCount, e.document.lineAt(0))

    // diagnosticCollection.set(vscode.Uri.parse(canonicalFile), [
    //   new vscode.Diagnostic(range, '[jsonx]: 报错玩玩')
    // ]);
  });
  // vscode.languages.registerHoverProvider({
  //   scheme: 'file',
  //   language: 'jsonx'
  // }, {
  //   provideHover(document, position, token) {
  //     // new Breakpoint()
  //     return {
  //       contents: ['欢迎使用新文本工具 - json']
  //     };
  //   }
  // });
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
  console.log('jsonx - 扩展已退出')
}

exports.activate = activate;

module.exports = {
  activate,
  deactivate
}