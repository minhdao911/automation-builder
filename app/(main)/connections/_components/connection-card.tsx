import { FunctionComponent } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import { Connection } from "@prisma/client";
import { mapConnectionType } from "@/lib/utils";
import { ConnectionType } from "@/lib/types";
import ConnectButton from "@/components/connect-button";

interface ConnectionCardProps {
  type: ConnectionType;
  icon: string;
  description: string;
  connection: Connection;
}

const ConnectionCard: FunctionComponent<ConnectionCardProps> = ({
  type,
  icon,
  description,
  connection,
}) => {
  const connectionMap = mapConnectionType(connection);

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
        {connectionMap[type] ? (
          <div className="flex items-center font-bold text-white">
            Connected
            <CircleCheck size={24} className="ml-2 text-green-500" />
          </div>
        ) : (
          <ConnectButton dataType={type} />
        )}
      </div>
    </Card>
  );
};

export default ConnectionCard;
