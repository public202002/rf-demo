// Spuštění (Vite):
//   npm create vite@latest rf-demo -- --template react
//   cd rf-demo && npm i @xyflow/react
//   nahraď src/App.jsx tímto souborem (export default Flow)

import { useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  useUpdateNodeInternals,
  addEdge,
  reconnectEdge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const css = `
.tbl { background: #fff; border: 1px solid #333; border-radius: 6px; font-size: 12px; min-width: 190px; }
.tbl-title { background: #eee; padding: 6px 8px; font-weight: 500; border-bottom: 1px solid #333; }
.tbl table { border-collapse: collapse; width: 100%; }
.tbl td { padding: 3px 8px; border-bottom: 1px solid #ddd; }
.tbl input { border: 0; width: 100%; font: inherit; background: transparent; }
.tbl button { width: 100%; border: 0; padding: 4px; cursor: pointer; background: #f7f7f7; }
`;

// Uzel s tabulkou. Handle id se odvozuje z row.id (ne z názvu sloupce),
// takže přejmenování sloupce hrany nerozbije.
function TableNode({ id, data }) {
  const { updateNodeData } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();

  // po změně počtu řádků řekni RF, ať přepočítá polohy handlů
  useEffect(() => {
    updateNodeInternals(id);
  }, [id, data.rows.length, updateNodeInternals]);

  const patchRow = (rowId, patch) =>
    updateNodeData(id, (node) => ({
      rows: node.data.rows.map((r) => (r.id === rowId ? { ...r, ...patch } : r)),
    }));

  const addRow = () =>
    updateNodeData(id, (node) => ({
      rows: [
        ...node.data.rows,
        { id: crypto.randomUUID().slice(0, 8), name: 'new_column', type: 'text' },
      ],
    }));

  return (
    <div className="tbl">
      <div className="tbl-title">{data.title}</div>
      <table>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row.id}>
              <td style={{ position: 'relative' }}>
                <Handle type="target" position={Position.Left} id={`${row.id}-in`} />
                <input
                  className="nodrag"
                  value={row.name}
                  onChange={(e) => patchRow(row.id, { name: e.target.value })}
                />
              </td>
              <td style={{ position: 'relative' }}>
                {row.type}
                <Handle type="source" position={Position.Right} id={`${row.id}-out`} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="nodrag" onClick={addRow}>+ sloupec</button>
    </div>
  );
}

const nodeTypes = { table: TableNode }; // mimo komponentu

const initialNodes = [
  {
    id: 'users',
    type: 'table',
    position: { x: 0, y: 40 },
    data: {
      title: 'users',
      rows: [
        { id: 'u_id', name: 'id', type: 'uuid' },
        { id: 'u_email', name: 'email', type: 'text' },
      ],
    },
  },
  {
    id: 'posts',
    type: 'table',
    position: { x: 340, y: 0 },
    data: {
      title: 'posts',
      rows: [
        { id: 'p_id', name: 'id', type: 'uuid' },
        { id: 'p_user_id', name: 'user_id', type: 'uuid' },
        { id: 'p_title', name: 'title', type: 'text' },
      ],
    },
  },
];

const initialEdges = [
  {
    id: 'e1',
    source: 'users',
    sourceHandle: 'u_id-out',
    target: 'posts',
    targetHandle: 'p_user_id-in',
  },
];

export default function Flow() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (c) => setEdges((eds) => addEdge(c, eds)),
    [setEdges],
  );

  // chytni konec hrany a přetáhni ho na jiný řádek
  const onReconnect = useCallback(
    (oldEdge, c) => setEdges((eds) => reconnectEdge(oldEdge, c, eds)),
    [setEdges],
  );

  // nepovol spojení uzlu se sebou samým
  const isValidConnection = useCallback((c) => c.source !== c.target, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <style>{css}</style>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        isValidConnection={isValidConnection}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
