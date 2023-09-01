export const getProjectsQuery = /* GraphQL */ `
  {
    projects {
      edges {
        node {
          name
          id
          services {
            edges {
              node {
                name
                id
              }
            }
          }
          plugins {
            edges {
              node {
                name
                id
                friendlyName
              }
            }
          }
          environments {
            edges {
              node {
                name
                id
              }
            }
          }
        }
      }
    }
  }
`;

export const getSuccessDeploymentQuery = /* GraphQL */ `
  query ($projectId: String!, $serviceId: String!, $environmentId: String!) {
    deployments(
      input: {
        projectId: $projectId
        serviceId: $serviceId
        environmentId: $environmentId
        status: { in: [SUCCESS] }
      }
      first: 1
    ) {
      edges {
        node {
          id
          status
        }
      }
    }
  }
`;

export const restartPluginQuery = /* GraphQL */ `
  mutation pluginRestart($id: String!, $environmentId: String!) {
    pluginRestart(id: $id, input: { environmentId: $environmentId }) {
      id
    }
  }
`;

export const restartDeploymentQuery = /* GraphQL */ `
  mutation deploymentRestart($id: String!) {
    deploymentRestart(id: $id) {
      id
    }
  }
`;
