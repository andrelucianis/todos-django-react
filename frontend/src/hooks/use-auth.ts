import { useContext } from "react";
import { AuthContext } from "../contexts/authentication";

export const useAuth = () => useContext(AuthContext);
