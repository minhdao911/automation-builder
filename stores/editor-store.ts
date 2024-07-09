import { WorkflowNodeData } from "@/lib/types";
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnConnect,
  OnEdgesChange,
  OnNodesChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import { create } from "zustand";

type EditorState = {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNode: Node<WorkflowNodeData> | null;
};

type EditorAction = {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  loadData: () => void;
  selectNode: (nodeId: string) => void;
  deselectNodes: () => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  removeNode: (nodeId: string) => void;
};

export const useEditorStore = create<EditorState & EditorAction>(
  (set, get) => ({
    nodes: [],
    edges: [],
    selectedNode: null,
    onNodesChange: (changes: NodeChange[]) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection: Connection) => {
      set({
        edges: addEdge(connection, get().edges),
      });
    },
    setNodes: (nodes: Node<WorkflowNodeData>[]) => {
      set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    loadData: () => {},
    selectNode: (nodeId) => {
      const nodes = get().nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              selected: true,
            },
          };
        }

        return {
          ...node,
          data: {
            ...node.data,
            selected: false,
          },
        };
      });

      set({ nodes });
      set({ selectedNode: nodes.find((node) => node.id === nodeId) });
    },
    deselectNodes: () => {
      const nodes = get().nodes.map((node) => {
        return {
          ...node,
          data: {
            ...node.data,
            selected: false,
          },
        };
      });

      set({ nodes });
    },
    updateNode: (nodeId, data) => {
      const nodes = get().nodes.map((node) => {
        if (node.id === nodeId) {
          const newNode = {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
          set({ selectedNode: newNode });
          return newNode;
        }
        return node;
      });

      set({
        nodes: applyNodeChanges([], nodes),
      });
    },
    removeNode: (nodeId) => {
      const nodes = get().nodes;
      const nodeIndex = get().nodes.findIndex((node) => node.id === nodeId);
      nodes.splice(nodeIndex, 1);

      const edges = get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      set({
        nodes: applyNodeChanges([], nodes),
      });
      set({ edges });
    },
  })
);
