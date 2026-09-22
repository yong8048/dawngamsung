"use client";

import { StoreEditor } from "@/components/admin/store-editor";
import { createStore } from "@/lib/firebase/stores";
import { uploadStoreImages } from "@/lib/firebase/images";
import { useQueryClient } from "@tanstack/react-query";

export default function AdminUploadPage() {
  const queryClient = useQueryClient();

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-semibold">매장 추가</h1>
      <StoreEditor
        submitLabel="업로드"
        onSubmit={async (input, files) => {
          const id = await createStore(input);
          if (files.length) await uploadStoreImages(id, files);
          queryClient.invalidateQueries({ queryKey: ["stores"] });
        }}
      />
    </div>
  );
}
