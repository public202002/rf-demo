// KROK 6: Obecná hrana: vestavěný tvar nebo vlastní SVG path
//
// Co si odnést:
//  - Tvar hrany určuje pole `type`:
//      'default' (Bézier), 'straight', 'step', 'smoothstep', 'simplebezier'
//    nebo název z tvého registru edgeTypes (zde 'schody').
//  - Vlastní hrana je React komponenta, která dostane souřadnice konců
//    (sourceX, sourceY, targetX, targetY) a vrátí SVG path (řetězec `d`).
//    BaseEdge ji nakreslí a postará se o klikací oblast a značky na koncích.
//  - Hotové generátory cesty: getBezierPath, getSmoothStepPath, getStraightPath.
//    Vrací [path, labelX, labelY], takže si z nich můžeš vzít jen path nebo
//    i polohu středu pro vlastní popisek.
//  - Rozbalovací seznam vlevo nahoře přepíná typ všech hran za běhu.
//    Zase jen změna dat, žádné sahání na DOM.

import { useCallback, useState } from 'react';
import {
  ReactFlow, Handle, Position, MarkerType, BaseEdge, Panel,
  useNodesState, useEdgesState, addEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Box({ data }) {
  return (
    <div style={{ padding: '10px 16px', border: '1px solid #333', borderRadius: 4, background: '#fff' }}>
      <Handle type="target" position={Position.Left} />
      {data.label}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

// NOVÉ: vlastní hrana, cesta složená ručně ze čtyř úseček ("schody")
function SchodyEdge({ id, sourceX, sourceY, targetX, targetY, markerEnd }) {
  const mx = (sourceX + targetX) / 2;
  const path = `M ${sourceX} ${sourceY} L ${mx} ${sourceY} L ${mx} ${targetY} L ${targetX} ${targetY}`;
  return <BaseEdge id={id} path={path} markerEnd={markerEnd} />;
}

const nodeTypes = { box: Box };
const edgeTypes = { schody: SchodyEdge }; // mimo komponentu

const TYPES = ['default', 'straight', 'step', 'smoothstep', 'simplebezier', 'schody'];

const initialNodes = [
  { id: 'a', type: 'box', position: { x: 100, y: 100 }, data: { label: 'Krabička A' } },
  { id: 'b', type: 'box', position: { x: 400, y: 220 }, data: { label: 'Krabička B' } },
];

const initialEdges = [
  { id: 'a-b', source: 'a', target: 'b', type: 'default', markerEnd: { type: MarkerType.ArrowClosed } },
];

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [type, setType] = useState('default'); // NOVÉ

  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) => addEdge({ ...connection, type, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges, type],
  );

  // NOVÉ: změň typ všech hran
  const changeType = (t) => {
    setType(t);
    setEdges((eds) => eds.map((e) => ({ ...e, type: t })));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Panel position="top-left">
          <select value={type} onChange={(e) => changeType(e.target.value)}>
            {TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </Panel>
      </ReactFlow>
    </div>
  );
}
