import { currentUser } from "@clerk/nextjs";

export async function WelcomeMsg() {
  const user = await currentUser();

  if (!user) {
    return <div>error</div>;
  }

  return (
    <div className="flex w-full mb-12">
      <h1 className="text-4xl font-bold">
        Bienvenue, <br /> {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}
