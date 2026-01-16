import api from "../api";
import { LoyaltyPolicyInfoResponse } from "../interfaces/response";

export interface FetchPolicyInfoPayload {
  policy_id: number;
  userAgentID: string;
}

export const fetchPolicyInfoService = async (
  payload: FetchPolicyInfoPayload
): Promise<LoyaltyPolicyInfoResponse> => {
  const response = await api.post("/fetchPolicyInfo", payload);
  return response.data;
};
