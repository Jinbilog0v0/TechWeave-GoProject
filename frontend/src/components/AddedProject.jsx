import { CheckCircle2Icon } from "lucide-react"

import {
  Alert,
  AlertTitle,
} from "@/components/ui/alert"

export function AlertDemo() {
  return (
    <div className="grid w-full max-w-xl items-start gap-4">
      <Alert className="mb-6 fixed top-5 left-1/2 transform -translate-x-1/2 z-50 shadow-green-700/50">
        <CheckCircle2Icon />
        <AlertTitle className="text-green-600">New project successfulli added!</AlertTitle>
      </Alert>
    </div>
  )
}
