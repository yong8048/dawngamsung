export const getAdminUids = () =>
  (process.env.ADMIN_UIDS ?? "")
    .split(",")
    .map(value => value.trim())
    .filter(Boolean);

export const isAdminUid = (uid: string) => getAdminUids().includes(uid);
