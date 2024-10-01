import dynamic from "next/dynamic";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { PickerProps, Theme } from "emoji-picker-react";
import { Button } from "./button";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

const EmojiPicker = (props: PickerProps & { emoji: string }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">{props.emoji}</Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Picker
          theme={Theme.DARK}
          height={400}
          previewConfig={{ showPreview: false }}
          {...props}
        />
      </PopoverContent>
    </Popover>
  );
};

export default EmojiPicker;
