export type ResourceArray<T> = {
  edges: {
    node: T;
  }[];
};

export type GetProjects = {
  projects: ResourceArray<Project>;
};

export type GetSuccessDeployment = {
  deployments: ResourceArray<Deployment>;
};

export interface Resource {
  id: string;
  name: string;
}

export interface Deployment {
  id: string;
  status: string;
}

export interface Plugin extends Resource {
  friendlyName: string;
}

interface Project extends Resource {
  services: ResourceArray<Resource>;
  plugins: ResourceArray<Plugin>;
  environments: ResourceArray<Resource>;
}
