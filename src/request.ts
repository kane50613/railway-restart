import { env } from "./env.js";
import { GraphQLClient } from "graphql-request";
import {
  Deployment,
  GetProjects,
  GetSuccessDeployment,
  Resource,
  ResourceArray,
} from "./types.js";
import {
  getProjectsQuery,
  getSuccessDeploymentQuery,
  restartDeploymentQuery,
  restartPluginQuery,
} from "./query.js";

const RAILWAY_ENDPOINT = "https://backboard.railway.app/graphql/v2";

const Authorization = `Bearer ${env.RAILWAY_API_KEY}`;

const client = new GraphQLClient(RAILWAY_ENDPOINT, {
  headers: {
    Authorization,
  },
});

export const { projects } = await getProjects();

// console.log(`Resolved all projects: ${JSON.stringify(projects)}`);

async function getProjects() {
  return client.request<GetProjects>(getProjectsQuery);
}

export async function getSuccessDeployment(
  project: Resource,
  service: Resource,
  environment: Resource
) {
  const deployment = await client
    .request<GetSuccessDeployment>(getSuccessDeploymentQuery, {
      projectId: project.id,
      serviceId: service.id,
      environmentId: environment.id,
    })
    .then(({ deployments }) => deployments.edges.at(0)?.node);

  if (deployment?.status !== "SUCCESS")
    throw new Error(
      `Failed to get a success deployment for ${project.name}:${service.name}:${environment.name}`
    );

  return deployment;
}

export function restartDeployment(deployment: Deployment) {
  return client.request(restartDeploymentQuery, {
    id: deployment.id,
  });
}

export function restartPlugin(plugin: Resource, environment: Resource) {
  return client.request(restartPluginQuery, {
    id: plugin.id,
    environmentId: environment.id,
  });
}

export function getResourceByName<T extends Resource>(
  resources: ResourceArray<T>,
  name: string
) {
  // console.log(`Resolving resource ${name} from ${JSON.stringify(resources)}`);

  const record = resources.edges.find(({ node }) => node.name === name);

  if (!record) throw new Error(`Record ${name} not found`);

  return record.node;
}
