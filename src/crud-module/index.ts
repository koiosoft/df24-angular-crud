import {
  apply,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  Tree,
  url,
} from "@angular-devkit/schematics";
import { strings as stringUtils } from "@angular-devkit/core";

import * as JSON5 from "json5";
import * as crudModelUtils from "../utils/crud-model-utils";

import { CrudOptions } from "./schema";
import { CrudModel } from "./model";
import { capitalize } from "@angular-devkit/core/src/utils/strings";
import { getWorkspace } from "@schematics/angular/utility/workspace";
import { addModuleImportToModule } from "@angular/cdk/schematics";

export const BOOTSTRAP = "bootstrap";
export const MATERIAL = "material";
export const PAPER_DASHBOARD = "paper-dashboard";
export const MATERIAL_DF24 = "df24";

export function generate(options: CrudOptions): Rule {
  return async (host: Tree) => {
    // allow passing the CSS framework in (for testing)
    let cssFramework = options.style;

    const moduleName = options.module ?? "";
    const features = options.features ?? "default";

    cssFramework = MATERIAL_DF24;

    const workspace = await getWorkspace(host);
    if (!options.project) {
      options.project = workspace.projects.keys().next().value;
    }
    const project = workspace.projects.get(options.project);
    const modulePath = moduleName ? `/${moduleName}` : "";
    const hostModulePath = `${project?.sourceRoot}/app${modulePath}`;
    const hostModuleName = moduleName ?? "app";

    const modelFile = `${hostModulePath}/${options.name}/${options.model}`;
    const modelBuffer = host.read(modelFile);

    if (modelBuffer === null) {
      throw new SchematicsException(
        `Model file ${options.model} does not exist with path ${modelFile}.`
      );
    }

    const modelJson = modelBuffer.toString("utf-8");
    const model = JSON5.parse(modelJson) as CrudModel;

    // add imports to app.module.ts
    addModuleImportToModule(
      host,
      `${hostModulePath}/${hostModuleName}.module.ts`,
      `${capitalize(model.entity)}Module`,
      `./${options.name}/${model.entity}.module`
    );

    const templateSource = apply(url(`./files/${cssFramework}/${features}`), [
      template({
        ...stringUtils,
        ...options,
        ...(crudModelUtils as any),
        model,
      }),
      move(`${hostModulePath}/${options.name}`),
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite);
  };
}
