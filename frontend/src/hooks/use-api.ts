import { useContext } from "react";
import { ApiContext } from "../contexts/api";

export const useApi = () => useContext(ApiContext);
