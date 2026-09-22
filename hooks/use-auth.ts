"use client";

import { useEffect } from "react";
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { toast } from "sonner";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { isFirebaseConfigured } from "@/lib/config";
import { ensureUser } from "@/lib/firebase/users";
import { useUserStore } from "@/store/user-store";

export const useAuth = () => {
  const { user, isAdmin, setUser, setAdmin, reset } = useUserStore();

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      if (!firebaseUser) {
        reset();
        return;
      }
      const profile = await ensureUser({
        uid: firebaseUser.uid,
        name: firebaseUser.displayName ?? "사용자",
        email: firebaseUser.email ?? "",
        favorites: [],
      });
      setUser(profile);
      const token = await firebaseUser.getIdToken();
      const adminRes = await fetch("/api/admin/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (adminRes.ok) {
        const data = (await adminRes.json()) as { isAdmin?: boolean };
        setAdmin(Boolean(data.isAdmin));
      }
    });
    return () => unsubscribe();
  }, [reset, setAdmin, setUser]);

  const login = async () => {
    if (!isFirebaseConfigured) {
      toast.error("Firebase 설정을 먼저 추가해 주세요.");
      return;
    }
    const auth = getFirebaseAuth();
    if (!auth) return;
    try {
      const credential = await signInWithPopup(auth, new GoogleAuthProvider());
      const profile = await ensureUser({
        uid: credential.user.uid,
        name: credential.user.displayName ?? "사용자",
        email: credential.user.email ?? "",
        favorites: [],
      });
      setUser(profile);
      toast.success("로그인되었습니다.");
    } catch (error) {
      console.error(error);
      toast.error("로그인에 실패했습니다.");
    }
  };

  const logout = async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    await signOut(auth);
    reset();
    toast.success("로그아웃되었습니다.");
  };

  return { user, isAdmin, login, logout };
};
