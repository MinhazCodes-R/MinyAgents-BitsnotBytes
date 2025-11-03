"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface DeploymentModalProps {
  isOpen: boolean
  onComplete: () => void
}

interface DeploymentStage {
  name: string
  duration: number
  status: "pending" | "active" | "complete" | "error"
}

export function DeploymentModal({ isOpen, onComplete }: DeploymentModalProps) {
  const [stages, setStages] = useState<DeploymentStage[]>([
    { name: "Validating configuration file", duration: 3000, status: "pending" },
    { name: "Parsing YAML structure", duration: 2500, status: "pending" },
    { name: "Connecting to deployment agents", duration: 4000, status: "pending" },
    { name: "Allocating container resources", duration: 5500, status: "pending" },
    { name: "Building deployment environment", duration: 6000, status: "pending" },
    { name: "Starting container instances", duration: 5000, status: "pending" },
    { name: "Running health checks", duration: 3500, status: "pending" },
    { name: "Finalizing deployment", duration: 1000, status: "pending" },
  ])

  const [currentStageIndex, setCurrentStageIndex] = useState(-1)

  useEffect(() => {
    if (!isOpen) {
      // Reset stages when modal closes
      setStages((prev) => prev.map((stage) => ({ ...stage, status: "pending" })))
      setCurrentStageIndex(-1)
      return
    }

    let timeoutId: NodeJS.Timeout

    const processStage = (index: number) => {
      if (index >= stages.length) {
        // All stages complete
        setTimeout(() => {
          onComplete()
        }, 500)
        return
      }

      // Set current stage to active
      setStages((prev) =>
        prev.map((stage, i) => ({
          ...stage,
          status: i === index ? "active" : i < index ? "complete" : "pending",
        })),
      )
      setCurrentStageIndex(index)

      // Move to next stage after duration
      timeoutId = setTimeout(() => {
        processStage(index + 1)
      }, stages[index].duration)
    }

    // Start processing stages
    processStage(0)

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [isOpen, onComplete])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl mx-4 p-8 border-2 border-primary shadow-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">Deploying Configuration</h2>
            <p className="text-muted-foreground">Please wait while we process your deployment...</p>
          </div>

          <div className="space-y-3">
            {stages.map((stage, index) => (
              <div
                key={index}
                className={`
                  flex items-center gap-3 p-4 rounded-lg transition-all duration-300
                  ${stage.status === "active" ? "bg-primary/10 border-2 border-primary" : "bg-secondary border-2 border-transparent"}
                  ${stage.status === "complete" ? "opacity-60" : "opacity-100"}
                `}
              >
                <div className="flex-shrink-0">
                  {stage.status === "active" && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                  {stage.status === "complete" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                  {stage.status === "pending" && (
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                  )}
                  {stage.status === "error" && <AlertCircle className="w-5 h-5 text-destructive" />}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      stage.status === "active"
                        ? "text-primary"
                        : stage.status === "complete"
                          ? "text-muted-foreground"
                          : "text-foreground"
                    }`}
                  >
                    {stage.name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Stage {currentStageIndex + 1} of {stages.length}
              </span>
              <span className="text-muted-foreground">
                Estimated time:{" "}
                {Math.ceil(
                  stages.reduce((acc, stage, i) => (i > currentStageIndex ? acc + stage.duration : acc), 0) / 1000,
                )}
                s
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
