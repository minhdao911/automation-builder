import { FunctionComponent, useState, useTransition } from "react";
import { SettingsSectionWithEdit } from "./common";
import { Label } from "@/components/ui/label";
import { WorkflowNodeData } from "@/model/types";
import { Node } from "reactflow";
import DatePicker from "@/components/ui/date-picker";
import TimePickerInput from "@/components/ui/time-picker-input";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { CalendarMetadata } from "@/model/google-schemas";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEditorStore } from "@/stores/editor-store";
import Loader from "@/components/ui/loader";
import { createCalendarEvent } from "@/lib/google-helpers";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { doesContainVariable } from "@/lib/utils";

interface CalendarSettingsProps {
  selectedNode: Node<WorkflowNodeData>;
}

const CalendarSettings: FunctionComponent<CalendarSettingsProps> = ({
  selectedNode,
}) => {
  const timeFormat = "HH:mm";
  const { metadata } = selectedNode.data;
  const calendarData = metadata?.googleCalendar;
  const now = new Date();

  const [edit, setEdit] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [allDay, setAllDay] = useState(false);

  const savedData = calendarData
    ? [
        { name: "Title", value: calendarData.summary },
        { name: "Date", value: calendarData.date },
        { name: "Start time", value: calendarData.startTime },
        { name: "End time", value: calendarData.endTime },
        { name: "Description", value: calendarData.description },
      ]
    : undefined;

  const { updateNode } = useEditorStore();
  const {
    getValues,
    setValue,
    setError,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CalendarMetadata>({
    defaultValues: {
      date: calendarData?.date ?? dayjs(now).format("MMMM DD, YYYY"),
      startTime: calendarData?.startTime ?? dayjs(now).format(timeFormat),
      endTime: calendarData?.endTime ?? dayjs(now).format(timeFormat),
      summary: calendarData?.summary ?? "",
      description: calendarData?.description ?? "",
    },
  });
  const date = watch("date");
  const startTime = watch("startTime");
  const endTime = watch("endTime");

  const getCalendarEvent = (data: CalendarMetadata): CalendarMetadata => {
    const { date, startTime, endTime, summary, description } = data;
    const finalStartTime = allDay ? "00:00" : startTime;
    const finalEndTime = allDay ? "23:59" : endTime;

    return {
      date,
      startTime: finalStartTime,
      endTime: finalEndTime,
      summary,
      description,
    };
  };

  const validateForm = (data: CalendarMetadata) => {
    const { date, startTime, endTime } = data;
    if (!date || !startTime || !endTime) {
      return false;
    }
    return true;
  };

  const onSubmit = (data: CalendarMetadata) => {
    if (!validateForm(data)) {
      return;
    }

    const calendarData = getCalendarEvent(data);
    const metadata = selectedNode.data.metadata;
    const updatedMetadata = {
      ...metadata,
      googleCalendar: calendarData,
    };
    updateNode(selectedNode.id, { metadata: updatedMetadata });
    setEdit(false);
  };

  const onCreateTestEvent = () => {
    startTransition(async () => {
      const summary = getValues("summary");
      const description = getValues("description");

      const hasVariables = [
        date,
        startTime,
        endTime,
        summary,
        description,
      ].some((v) => doesContainVariable(v));

      if (hasVariables) {
        toast({
          description: "Cannot create test event with variables",
        });
        return;
      }

      const event = getCalendarEvent({
        date,
        startTime,
        endTime,
        summary,
        description,
      });
      const { message, error } = await createCalendarEvent(event);
      toast({
        description: message,
        variant: error ? "destructive" : undefined,
      });
    });
  };

  return (
    <>
      <SettingsSectionWithEdit
        title="Event Details"
        actionButton={
          <Button size="sm" variant="secondary" onClick={onCreateTestEvent}>
            {isPending ? <Loader /> : <>Create test event</>}
          </Button>
        }
        savedData={savedData}
        edit={edit}
        setEdit={setEdit}
        onSaveClick={handleSubmit(onSubmit)}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="summary">Title</Label>
            <Input
              id="summary"
              className={`${errors.summary ? "border-red-500" : ""}`}
              {...register("summary", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <DatePicker
                className={`${!date ? "border-red-500" : ""}`}
                value={date}
                hasVariable={doesContainVariable(date)}
                onChange={(value) => setValue("date", value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p>from</p>
                <TimePickerInput
                  className={`${!startTime ? "border-red-500" : ""}`}
                  value={startTime}
                  disabled={allDay}
                  hasVariable={doesContainVariable(startTime)}
                  onChange={(value) => setValue("startTime", value)}
                />
                <p>to</p>
                <TimePickerInput
                  className={`${!endTime ? "border-red-500" : ""}`}
                  value={endTime}
                  disabled={allDay}
                  hasVariable={doesContainVariable(endTime)}
                  onChange={(value) => setValue("endTime", value)}
                />
              </div>
              <div className="border-r h-8 border-input" />
              <div className="flex items-center gap-2">
                <Checkbox
                  id="allDay"
                  checked={allDay}
                  onCheckedChange={(checked: boolean) => setAllDay(checked)}
                />
                <label htmlFor="allDay">All day</label>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} />
          </div>
        </form>
      </SettingsSectionWithEdit>
    </>
  );
};

export default CalendarSettings;
