import Loader from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center h-screen bg-background">
      <Loader />
    </div>
  );
}
