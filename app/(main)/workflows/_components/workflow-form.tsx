"use client";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateWorkFlowInputs } from "@/lib/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { FunctionComponent } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface WorkflowFormProps {
  onSubmit: SubmitHandler<CreateWorkFlowInputs>;
}

const WorkflowForm: FunctionComponent<WorkflowFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit } = useForm<CreateWorkFlowInputs>({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            placeholder="Workflow name"
            className="col-span-3"
            {...register("name", { required: true })}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            placeholder="Workflow description"
            className="col-span-3"
            {...register("description")}
          />
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="submit">Save settings</Button>
        </DialogClose>
      </DialogFooter>
    </form>
  );
};

export default WorkflowForm;
