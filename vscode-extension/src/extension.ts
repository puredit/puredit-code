import * as vscode from "vscode";
import { DbSampleEditorProvider } from "./dbSampleEditor";
import { PolarsEditorProvider } from "./polarsEditor";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(DbSampleEditorProvider.register(context));
  context.subscriptions.push(PolarsEditorProvider.register(context));
}
