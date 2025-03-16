type InjectableParameter = {
  parameterIndex: number;
  type: any;
};

export const injectionRegistry = new Map<any, InjectableParameter[]>();
