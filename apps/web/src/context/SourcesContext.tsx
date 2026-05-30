import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSourcesList } from '../data/mockData';
import type { SourceStream } from '../data/mockData';

interface SourcesContextType {
  sources: SourceStream[];
  loadingId: string | null;
  handleToggle: (id: string) => Promise<void>;
}

const SourcesContext = createContext<SourcesContextType | undefined>(undefined);

export function SourcesProvider({ children }: { children: React.ReactNode }) {
  const [sources, setSources] = useState<SourceStream[]>(initialSourcesList);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/sources/status')
      .then(res => res.json())
      .then(data => {
        setSources(prev => prev.map(src => {
          const statusObj = data[src.id];
          if (statusObj) {
            return {
              ...src,
              connected: statusObj.connected && statusObj.enabled,
              email: statusObj.email || src.email,
              // Keep original connected flag just in case
              _coralConnected: statusObj.connected,
              _localEnabled: statusObj.enabled,
              lastSync: statusObj.connected && statusObj.enabled ? 'Just now' : src.lastSync
            };
          }
          return src;
        }))
      })
      .catch(err => console.error("Error fetching source status", err))
  }, []);

  const handleToggle = async (id: string) => {
    if (id === 'gmail' || id === 'calendar') {
      const source = sources.find(s => s.id === id) as any;
      const isCurrentlyActive = source?.connected;
      
      setLoadingId(id)
      try {
        if (isCurrentlyActive) {
          // Disable it
          const res = await fetch('http://localhost:3000/api/sources/disable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceId: id })
          });
          
          if (!res.ok) {
            throw new Error(`Server returned ${res.status}: ${res.statusText}`);
          }
          
          setSources(prev => prev.map(src => 
            src.id === id ? { ...src, connected: false, _localEnabled: false } : src
          ))
        } else {
          // Connect it
          const res = await fetch('http://localhost:3000/api/sources/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sourceId: id })
          });
          
          if (!res.ok) {
             if (res.status === 404) throw new Error("Source not found in Coral.");
             if (res.status === 500) throw new Error("Internal server error connecting to Coral.");
             throw new Error(`Server returned ${res.status}: ${res.statusText}`);
          }

          const data = await res.json();
          if (data.success && data.connected) {
            setSources(prev => prev.map(src => 
              src.id === id ? { 
                ...src, 
                connected: true, 
                _coralConnected: true, 
                _localEnabled: true, 
                lastSync: 'Just now',
                email: data.email || src.email
              } : src
            ))
          } else {
            alert(data.error || "Source not found in Coral. Please configure the CLI.");
          }
        }
      } catch (e: any) {
        console.error(e)
        alert(e.message === 'Failed to fetch' ? 'Network failure: Unable to communicate with NeverLate server (ensure backend is running).' : e.message);
      } finally {
        setLoadingId(null)
      }
    } else {
      // Dummy logic for others
      setLoadingId(id)
      setTimeout(() => {
        alert("This source is not supported in the MVP.");
        setLoadingId(null)
      }, 800)
    }
  }

  return (
    <SourcesContext.Provider value={{ sources, loadingId, handleToggle }}>
      {children}
    </SourcesContext.Provider>
  );
}

export function useSources() {
  const context = useContext(SourcesContext);
  if (context === undefined) {
    throw new Error('useSources must be used within a SourcesProvider');
  }
  return context;
}
