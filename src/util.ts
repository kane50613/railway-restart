export function transformPlugin(str: string) {
  const [projectName, pluginName, environmentName] = str.split(":");

  if (!projectName || !pluginName || !environmentName) {
    throw new Error(`Invalid plugin string: ${str}`);
  }

  return {
    projectName,
    pluginName,
    environmentName,
  } as const;
}

export function transformService(str: string) {
  const [projectName, serviceName, environmentName] = str.split(":") as (
    | string
    | undefined
  )[];

  if (!projectName || !serviceName || !environmentName) {
    throw new Error(`Invalid service string: ${str}`);
  }

  return {
    projectName,
    environmentName,
    serviceName,
  } as const;
}
