// KROK 2: Krabička se dvěma kotvami (vstupní a výstupní)
//
// Co si odnést:
//  - Kotva se jmenuje Handle a je to značka UVNITŘ komponenty uzlu.
//  - Je pozicovaná absolutně vůči nejbližšímu rodiči s position (výchozně
//    vůči celému uzlu). Prop `position` vybere stranu (Left, Right, Top, Bottom).
//  - Jemné doladění polohy je obyčejné CSS: <Handle style={{ top: 10 }} />.
//    Chceš kotvu vůči části uzlu (třeba řádku tabulky)? Dej této části
//    position: 'relative' a Handle vlož dovnitř.
//  - type="target" je vstup (sem hrana vede), type="source" je výstup (odsud vychází).

import { ReactFlow, Handle, Position, useNodesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function Box({ data }) {
  return (
    <div style={{ padding: '10px 16px', border: '1px solid #333', borderRadius: 4, background: '#fff' }}>
      <Handle type="target" position={Position.Left} /> {/* NOVÉ: vstupní kotva */}
      {data.label}
      <Handle type="source" position={Position.Right} /> {/* NOVÉ: výstupní kotva */}
    </div>
  );
}

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
