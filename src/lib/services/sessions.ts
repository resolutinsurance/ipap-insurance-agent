import api from "@/lib/api";
import {
  CreateSessionEventPayload,
  CreateSessionPayload,
  Session,
  SessionEvent,
  UpdateSessionEventPayload,
  UpdateSessionPayload,
} from "@/lib/interfaces/analytics-sessions";

export const createSession = async (payload: CreateSessionPayload): Promise<Session> => {
  const { data } = await api.post<{ message: Session }>("/Sesssions", payload);
  return data.message;
};

export const getSession = async (id: string): Promise<Session> => {
  const { data } = await api.get<{ message: Session }>(`/Sesssions/${id}`);
  return data.message;
};

export const updateSession = async (
  id: string,
  payload: UpdateSessionPayload
): Promise<Session> => {
  const { data } = await api.put<{ message: Session }>(`/Sesssions/${id}`, payload);
  return data.message;
};

export const deleteSession = async (id: string): Promise<void> => {
  await api.delete(`/Sesssions/${id}`);
};

export const createSessionEvent = async (
  payload: CreateSessionEventPayload
): Promise<SessionEvent> => {
  const { data } = await api.post<{ message: SessionEvent }>("/SessionEvent", payload);
  return data.message;
};

export const getSessionEvent = async (id: string): Promise<SessionEvent> => {
  const { data } = await api.get<{ message: SessionEvent }>(`/SessionEvent/${id}`);
  return data.message;
};

export const updateSessionEvent = async (
  id: string,
  payload: UpdateSessionEventPayload
): Promise<SessionEvent> => {
  const { data } = await api.put<{ message: SessionEvent }>(
    `/SessionEvent/${id}`,
    payload
  );
  return data.message;
};

export const deleteSessionEvent = async (id: string): Promise<void> => {
  await api.delete(`/SessionEvent/${id}`);
};
