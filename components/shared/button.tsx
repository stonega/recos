import { forwardRef, RefObject } from "react";
import classNames from "classnames";
import Link from "next/link";
import { LoadingCircle, LoadingSpinner } from "./icons";

type ButtonSize = "sm" | "md" | "lg";
interface ButtonProps {
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  href?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event?: React.MouseEvent<HTMLElement, MouseEvent>) => any;
  ref?: RefObject<any> | ((instance: any) => void) | null | undefined;
}

const Button = forwardRef(function Button(
  {
    size = "md",
    children,
    type,
    disabled,
    className,
    onClick,
    href,
    loading = false,
  }: ButtonProps,
  buttonRef,
) {
  let sizeClassName: string = "";
  switch (size) {
    case "lg":
      sizeClassName = "p-4 text-2xl";
      break;
    case "md":
      sizeClassName = "p-3 text-xl";
      break;
    case "sm":
      sizeClassName = "p-2 text-sm";
      break;
  }
  const basicClassName =
    "relative transition-ease flex flex-row space-x-2 items-center bg-green-500 text-black whitespace-nowrap hover:text-black w-auto font-bold text-center border-2 rounded-lg border-none active:border-transparent outline-green-500 active:outline active:outline-2 active:outline-offset-4";
  const props = {
    onClick,
    type,
    disabled,
    ref: buttonRef as React.RefObject<any>,
  };
  if (href)
    return (
      <Link href={href}>
        <a
          {...props}
          className={classNames(basicClassName, sizeClassName, className)}
        >
          {children}
        </a>
      </Link>
    );
  return (
    <button
      {...props}
      className={classNames(className, basicClassName, sizeClassName)}
    >
      <span>{children}</span>
      {loading && <LoadingCircle />}
    </button>
  );
});

export default Button;
