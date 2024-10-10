import {
  WorkflowNodeData,
  WorkflowVariable,
  WorkflowVariables,
} from "@/model/types";
import { ConnectorDataType, ConnectorNodeType } from "@prisma/client";
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
  variables: WorkflowVariables;
  triggerNode: Node<WorkflowNodeData> | null;
  selectedNode: Node<WorkflowNodeData> | null;
};

type EditorAction = {
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  setTriggerNode: (node: Node<WorkflowNodeData> | null) => void;
  selectNode: (nodeId: string) => void;
  deselectNodes: () => void;
  updateNode: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  removeNode: (nodeId: string) => void;
  removeEdge: (edgeId: string) => void;
  setVariables: (variables: WorkflowVariables) => void;
  updateVariables: (variables: WorkflowVariable[]) => void;
};

export const useEditorStore = create<EditorState & EditorAction>(
  (set, get) => ({
    nodes: [],
    edges: [],
    variables: {},
    triggerNode: null,
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
      // make sure condition node is only connected to trigger node and logical nodes
      const isTargetConditionNode =
        get().nodes.find((node) => node.id === connection.target)?.data
          .dataType === ConnectorDataType.Condition;
      if (isTargetConditionNode) {
        const sourceNode = get().nodes.find(
          (node) => node.id === connection.source
        );
        if (
          sourceNode?.data.nodeType !== ConnectorNodeType.Trigger &&
          sourceNode?.data.nodeType !== ConnectorNodeType.Logical
        )
          return;
      }

      const edge = { ...connection, type: "customEdge" };
      set({
        edges: addEdge(edge, get().edges),
      });
    },
    setNodes: (nodes: Node<WorkflowNodeData>[]) => {
      set({ nodes });
    },
    setEdges: (edges: Edge[]) => {
      set({ edges });
    },
    setTriggerNode: (node) => {
      set({ triggerNode: node });
    },
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
    removeEdge: (edgeId) => {
      const edges = get().edges.filter((edge) => edge.id !== edgeId);
      set({ edges });
    },
    setVariables: (variables) => {
      set({ variables });
    },
    updateVariables: (variables) => {
      const validVars = variables
        .filter((v) => v.name && v.value)
        .reduce(
          (acc, { name, value, nodeId, ruleId }) => ({
            ...acc,
            [name]: {
              name,
              value,
              nodeId,
              ruleId,
            },
          }),
          {}
        );
      set({ variables: { ...get().variables, ...validVars } });
    },
  })
);
