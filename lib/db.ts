import { openDB as idbOpenDB } from "idb";

export const openDB = async () => {
  return idbOpenDB("iinvest-db", 1, {
    upgrade(db) {
      db.createObjectStore("syncQueue", { keyPath: "id" });
    },
  });
};