import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    console.log('Congratulations, your extension "vsplay" is now active!');

    const videoplayButton = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    videoplayButton.text = '$(play)';
    videoplayButton.command = 'vsplay.playVideo';

    context.subscriptions.push(vscode.commands.registerCommand('vsplay.playVideo', () => {
        const panel = vscode.window.createWebviewPanel(
            'vsplay',
            'Visual Studio Player',
            vscode.ViewColumn.Two,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(context.extensionPath, 'media'))
                ]
            }
        );

        const mediaPath = path.join(context.extensionPath, 'media');
        const indexPath = path.join(mediaPath, 'index.html');
        
        let indexHtml = fs.readFileSync(indexPath, 'utf8');

        const scriptUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(mediaPath, 'script.js')));
        const styleUri = panel.webview.asWebviewUri(vscode.Uri.file(path.join(mediaPath, 'style.css')));
        
        indexHtml = indexHtml.replace(/{{scriptUri}}/g, scriptUri.toString());
        indexHtml = indexHtml.replace(/{{styleUri}}/g, styleUri.toString());

        // Set the webview HTML content to indexHtml only
        panel.webview.html = indexHtml;
    }));

    videoplayButton.show();
    context.subscriptions.push(videoplayButton);
}

// This method is called when your extension is deactivated
export function deactivate() {}
