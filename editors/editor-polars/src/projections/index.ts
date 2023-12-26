import type { ProjectionPluginConfig } from "@puredit/projections";
import { pythonParser } from "./parser";
import { simpleSelect } from "./simpleSelect";
import { advancedSelect } from "./advancedSelect";
import { globalContextValues, globalContextVariables } from "./context";

export const projectionPluginConfig: ProjectionPluginConfig = {
  parser: pythonParser,
  projections: [simpleSelect, advancedSelect],
  globalContextVariables,
  globalContextValues,
};
