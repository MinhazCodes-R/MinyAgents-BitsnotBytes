"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Container, Cpu, HardDrive, Network, Clock, Globe, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ContainerInfo {
  id: string
  name: string
  status: string
  image: string
  created: string
  ports: string[]
  ipAddress: string
  cpu: string
  memory: string
  apiEndpoint: string
}

export default function MonitoringPage() {
  const [containers, setContainers] = useState<ContainerInfo[]>([
    {
      id: "a101cb7e",
      name: "agent1",
      status: "running",
      image: "minyagents-bitsnotbytes-agent1",
      created: "2025-11-03T20:11:26Z",
      ports: ["7001:8000"],
      ipAddress: "172.18.0.5",
      cpu: "2.3%",
      memory: "128 MB",
      apiEndpoint: "https://api.deployment.io/v1/agent1-a101cb7e",
    },
    {
      id: "b202dc8f",
      name: "agent2",
      status: "running",
      image: "minyagents-bitsnotbytes-agent2",
      created: "2025-11-03T20:11:28Z",
      ports: ["7002:8000"],
      ipAddress: "172.18.0.4",
      cpu: "1.8%",
      memory: "112 MB",
      apiEndpoint: "https://api.deployment.io/v1/agent2-b202dc8f",
    },
    {
      id: "c303ed9g",
      name: "agent3",
      status: "running",
      image: "minyagents-bitsnotbytes-agent3",
      created: "2025-11-03T20:11:30Z",
      ports: ["7003:8000"],
      ipAddress: "172.18.0.3",
      cpu: "3.1%",
      memory: "145 MB",
      apiEndpoint: "https://api.deployment.io/v1/agent3-c303ed9g",
    },
  ])

  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setContainers((prevContainers) =>
        prevContainers.map((container) => {
          const currentCpu = Number.parseFloat(container.cpu)
          const cpuVariation = (Math.random() - 0.5) * 1.0
          const newCpu = Math.max(0.1, Math.min(10, currentCpu + cpuVariation))

          const currentMemory = Number.parseInt(container.memory)
          const memoryVariation = Math.floor((Math.random() - 0.5) * 10)
          const newMemory = Math.max(50, Math.min(300, currentMemory + memoryVariation))

          return {
            ...container,
            cpu: `${newCpu.toFixed(1)}%`,
            memory: `${newMemory} MB`,
          }
        }),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const copyToClipboard = (endpoint: string) => {
    navigator.clipboard.writeText(endpoint)
    setCopiedEndpoint(endpoint)
    setTimeout(() => setCopiedEndpoint(null), 2000)
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary mb-2">Container Monitoring</h1>
          <p className="text-muted-foreground leading-relaxed">
            Real-time monitoring of your deployed agent containers
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
          <Card className="p-4 border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Container className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Containers</p>
                <p className="text-2xl font-bold text-primary">{containers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Running</p>
                <p className="text-2xl font-bold text-green-600">
                  {containers.filter((c) => c.status === "running").length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-2 border-primary/20">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-lg">
                <Network className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Network</p>
                <p className="text-2xl font-bold text-accent">agentnet</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {containers.map((container) => (
            <Card key={container.id} className="p-6 border-2 border-primary/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Container className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary">{container.name}</h3>
                    <p className="text-sm text-muted-foreground font-mono">{container.id}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-600/20 font-semibold">
                  {container.status}
                </Badge>
              </div>

              <div className="mb-4 p-4 bg-accent/5 rounded-lg border border-accent/20">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <Globe className="w-4 h-4 text-accent flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground mb-1">Public API Endpoint</p>
                      <p className="font-mono text-sm text-primary truncate">{container.apiEndpoint}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(container.apiEndpoint)}
                    className="flex-shrink-0"
                  >
                    {copiedEndpoint === container.apiEndpoint ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">CPU Usage</p>
                    <p className="font-semibold text-primary">{container.cpu}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Memory</p>
                    <p className="font-semibold text-primary">{container.memory}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Network className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">IP Address</p>
                    <p className="font-semibold text-primary font-mono text-sm">{container.ipAddress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="font-semibold text-primary text-sm">
                      {new Date(container.created).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-primary/10">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Image: </span>
                    <span className="font-mono text-primary">{container.image}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ports: </span>
                    <span className="font-mono text-primary">{container.ports.join(", ")}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
