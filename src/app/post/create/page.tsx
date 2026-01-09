"use client";
import ItemEditor from "@/app/post/components/ItemEditor";
import { useAuthStore } from "@/app/store/useAuthStore";

const CreatePage = () => {
  const accessToken = useAuthStore((state) => state.accessToken);

  return <ItemEditor mode="create" />;
};

export default CreatePage;
