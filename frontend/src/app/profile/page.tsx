import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileDetails from "./_components/ProfileDetails";

export default async function ProfilePage() {
  const session = await auth();

  if (!session || !session.user?.id) {
    redirect("/auth");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      accounts: true,
    }
  });

  if (!user || !user.profile) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-background-dark text-white p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <ProfileDetails user={user as any} />
      </div>
    </div>
  );
}
