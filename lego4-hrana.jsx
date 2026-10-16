// KROK 4: Dvojice krabiček a přímá hrana (edge)
//
// Co si odnést:
//  - Hrana je objekt { id, source, target } v druhém poli (edges), stejně
//    jako uzel je objekt v poli nodes. `source` a `target` jsou id uzlů.
//  - `type: 'straight'` je vestavěný tvar (přímka).
//  - Uživatelské spojení (tažení myší) řeší onConnect: z Connection uděláš
//    hranu pomocí addEdge a vložíš ji do stavu. Tady je celé "kouzlo" RF:
//    změníš data a vykreslení se postará samo.
//  - onEdgesChange umožní hrany vybírat a mazat (klik + Backspace).

import { useCallback } from 'react';
import { ReactFlow, Handle, Position, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
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

const nodeTypes = { box: Box };

const initialNodes = [
  { id: 'a', type: 'box', position: { x: 100, y: 100 }, data: { label: 'Krabička A' } },
  { id: 'b', type: 'box', position: { x: 400, y: 100 }, data: { label: 'Krabička B' } },
];

// NOVÉ: počáteční hrana
const initialEdges = [{ id: 'a-b', source: 'a', target: 'b', type: 'straight' }];

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges); // NOVÉ

  // NOVÉ: z tažení myší udělej hranu
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, type: 'straight' }, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      />
    </div>
  );
}
