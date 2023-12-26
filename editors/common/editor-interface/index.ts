export interface Message {
  type: MessageType;
  payload?: ChangeDocumentPayload | ChangeEditorPayload | string;
}

export interface ChangeDocumentPayload {
  type: ChangeType;
  fromBefore: number;
  toBefore: number;
  fromAfter: number;
  toAfter: number;
  inserted: string;
  lineFrom: number;
  characterFrom: number;
  lineTo: number;
  characterTo: number;
}

export interface ChangeEditorPayload {
  from: number;
  to: number;
  insert: string;
}

export const enum ChangeType {
  INSERTION = "INSERTION",
  REPLACEMENT = "REPLACEMENT",
  DELETION = "DELETION",
}

export const enum MessageType {
  GET_DOCUMENT = "GET_DOCUMENT",
  SEND_DOCUMENT = "SEND_DOCUMENT",
  UPDATE_DOCUMENT = "UPDATE_DOCUMENT",
  UPDATE_EDITOR = "UPDATE_EDITOR",
}

export { mapChangeSetToChanges, Change } from "./changeMapping";
