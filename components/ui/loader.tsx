import { LoaderCircle } from "lucide-react";

const Loader = ({ size = 24 }: { size?: number }) => {
  return <LoaderCircle size={size} className="animate-spin" />;
};

export default Loader;
