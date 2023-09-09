import React from "react";
import * as Select from "@radix-ui/react-select";
import classnames from "classnames";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import { motion } from "framer-motion";
import { FADE_IN_ANIMATION_SETTINGS } from "@/lib/constants";

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
      className="text-normal inline-flex h-[35px] items-center justify-center rounded bg-green-400 px-[15px] leading-none outline-none hover:bg-green-300 dark:bg-green-600"
      aria-label={label}
    >
      <Select.Value placeholder={placeholder} />
      <Select.Icon>
        <ChevronDownIcon />
      </Select.Icon>
    </Select.Trigger>
    <Select.Portal>
      <motion.div
        className="relative inline-block text-left"
        {...FADE_IN_ANIMATION_SETTINGS}
      >
        <Select.Content className="overflow-hidden rounded-md border-2 border-green-500 bg-white shadow-md dark:bg-[#101010]  dark:text-white">
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
      </motion.div>
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
