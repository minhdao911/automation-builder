import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Zap } from "lucide-react";

type Props = {
  id: string;
  name: string;
  description: string | null;
  published: boolean;
};

const WorkflowCard = ({ description, id, name, published }: Props) => {
  return (
    <Card className="flex w-full items-center justify-between">
      <CardHeader className="flex flex-col">
        <Link href={`/workflows/editor/${id}`}>
          <div className="flex items-center">
            <Zap size={24} />
          </div>
          <div className="my-2.5">
            <CardTitle className="text-lg">{name}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                published ? "bg-green-500" : "bg-orange-400"
              }`}
            />
            <p className="text-sm text-gray-500">
              {published ? "Published" : "Not published"}
            </p>
          </div>
        </Link>
      </CardHeader>
    </Card>
  );
};

export default WorkflowCard;
