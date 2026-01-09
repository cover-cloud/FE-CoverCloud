"use client";
import ItemEditor from "@/app/post/components/ItemEditor";
import { useAuthStore } from "@/app/store/useAuthStore";
const page = () => {
  const accessToekn = useAuthStore((state) => state.accessToken);
  console.log(accessToekn, "accessToekn");
  return <ItemEditor mode="edit" />;
};

export default page;
