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
  removeNode: (nodeId: string) => void;
  save: () => void;
};

export const useEditorStore = create<EditorState & EditorAction>(
  (set, get) => ({
    nodes: [],
    edges: [],
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
    removeNode: (nodeId) => {
      const nodes = get().nodes;
      const nodeIndex = get().nodes.findIndex((node) => node.id === nodeId);
      nodes.splice(nodeIndex, 1);

      const edges = get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );

      set({ nodes });
      set({ edges });
    },
    save: () => {
      console.log("nodes", get().nodes);
      console.log("edges", get().edges);
    },
  })
);
