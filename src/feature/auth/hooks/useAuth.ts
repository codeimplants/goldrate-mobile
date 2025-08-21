import { useContext } from "react";
import { AuthContext, AuthContextInterface } from "../AuthContext/AuthContext";

export const useAuth = (): AuthContextInterface => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};