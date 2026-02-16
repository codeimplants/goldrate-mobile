import { VersionSDK } from "@codeimplants/version-control";
import { VITE_VC_API_KEY, VITE_VC_BACKEND, VITE_VC_DEBUG } from "../constant";

export const sdk = VersionSDK.init(
    VITE_VC_BACKEND,
    VITE_VC_API_KEY
);

export const getDecision = async () => {
    console.log(sdk);
    const decision = await sdk.checkVersion();
    console.log(decision);
    return decision;
};