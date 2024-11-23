import { PropsWithChildren, ReactNode, useMemo } from "react";
import { ApiContext, TodosApi } from "./contexts/api";

type ApiProviderProps = PropsWithChildren<{
  children: ReactNode;
  baseUrl: string;
  channel?: string;
}>;

export const ApiProvider = ({ children, baseUrl }: ApiProviderProps) => {
  const api = useMemo(() => new TodosApi(baseUrl), [baseUrl]);
  return <ApiContext.Provider value={api}>{children}</ApiContext.Provider>;
};
