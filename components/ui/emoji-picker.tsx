import dynamic from "next/dynamic";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { PickerProps, Theme } from "emoji-picker-react";
import { Button } from "./button";
import { Ban, CircleX, X } from "lucide-react";

const Picker = dynamic(
  () => {
    return import("emoji-picker-react");
  },
  { ssr: false }
);

const EmojiPicker = (
  props: PickerProps & { emoji?: string; onCancel?: () => void }
) => {
  return (
    <Popover>
      <div className="relative">
        <PopoverTrigger asChild>
          <Button variant="secondary">
            {props.emoji ? (
              props.emoji
            ) : (
              <Ban className="w-[18px] text-neutral-400" />
            )}
          </Button>
        </PopoverTrigger>
        {props.emoji && (
          <X
            size={16}
            className="absolute -right-1.5 -top-1.5 bg-neutral-600 text-neutral-300 rounded-full p-0.5 cursor-pointer"
            onClick={props.onCancel}
          />
        )}
      </div>
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
