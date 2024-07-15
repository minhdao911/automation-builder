"use client";

import { ConnectionType } from "@/lib/types";
import { useAuth } from "@clerk/nextjs";
import { ConnectorDataType } from "@prisma/client";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Button, ButtonProps } from "./ui/button";
import { usePathname } from "next/navigation";

interface ConnectButtonProps {
  dataType: ConnectionType | ConnectorDataType;
}

const ConnectButton: FunctionComponent<ConnectButtonProps & ButtonProps> = ({
  dataType,
  ...props
}) => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const getConnectionUrl = () => {
    if (!userId) return "#";

    switch (dataType) {
      case ConnectionType.Slack:
        return `${process.env
          .NEXT_PUBLIC_SLACK_SIGN_IN_URL!}&nonce=${userId}&state=${`${process.env.NEXT_PUBLIC_APP_URL}${pathname}`}`;
      default:
        return "#";
    }
  };

  return (
    <Button {...props}>
      <Link href={getConnectionUrl()} className="font-medium">
        Connect
      </Link>
    </Button>
  );
};

export default ConnectButton;
