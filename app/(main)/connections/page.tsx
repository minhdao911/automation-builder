import PageContainer from "@/components/page-container";
import { CONNECTIONS } from "@/lib/constant";
import { FunctionComponent } from "react";
import ConnectionCard from "./_components/connection-card";

interface ConnectionsProps {}

const Connections: FunctionComponent<ConnectionsProps> = () => {
  return (
    <PageContainer title="Connections">
      <div className="relative flex flex-col gap-4">
        <section className="flex flex-col gap-4 p-6 text-muted-foreground">
          Connect all your apps directly from here. You may need to connect
          these apps regularly to refresh verification
          {CONNECTIONS.map((connection, index) => (
            <ConnectionCard key={index} {...connection} />
          ))}
        </section>
      </div>
    </PageContainer>
  );
};

export default Connections;
