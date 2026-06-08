import { openDB } from "./db";

export const saveOfflineAction = async (data: any) => {
  const db = await openDB();

  await db.put("syncQueue", {
    id: crypto.randomUUID(),
    payload: data,
  });
};

// this was for offline ServiceWorker;