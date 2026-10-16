// KROK 5: Hrana s grafikou na koncích a popiskem
//
// Co si odnést:
//  - Značky na koncích: `markerEnd` / `markerStart`.
//    a) vestavěné: { type: MarkerType.Arrow } nebo { type: MarkerType.ArrowClosed }
//    b) vlastní: string s id SVG elementu <marker>, který si definuješ sám.
//       RF ho jen odkáže přes url(#id). Zde kolečko na začátku hrany.
//  - Popisek: stačí `label` na hraně (u vestavěných typů). Pro popisek jako
//    plnohodnotné HTML existuje EdgeLabelRenderer (viz dokumentace).
//  - Vzhled čáry: `style` na hraně (barva, tloušťka, čárkování).
//  - Ozdoby jsou jen data hrany, proto je jedním objektem `decor` předáváme
//    i hranám vzniklým myší.

import { useCallback } from 'react';
import {
  ReactFlow, Handle, Position, MarkerType,
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

const nodeTypes = { box: Box };

// NOVÉ: vlastní SVG značka (kolečko). Definice musí být kdekoli v DOM.
function MarkerDefs() {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <marker
          id="kolecko"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          markerUnits="userSpaceOnUse"
        >
          <circle cx="5" cy="5" r="4" fill="#333" />
        </marker>
      </defs>
    </svg>
  );
}

// NOVÉ: společný vzhled hran
const decor = {
  type: 'straight',
  markerStart: 'kolecko',                      // vlastní značka (id z <marker>)
  markerEnd: { type: MarkerType.ArrowClosed }, // vestavěná šipka
  style: { stroke: '#333', strokeWidth: 1.5 },
};

const initialNodes = [
  { id: 'a', type: 'box', position: { x: 100, y: 100 }, data: { label: 'Krabička A' } },
  { id: 'b', type: 'box', position: { x: 400, y: 100 }, data: { label: 'Krabička B' } },
];

const initialEdges = [{ id: 'a-b', source: 'a', target: 'b', label: 'posílá', ...decor }]; // NOVÉ

export default function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge({ ...connection, ...decor }, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <MarkerDefs />
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
