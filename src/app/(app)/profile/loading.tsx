import { Header } from "@/components/layout/header";
import { ProfileSkeleton } from "@/components/skeletons/profile-skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <Header title="Profile" />
      <ProfileSkeleton />
    </div>
  );
}
