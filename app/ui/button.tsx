import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface LinkButtonProps extends ButtonProps {
  href: HTMLAnchorElement["href"];
  target: HTMLAnchorElement["target"];
}

export function Button({ children, className, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className={clsx(
        "flex h-10 items-center rounded-lg bg-gray-600 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black-500 active:bg-black-600 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        className
      )}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  className,
  href,
  target,
  ...rest
}: LinkButtonProps) {
  return (
    <a href={href} target={target}>
      <Button children={children} className={className} {...rest}></Button>
    </a>
  );
}
