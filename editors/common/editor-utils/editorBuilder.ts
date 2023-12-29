import { basicSetup } from "codemirror";
import { EditorState } from "@codemirror/state";
import {
  Annotation,
  type Extension,
  type Transaction,
} from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { autocompletion } from "@codemirror/autocomplete";
import {
  projectionPlugin,
  completions,
  type ProjectionPluginConfig,
} from "@puredit/projections";
import { oneDark } from "@codemirror/theme-one-dark";
import {
  typescript,
  completionSource as typescriptCompletionSource,
} from "@puredit/codemirror-typescript";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { MessageType, mapChangeSetToChanges } from "@puredit/editor-interface";

export default class ProjectionalEditorBuilder {
  private extenstions: Extension[] = [];
  private parent: Element | DocumentFragment;
  readonly syncChangeAnnotation = Annotation.define<boolean>();

  constructor() {
    this.addBasicExtensions()
      .addOpticalExtensions()
      .addExtensions(
        typescript({ disableCompletions: true, disableTooltips: true }),
        autocompletion({
          activateOnTyping: true,
          override: [completions, typescriptCompletionSource],
        })
      );
  }

  private addBasicExtensions(): ProjectionalEditorBuilder {
    this.addExtensions(basicSetup, keymap.of([indentWithTab]));
    return this;
  }

  private addOpticalExtensions(): ProjectionalEditorBuilder {
    this.addExtensions(
      oneDark,
      indentationMarkers(),
      EditorView.theme({
        ".cm-scroller": {
          fontFamily: "var(--mono-font, monospace)",
          fontSize: "14px",
        },
        ".cm-tooltip": {
          fontFamily: "var(--system-font, sans-serif)",
        },
      })
    );
    return this;
  }

  private getDispatchFunction() {
    return (transaction: Transaction, projectionalEditor: EditorView) => {
      if (!transaction.changes.empty && !transaction.annotation(this.syncChangeAnnotation)) {
        const changes = mapChangeSetToChanges(transaction.changes);
        changes.forEach((change) => {
          const lineFromBefore = projectionalEditor.state.doc.lineAt(
            change.fromBefore
          );
          const lineToBefore = projectionalEditor.state.doc.lineAt(
            change.toBefore
          );
          change.setLinesBefore(lineFromBefore, lineToBefore);
        });

        projectionalEditor.update([transaction]);

        changes.forEach((change) => {
          const lineFromAfter = projectionalEditor.state.doc.lineAt(
            change.fromAfter
          );
          const lineToAfter = projectionalEditor.state.doc.lineAt(
            change.toAfter
          );
          change.setLinesAfter(lineFromAfter, lineToAfter);
          change.computeLineInfo();
          vscode.postMessage({
            type: MessageType.UPDATE_DOCUMENT,
            payload: change.toChangeDocumentPayload(),
          });
        });
      } else {
        projectionalEditor.update([transaction]);
      }
      console.log(transaction);
    };
  }

  configureProjectionPlugin(
    config: ProjectionPluginConfig
  ): ProjectionalEditorBuilder {
    this.addExtensions(projectionPlugin(config));
    return this;
  }

  addExtensions(...extensions: Extension[]): ProjectionalEditorBuilder {
    this.extenstions.push(...extensions);
    return this;
  }

  setParent(parent: Element | DocumentFragment) {
    this.parent = parent;
    return this;
  }

  build(): EditorView {
    return new EditorView({
      state: EditorState.create({
        extensions: this.extenstions,
      }),
      parent: this.parent,
      dispatch: this.getDispatchFunction(),
    });
  }
}
