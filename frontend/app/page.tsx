import { FileUpload } from "@/components/file-upload"

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-3 text-balance">Config Deployment</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Upload your YAML or config file to deploy with our intelligent agent system
          </p>
        </div>
        <FileUpload />
      </div>
    </main>
  )
}
