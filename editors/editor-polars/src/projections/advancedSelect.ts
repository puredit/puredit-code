import { arg } from "@puredit/parser";
import { svelteProjection } from "@puredit/projections";
import type { Projection } from "@puredit/projections";
import { pythonParser } from "./parser";
import AdvancedSelect from "./AdvancedSelect.svelte";

export const [pattern, draft] = pythonParser.statementPattern`
${arg("var0", ["identifier"])}=${arg("var1", ["identifier"])}.select(${arg(
  "var2",
  ["keyword_argument"]
)})
`;

export const widget = svelteProjection(AdvancedSelect);

export const advancedSelect: Projection = {
  name: "advancedSelect",
  description: "Advanced selection",
  pattern,
  draft,
  requiredContextVariables: [],
  widgets: [widget],
};
