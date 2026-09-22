import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";

const filePathFromUrl = (url: string) => {
  const encoded = url.split("/o/")[1]?.split("?")[0];
  if (!encoded) throw new Error("이미지 경로를 찾을 수 없습니다.");
  return decodeURIComponent(encoded);
};

export const getStoreImages = async (storeId: string) => {
  const storage = getFirebaseStorage();
  if (!storage) return [];
  const folder = ref(storage, `stores/${storeId}`);
  const listed = await listAll(folder);
  const urls = await Promise.all(listed.items.map(item => getDownloadURL(item)));
  return urls;
};

export const uploadStoreImages = async (storeId: string, files: File[]) => {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase가 설정되지 않았습니다.");
  await Promise.all(
    files.map(async (file, index) => {
      const stamp = `${Date.now()}-${index}`;
      const imageRef = ref(storage, `stores/${storeId}/${stamp}-${file.name}`);
      await uploadBytes(imageRef, file);
    }),
  );
};

export const deleteStoreImage = async (url: string) => {
  const storage = getFirebaseStorage();
  if (!storage) throw new Error("Firebase가 설정되지 않았습니다.");
  await deleteObject(ref(storage, filePathFromUrl(url)));
};

export const deleteStoreFolder = async (storeId: string) => {
  const storage = getFirebaseStorage();
  if (!storage) return;
  const folder = ref(storage, `stores/${storeId}`);
  const listed = await listAll(folder);
  await Promise.all(listed.items.map(item => deleteObject(item)));
};
