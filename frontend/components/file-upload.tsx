"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DeploymentModal } from "@/components/deployment-modal"

export function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isDeploymentModalOpen, setIsDeploymentModalOpen] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && isValidFile(droppedFile)) {
      setFile(droppedFile)
      setUploadComplete(false)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && isValidFile(selectedFile)) {
      setFile(selectedFile)
      setUploadComplete(false)
    }
  }, [])

  const isValidFile = (file: File) => {
    const validExtensions = [".yaml", ".yml", ".json", ".toml", ".conf", ".config"]
    return validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadComplete(false)
  }

  const handleDeploy = async () => {
    if (!file) return
    setIsDeploymentModalOpen(true)
  }

  const handleDeploymentComplete = () => {
    setIsDeploymentModalOpen(false)
    setUploadComplete(true)
  }

  return (
    <>
      <DeploymentModal isOpen={isDeploymentModalOpen} onComplete={handleDeploymentComplete} />

      <Card className="p-8 border-2 border-primary">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-primary mb-2">STEP 1: UPLOAD FILE</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Upload your .yaml, .yml, .json, .toml, or .conf configuration file to begin deployment
            </p>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
            relative border-4 border-primary rounded-lg p-12 text-center transition-colors
            ${isDragging ? "bg-primary/5" : "bg-background"}
            ${file ? "border-solid" : "border-dashed"}
          `}
          >
            {!file ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <Upload className="w-16 h-16 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-primary mb-2">Drag & Drop a file here</p>
                  <p className="text-sm text-muted-foreground mb-4">or</p>
                  <label htmlFor="file-input">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-semibold bg-transparent"
                      onClick={() => document.getElementById("file-input")?.click()}
                    >
                      Browse Files
                    </Button>
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept=".yaml,.yml,.json,.toml,.conf,.config"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-secondary p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-primary" />
                  <div className="text-left">
                    <p className="font-semibold text-primary">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleRemoveFile}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={handleDeploy}
              disabled={!file || uploadComplete}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-lg px-8 py-6"
            >
              {uploadComplete ? "Deployed" : "Deploy"}
            </Button>

            {uploadComplete && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-semibold">Deployment successful!</span>
              </div>
            )}
          </div>

          {uploadComplete && (
            <Card className="p-4 bg-secondary border-primary/20">
              <p className="text-sm text-muted-foreground leading-relaxed">
                <span className="font-semibold text-primary">Next steps:</span> Your configuration has been sent to our
                deployment agents. You'll receive updates on the deployment progress shortly.
              </p>
            </Card>
          )}
        </div>
      </Card>
    </>
  )
}
