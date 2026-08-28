import { useEffect, useState } from 'react';
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCollide,
  forceX,
  forceY,
  SimulationNodeDatum,
} from 'd3-force';
import type { GraphData, GraphNode } from '../api/client';

interface Props {
  data: GraphData;
  width?: number;
  height?: number;
  centerId: string;
  onNodeClick?: (node: GraphNode) => void;
}

type SimNode = GraphNode & SimulationNodeDatum;
type SimLink = { source: SimNode; target: SimNode; type: string };

const HOP_FILL: Record<number, string> = {
  0: '#d9a94a',
  1: '#e7cf98',
  2: '#6fa8a0',
};

const TYPE_RADIUS: Record<string, number> = { person: 15, skill: 10, project: 10 };

const LINK_STYLE: Record<string, { stroke: string; dash?: string }> = {
  HAS_SKILL: { stroke: 'rgba(217,169,74,0.55)' },
  WORKED_ON: { stroke: 'rgba(111,168,160,0.55)' },
  REQUIRES_SKILL: { stroke: 'rgba(201,123,123,0.55)', dash: '4 3' },
  REPORTS_TO: { stroke: 'rgba(169,166,196,0.55)', dash: '2 3' },
};

export function NetworkGraph({ data, width = 620, height = 380, centerId, onNodeClick }: Props) {
  const [nodes, setNodes] = useState<SimNode[]>([]);
  const [links, setLinks] = useState<SimLink[]>([]);

  useEffect(() => {
    if (!data.nodes.length) {
      setNodes([]);
      setLinks([]);
      return;
    }
    const simNodes: SimNode[] = data.nodes.map((n) => ({ ...n }));
    const center = simNodes.find((n) => n.id === centerId);
    if (center) {
      center.fx = width / 2;
      center.fy = height / 2;
    }
    const byId = new Map(simNodes.map((n) => [n.id, n]));
    const simLinks: SimLink[] = data.links
      .filter((l) => byId.has(l.source as unknown as string) && byId.has(l.target as unknown as string))
      .map((l) => ({
        type: l.type,
        source: byId.get(l.source as unknown as string)!,
        target: byId.get(l.target as unknown as string)!,
      }));

    const sim = forceSimulation(simNodes)
      .force(
        'link',
        forceLink(simLinks as any)
          .id((d: any) => d.id)
          .distance((l: any) => (l.type === 'HAS_SKILL' ? 75 : 95))
          .strength(0.55),
      )
      .force('charge', forceManyBody().strength(-200))
      .force('collide', forceCollide().radius((d: any) => (TYPE_RADIUS[d.type] ?? 10) + 20))
      .force('x', forceX(width / 2).strength(0.06))
      .force('y', forceY(height / 2).strength(0.06))
      .stop();

    for (let i = 0; i < 320; i += 1) sim.tick();

    // The centering force is deliberately weak (so the graph doesn't look
    // rigidly gridded), which means a node with few competing forces can
    // still drift past the drawn area on a busy graph -- clamp positions
    // to the container afterwards so nodes/labels never bleed into the
    // caption text below the SVG.
    for (const n of simNodes) {
      const r = (TYPE_RADIUS[n.type] ?? 10) + 12;
      n.x = Math.max(r, Math.min(width - r, n.x ?? width / 2));
      n.y = Math.max(r, Math.min(height - r - 16, n.y ?? height / 2));
    }

    setNodes([...simNodes]);
    setLinks(simLinks);
  }, [data, width, height, centerId]);

  if (!data.nodes.length) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label="Network graph of connections"
      style={{ overflow: 'visible' }}
    >
      {links.map((l, i) => {
        const style = LINK_STYLE[l.type] ?? { stroke: 'rgba(237,231,218,0.3)' };
        const x1 = l.source.x ?? 0, y1 = l.source.y ?? 0, x2 = l.target.x ?? 0, y2 = l.target.y ?? 0;
        const len = Math.hypot(x2 - x1, y2 - y1);
        return (
          <line
            key={i}
            className={style.dash ? 'glink-fade' : 'glink-draw'}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={style.stroke}
            strokeWidth={1.4}
            strokeDasharray={style.dash ?? len}
            style={{ ['--len' as any]: len, animationDelay: `${0.1 + i * 0.02}s` }}
          />
        );
      })}
      {nodes.map((n, i) => {
        const r = TYPE_RADIUS[n.type] ?? 10;
        const fill = n.id === centerId ? '#d9a94a' : HOP_FILL[n.hop] ?? '#6fa8a0';
        const delay = (n.hop ?? 0) * 0.12 + i * 0.015;
        return (
          <g
            key={n.id}
            transform={`translate(${n.x},${n.y})`}
            style={{ cursor: onNodeClick ? 'pointer' : 'default' }}
            tabIndex={onNodeClick ? 0 : -1}
            role={onNodeClick ? 'button' : undefined}
            aria-label={n.name}
            onClick={() => onNodeClick?.(n)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onNodeClick?.(n);
            }}
          >
            <circle
              className="gnode-shape"
              r={r}
              fill={n.type === 'skill' ? 'transparent' : fill}
              stroke={fill}
              strokeWidth={n.type === 'skill' ? 1.6 : 0}
              style={{ animationDelay: `${delay}s` }}
            />
            {n.type === 'skill' && (
              <rect
                className="gnode-shape"
                x={-r * 0.65}
                y={-r * 0.65}
                width={r * 1.3}
                height={r * 1.3}
                fill={fill}
                opacity={0.9}
                transform="rotate(45)"
                style={{ animationDelay: `${delay}s` }}
              />
            )}
            <text
              className="gnode-label"
              y={r + 13}
              textAnchor="middle"
              fontFamily="var(--font-body)"
              fontSize={n.id === centerId ? 12 : 10.5}
              fontWeight={n.id === centerId ? 600 : 400}
              fill="var(--parchment)"
              style={{ animationDelay: `${delay + 0.15}s` }}
            >
              {n.name.length > 16 ? `${n.name.slice(0, 15)}…` : n.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
