import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm border-[1.5px] border-transparent font-semibold transition-[background-color,color,border-color,transform] duration-200 ease-[var(--ease-smooth-out)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-forest text-cream hover:bg-forest-dark",
        secondary:
          "bg-transparent text-forest-dark border-forest hover:bg-forest hover:text-cream",
        ochre: "bg-ochre text-charcoal hover:bg-ochre-dark hover:text-cream",
        whatsapp: "bg-whatsapp text-white hover:bg-whatsapp-dark",
        ghost: "bg-transparent text-charcoal-soft hover:text-forest-dark",
        danger: "bg-transparent text-danger hover:underline",
      },
      size: {
        default: "min-h-12 px-6 py-3",
        sm: "min-h-11 px-3 py-2 text-sm",
        lg: "min-h-12 w-full px-6 py-3",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
