// KROK 1: Jedna krabička (Node)
// Použití: nahraď src/App.jsx tímto souborem.
//
// Co si odnést:
//  - RF potřebuje kontejner s pevnou výškou, jinak neuvidíš nic.
//  - Node je obyčejný objekt { id, position, data }. Jak vypadá, určuje
//    React komponenta (zde Box), uvnitř je běžné HTML.
//  - Seznam uzlů je ve stavu (useNodesState). Bez onNodesChange by se uzel
//    vykreslil, ale nešel by přetáhnout.

import { ReactFlow, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Vzhled uzlu: cokoli, co umíš v HTML (table, input, img ...).
function Box({ data }) {
  return (
    <div style={{ padding: '10px 16px', border: '1px solid #333', borderRadius: 4, background: '#fff' }}>
      {data.label}
    </div>
  );
}

// Registr typů uzlů. MUSÍ být mimo komponentu (stabilní reference).
const nodeTypes = { box: Box };

const initialNodes = [
  { id: 'a', type: 'box', position: { x: 100, y: 100 }, data: { label: 'Krabička A' } },
];

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} nodeTypes={nodeTypes} />
    </div>
  );
}
