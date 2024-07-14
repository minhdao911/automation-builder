import PageContainer from "@/components/page-container";
import { CONNECTIONS } from "@/lib/constants";
import { FunctionComponent } from "react";
import ConnectionCard from "./_components/connection-card";
import { getConnection } from "./_actions/connection";

interface ConnectionsProps {}

const Connections: FunctionComponent<ConnectionsProps> = async () => {
  const connection = await getConnection();

  if (!connection) return null;

  return (
    <PageContainer title="Connections">
      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 p-6 text-muted-foreground">
          Connect all your apps directly from here. You may need to connect
          these apps regularly to refresh verification
          {CONNECTIONS.map((data, index) => (
            <ConnectionCard key={index} {...data} connection={connection} />
          ))}
        </section>
      </div>
    </PageContainer>
  );
};

export default Connections;
