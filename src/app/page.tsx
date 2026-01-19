import { redirect } from "next/navigation";

const Home = () => {
  redirect("/main");

  return null;
};

export default Home;
