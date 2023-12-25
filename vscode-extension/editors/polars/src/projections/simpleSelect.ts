import { arg } from "@puredit/parser";
import { svelteProjection } from "@puredit/projections";
import type { Projection } from "@puredit/projections";
import { pythonParser } from "./parser";
import SimpleSelect from "./SimpleSelect.svelte";

export const [pattern, draft] = pythonParser.statementPattern`
${arg("var0", ["identifier"])}=${arg("var1", ["identifier"])}.select(${arg(
  "var2",
  ["list", "string"]
)})
`;

export const widget = svelteProjection(SimpleSelect);

export const simpleSelect: Projection = {
  name: "simpleSelect",
  description: "Select one or more columns",
  pattern,
  draft,
  requiredContextVariables: [],
  widgets: [widget],
};
