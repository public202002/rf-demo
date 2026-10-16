// KROK 3: Dvojice krabiček s kotvami
//
// Co si odnést:
//  - Další uzel je jen další objekt v poli. Komponenta Box se znovu použije.
//  - Zkus tahat myší z pravé kotvy jedné krabičky na levou druhé: ukáže se
//    spojnice, ale po puštění zmizí. Gesto je jen UDÁLOST (onConnect).
//    Hrana vznikne, až ji sám přidáš do stavu (to dělá krok 4).
//  - Do konzole se vypíše objekt Connection: { source, target, sourceHandle, targetHandle }.

import { ReactFlow, Handle, Position, useNodesState } from '@xyflow/react';
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
  { id: 'b', type: 'box', position: { x: 400, y: 100 }, data: { label: 'Krabička B' } }, // NOVÉ
];

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        onConnect={(connection) => console.log(connection)} // NOVÉ: jen výpis
      />
    </div>
  );
}
