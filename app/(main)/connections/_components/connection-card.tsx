import { FunctionComponent } from "react";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { CircleCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Connection } from "@prisma/client";
import { mapConnectionType } from "@/lib/utils";
import { ConnectionType } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";

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
  const { userId } = auth();

  const connectionMap = mapConnectionType(connection);

  const getConnectionUrl = () => {
    switch (type) {
      case ConnectionType.Slack:
        return `${process.env.NEXT_PUBLIC_SLACK_SIGN_IN_URL!}&nonce=${userId}`;
      default:
        return "#";
    }
  };

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
          <Link
            href={getConnectionUrl()}
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
