
"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle2, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center text-right w-full gap-4" dir="rtl">
              <div className="shrink-0">
                {variant === 'success' && (
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                )}
                {variant === 'destructive' && (
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                )}
                {(!variant || variant === 'default') && (
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center border border-orange-100">
                    <Info className="w-5 h-5 text-orange-500" />
                  </div>
                )}
              </div>
              <div className="grid gap-0.5 flex-1 text-right">
                {title && <ToastTitle className="text-sm font-black">{title}</ToastTitle>}
                {description && (
                  <ToastDescription className="text-[11px] font-bold">{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
