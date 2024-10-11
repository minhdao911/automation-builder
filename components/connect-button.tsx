"use client";

import { ConnectionType } from "@/model/types";
import { useAuth } from "@clerk/nextjs";
import { ConnectorDataType } from "@prisma/client";
import { FunctionComponent } from "react";
import { Button, ButtonProps } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { getAuthUrl } from "@/lib/google-auth";
import { cn } from "@/lib/utils";

interface ConnectButtonProps {
  dataType: ConnectionType | ConnectorDataType;
}

const ConnectButton: FunctionComponent<ConnectButtonProps & ButtonProps> = ({
  dataType,
  ...props
}) => {
  const { userId } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth-callback`;

  const getConnectionUrl = async () => {
    if (!userId) return "#";

    switch (dataType) {
      case ConnectionType.Gmail:
      case ConnectionType.GoogleCalendar:
      case ConnectionType.GoogleDrive: {
        return await getAuthUrl();
      }
      case ConnectionType.Slack:
        return `${process.env
          .NEXT_PUBLIC_SLACK_SIGN_IN_URL!}&redirect_uri=${callbackUrl}/slack&nonce=${userId}&state=${pathname}`;
      case ConnectorDataType.Notion:
        return `${process.env
          .NEXT_PUBLIC_NOTION_SIGN_IN_URL!}&redirect_uri=${callbackUrl}/notion`;
      default:
        return "#";
    }
  };

  return (
    <Button
      {...props}
      className={cn("font-medium", props?.className)}
      onClick={async () => {
        const url = await getConnectionUrl();
        if (url) {
          router.push(url);
        }
      }}
    >
      Connect
    </Button>
  );
};

export default ConnectButton;
