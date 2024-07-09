import { FunctionComponent } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { ConnectionType } from "@/lib/types";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ConnectionCardProps {
  type: ConnectionType;
  icon: string;
  description: string;
  connections: { [key: string]: boolean };
}

const ConnectionCard: FunctionComponent<ConnectionCardProps> = ({
  type,
  icon,
  description,
  connections,
}) => {
  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col gap-2">
        <Image
          src={`/${icon}.svg`}
          alt={type}
          height={150}
          width={150}
          className="h-7 w-fit object-contain"
        />
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <div className="flex flex-col items-center gap-2 p-4">
        {connections[type] ? (
          <div className="flex items-center font-bold text-white">
            Connected
            <CircleCheck size={24} className="ml-2 text-green-500" />
          </div>
        ) : (
          <Link
            href="#"
            className="rounded-lg bg-primary p-2 font-bold text-primary-foreground"
          >
            Connect
          </Link>
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
