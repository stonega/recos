import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";

interface SelectorProps {
  label: string;
  placeholder: string;
  options: { value: string; label: string }[];
  active?: string;
  onSelect(value: string): void;
}
const Selector = ({
  label,
  placeholder,
  options,
  active,
  onSelect,
}: SelectorProps) => (
  <Select.Root onValueChange={onSelect} defaultValue={active}>
    <Select.Trigger
      className="hover:bg-mauve3 data-[placeholder]:text-violet9 text-normal inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] leading-none outline-none dark:bg-[#101010]"
      aria-label={label}
    >
      <Select.Value placeholder={placeholder}  />
      <Select.Icon className="text-violet11">
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <Select.Content className="overflow-hidden rounded-md border-2 border-green-500 bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
        <Select.ScrollUpButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
          <ChevronUpIcon />
        </Select.ScrollUpButton>
        <Select.Viewport className="p-[5px]">
          <Select.Group>
            {options.map((option) => (
              <SelectItem value={option.value} key={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select.Group>
        </Select.Viewport>
        <Select.ScrollDownButton className="text-violet11 flex h-[25px] cursor-default items-center justify-center bg-white">
          <ChevronDownIcon />
        </Select.ScrollDownButton>
      </Select.Content>
    </Select.Portal>
  </Select.Root>
);

const SelectItem = React.forwardRef(function Item(
  { children, className, ...props }: any,
  forwardedRef,
) {
  return (
    <Select.Item
      className={classnames(
        "data-[disabled]:text-mauve8 data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1 relative flex h-[25px] cursor-pointer select-none items-center rounded-[3px] pl-[25px] pr-[35px] text-[13px] text-sm leading-none data-[disabled]:pointer-events-none data-[highlighted]:outline-none",
        className,
      )}
      {...props}
      ref={forwardedRef}
    >
      <Select.ItemText>{children}</Select.ItemText>
      <Select.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
        <CheckIcon />
      </Select.ItemIndicator>
    </Select.Item>
  );
});

export default Selector;
