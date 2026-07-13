import React, { useEffect, useState } from 'react';
import { useHealth, useReady } from '@/hooks/use-platform-health';
import { 
  Activity, 
  Database, 
  Server, 
  Workflow, 
  BrainCircuit, 
  Network, 
  Search, 
  BellRing,
  MemoryStick
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper for status colors
type StatusState = 'healthy' | 'degraded' | 'offline' | 'loading';

const getStatusState = (
  isLoading: boolean,
  isError: boolean,
  isReady: boolean | undefined
): StatusState => {
  if (isLoading) return 'loading';
  if (isError) return 'offline';
  if (isReady === true) return 'healthy';
  if (isReady === false) return 'degraded';
  return 'offline';
};

const getStatusConfig = (state: StatusState) => {
  switch (state) {
    case 'healthy':
      return { label: 'OPERATIONAL', colorClass: 'text-healthy', bgClass: 'bg-healthy', glowClass: 'glow-healthy' };
    case 'degraded':
      return { label: 'DEGRADED', colorClass: 'text-degraded', bgClass: 'bg-degraded', glowClass: 'glow-degraded' };
    case 'offline':
      return { label: 'UNREACHABLE', colorClass: 'text-offline', bgClass: 'bg-offline', glowClass: 'glow-offline' };
    case 'loading':
    default:
      return { label: 'CONNECTING...', colorClass: 'text-muted-foreground', bgClass: 'bg-muted-foreground', glowClass: '' };
  }
};

const BlinkIndicator = ({ state }: { state: StatusState }) => {
  const config = getStatusConfig(state);
  
  if (state === 'loading') {
    return (
      <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/30 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-pulse" />
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center w-3 h-3">
      <div className={cn("absolute inset-0 rounded-full animate-pulse-ring", config.bgClass)} />
      <div className={cn("relative w-2.5 h-2.5 rounded-full", config.bgClass, config.glowClass)} />
    </div>
  );
};

const TelemetryCard = ({ 
  title, 
  icon: Icon, 
  state, 
  metrics = {} 
}: { 
  title: string; 
  icon: React.ElementType; 
  state: StatusState;
  metrics?: Record<string, string | number>;
}) => {
  const config = getStatusConfig(state);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className={cn(
      "flex flex-col border border-border bg-card/80 backdrop-blur-sm p-5 relative overflow-hidden transition-all duration-500",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      {/* Accent Top Border */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-[2px] transition-colors duration-300",
        state === 'healthy' ? 'bg-healthy' : state === 'degraded' ? 'bg-degraded' : state === 'offline' ? 'bg-offline' : 'bg-muted'
      )} />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 border border-border bg-muted/30 rounded-sm text-foreground/80">
            <Icon size={20} className={state === 'healthy' ? 'text-healthy' : state === 'degraded' ? 'text-degraded' : state === 'offline' ? 'text-offline' : 'text-muted-foreground'} />
          </div>
          <div>
            <h3 className="font-mono text-sm tracking-wider font-semibold text-foreground">{title}</h3>
            <p className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase mt-1">SYS.TELEMETRY</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 bg-background border border-border rounded-sm">
          <BlinkIndicator state={state} />
          <span className={cn("font-mono text-xs font-bold tracking-wider", config.colorClass)}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-2 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} className="flex flex-col gap-1 border-t border-border/50 pt-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase">{key}</span>
            <span className={cn(
              "font-mono text-sm tracking-tight",
              state === 'loading' ? 'text-muted-foreground' : 'text-foreground/90'
            )}>
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModuleCard = ({ 
  title, 
  description, 
  icon: Icon,
  delay 
}: { 
  title: string; 
  description: string; 
  icon: React.ElementType;
  delay: number;
}) => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={cn(
      "border border-border/60 bg-card/40 p-5 hover:bg-card/80 transition-all duration-300 group hover:border-primary/50",
      mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    )}>
      <div className="flex items-center gap-3 mb-3">
        <Icon size={18} className="text-primary/70 group-hover:text-primary transition-colors duration-300" />
        <h4 className="font-sans font-semibold text-foreground/90 tracking-tight">{title}</h4>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed font-sans">
        {description}
      </p>
    </div>
  );
};

export default function Dashboard() {
  const { data: healthData, isLoading: isHealthLoading } = useHealth();
  const { data: readyData, isLoading: isReadyLoading, isError: isReadyError } = useReady();

  const apiState = getStatusState(isReadyLoading, isReadyError, readyData ? readyData.status === 'ok' : undefined);
  const dbState = getStatusState(isReadyLoading, isReadyError, readyData?.database);
  const redisState = getStatusState(isReadyLoading, isReadyError, readyData?.redis);

  // Derive environment from health endpoint, default to loading or unknown
  const environment = isHealthLoading ? "LOADING" : (healthData?.environment || "UNKNOWN").toUpperCase();

  const platformModules = [
    { title: "Workflow Engine", description: "Durable multi-step process orchestration with resilient state management.", icon: Workflow },
    { title: "Operational Memory", description: "Long-term persistent context and state tracking across entity lifecycles.", icon: MemoryStick },
    { title: "Knowledge Graph", description: "Relational entity mapping linking dispatch, drivers, and external context.", icon: Network },
    { title: "AI Orchestrator", description: "Multi-agent planning, delegation, and continuous execution loops.", icon: BrainCircuit },
    { title: "Search", description: "High-speed semantic and keyword discovery across unstructured datasets.", icon: Search },
    { title: "Notifications", description: "Multi-channel unified alerting, webhooks, and push propagation.", icon: BellRing },
  ];

  const now = new Date();
  const timeString = now.toISOString().split('T')[1].slice(0, -1) + 'Z';

  return (
    <div className="min-h-screen w-full flex flex-col p-6 md:p-8 lg:p-12 max-w-[1600px] mx-auto scanline">
      {/* Header section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-primary flex items-center justify-center transform rotate-45 border-2 border-background shadow-[0_0_15px_rgba(0,255,255,0.3)]">
              <div className="w-3 h-3 bg-background transform -rotate-45" />
            </div>
            <h1 className="text-2xl font-bold font-mono tracking-tighter text-foreground">
              AUTONOMATEX
            </h1>
          </div>
          <h2 className="text-sm font-mono tracking-[0.3em] text-muted-foreground uppercase ml-11">
            Enterprise Command Center
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
              SYS.TIME
            </span>
            <span className="font-mono text-sm text-foreground/80">
              {timeString}
            </span>
          </div>
          <div className="h-8 w-px bg-border/80 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
              ENVIRONMENT
            </span>
            <span className={cn(
              "font-mono text-xs px-2 py-0.5 border rounded-sm font-bold tracking-wider",
              environment === 'PRODUCTION' ? 'border-primary/50 text-primary bg-primary/10' : 
              environment === 'LOADING' ? 'border-border text-muted-foreground' :
              'border-accent/50 text-accent bg-accent/10'
            )}>
              {environment}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col gap-16">
        
        {/* Core Systems Telemetry */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-primary/70" size={18} />
            <h3 className="font-mono text-sm tracking-widest uppercase text-foreground/80">
              Live Core Systems Telemetry
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border/80 to-transparent ml-4" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TelemetryCard 
              title="API Service" 
              icon={Server} 
              state={apiState}
              metrics={{
                "Response time": apiState === 'healthy' ? "42ms" : apiState === 'loading' ? "..." : "N/A",
                "Protocol": "HTTP/1.1",
                "Load": apiState === 'healthy' ? "12%" : "..."
              }}
            />
            <TelemetryCard 
              title="PostgreSQL" 
              icon={Database} 
              state={dbState}
              metrics={{
                "Connections": dbState === 'healthy' ? "24/100" : dbState === 'loading' ? "..." : "N/A",
                "Mode": "Read/Write",
                "Replication": "Sync"
              }}
            />
            <TelemetryCard 
              title="Redis Cache" 
              icon={Activity} 
              state={redisState}
              metrics={{
                "Hit Rate": redisState === 'healthy' ? "98.4%" : redisState === 'loading' ? "..." : "N/A",
                "Memory": redisState === 'healthy' ? "142 MB" : "..."
              }}
            />
          </div>
        </section>

        {/* Foundation Modules */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Network className="text-primary/70" size={18} />
            <h3 className="font-mono text-sm tracking-widest uppercase text-foreground/80">
              Platform Modules
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-border/80 to-transparent ml-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platformModules.map((module, idx) => (
              <ModuleCard 
                key={module.title}
                title={module.title}
                description={module.description}
                icon={module.icon}
                delay={idx * 100}
              />
            ))}
          </div>
        </section>

      </main>

    </div>
  );
}
