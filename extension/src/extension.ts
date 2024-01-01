import * as vscode from "vscode";
import { ProjectionalEditorProvider } from "./projectionalEditorProvider";

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    ProjectionalEditorProvider.register(
      context,
      "pureditcode.dbSampleEditor",
      {
        scriptPath: "editors/db-sample/index.js",
        stylePath: "editors/db-sample/index.css"
      }
    )
  );

  context.subscriptions.push(
    ProjectionalEditorProvider.register(
      context,
      "pureditcode.polarsEditor",
      {
        scriptPath: "editors/polars/index.js",
        stylePath: "editors/polars/index.css"
      }
    )
  );
}
