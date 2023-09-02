import { env } from "./env.js";
import {
  getResourceByName,
  getSuccessDeployment,
  projects,
  restartDeployment,
  restartPlugin,
} from "./request.js";

if (env.SERVICES) {
  for (const { projectName, environmentName, serviceName } of env.SERVICES) {
    const project = getResourceByName(projects, projectName);
    const environment = getResourceByName(
      project.environments,
      environmentName,
    );
    const service = getResourceByName(project.services, serviceName);

    const deployment = await getSuccessDeployment(
      project,
      service,
      environment,
    );

    try {
      await restartDeployment(deployment);
    } catch (e) {
      if (!(e instanceof Error)) throw e;

      console.error(
        `Error restarting deployment ${deployment.id} in ${environment.name}: ${e.message}`,
      );
      console.error(`Please restart manually`);

      continue;
    }

    console.log(
      `Deployment ${deployment.id} (${project.id}:${service.id}:${environment.id}) has been restarted`,
    );
  }
}

if (env.PLUGINS) {
  for (const { projectName, environmentName, pluginName } of env.PLUGINS) {
    const project = getResourceByName(projects, projectName);
    const environment = getResourceByName(
      project.environments,
      environmentName,
    );

    const plugin = project.plugins.edges.find(
      (plugin) => plugin.node.friendlyName === pluginName,
    )?.node;

    if (!plugin) {
      throw new Error(
        `Plugin ${pluginName} not found in ${project.name}:${environment.name}`,
      );
    }

    try {
      await restartPlugin(plugin, environment);
    } catch (e) {
      if (!(e instanceof Error)) throw e;

      console.error(
        `Error restarting plugin ${plugin.name} in ${environment.name}: ${e.message}`,
      );
      console.error(`Please restart manually`);

      continue;
    }

    console.log(
      `Plugin ${project.name}:${plugin.name}:${environmentName} has been restarted`,
    );
  }
}
