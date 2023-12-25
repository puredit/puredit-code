<script lang="ts">
  import type { EditorView } from "@codemirror/view";
  import { onDestroy, onMount } from "svelte";
  import { projectionPluginConfig } from "./projections";
  import type { Message } from "@puredit/editor-interface";
  import { MessageType } from "@puredit/editor-interface";
  import { ProjectionalEditorBuilder } from "@puredit/editor-utils";
  import type { ChangeSpec } from "@codemirror/state";

  let container: HTMLDivElement;
  let projectionalEditorBuilder: ProjectionalEditorBuilder;
  let projectionalEditor: EditorView | undefined;

  onMount(() => {
    projectionalEditorBuilder = new ProjectionalEditorBuilder();
    projectionalEditor = projectionalEditorBuilder
      .configureProjectionPlugin(projectionPluginConfig)
      .setParent(container)
      .build();
    projectionalEditor.dispatch();

    vscode.postMessage({
      type: MessageType.GET_DOCUMENT,
    });
  });

  onDestroy(() => {
    projectionalEditor?.destroy();
  });

  function handleWindowMessage(event) {
    const message: Message = event.data;
    if (message.type === MessageType.SEND_DOCUMENT) {
      const text = message.payload;
      projectionalEditor.dispatch({
        changes: { from: 0, insert: text as string },
        annotations: projectionalEditorBuilder.isInit.of(true),
      });
    } else if (message.type === MessageType.UPDATE_EDITOR) {
      projectionalEditor.dispatch({
        changes: message.payload as ChangeSpec,
        annotations: projectionalEditorBuilder.isInit.of(false),
      });
    }
  }
</script>

<svelte:window on:message={handleWindowMessage} />
<div class="container" bind:this={container} />

<style>
  .container {
    width: 100%;
    height: 100%;
  }
</style>
