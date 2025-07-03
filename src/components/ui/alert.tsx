import * as React from "react";
import { cn } from "../../lib/utils";

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  info: "bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-700",
  success:
    "bg-green-50 text-green-900 border-green-200 dark:bg-green-900/30 dark:text-green-100 dark:border-green-700",
  warning:
    "bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-100 dark:border-yellow-700",
  error:
    "bg-red-50 text-red-900 border-red-200 dark:bg-red-900/30 dark:text-red-100 dark:border-red-700",
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { className, variant = "info", title, description, icon, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      role="alert"
      className={cn(
        "w-full rounded-lg border px-4 py-3 flex items-start gap-3 shadow-sm",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="mt-0.5">{icon}</span>}
      <div className="flex flex-col">
        {title && <div className="font-semibold text-base mb-0.5">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
        {children}
      </div>
    </div>
  );
});

Alert.displayName = "Alert";

export { Alert };
