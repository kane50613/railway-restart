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

    await restartDeployment(deployment);

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

    await restartPlugin(plugin, environment);

    console.log(
      `Plugin ${project.name}:${plugin.name}:${environmentName} has been restarted`,
    );
  }
}
