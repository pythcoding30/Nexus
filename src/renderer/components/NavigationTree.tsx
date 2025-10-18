import React, { useState } from 'react';
import { TreeNode } from '../../shared/types';

interface NavigationTreeProps {
  tree: TreeNode[];
  selectedPageId: string | null;
  onSelectPage: (pageId: string) => void;
  onCreatePage: (parentId: string | null) => void;
  onRenamePage: (pageId: string) => void;
  onDeletePage: (pageId: string) => void;
}

export const NavigationTree: React.FC<NavigationTreeProps> = ({
  tree,
  selectedPageId,
  onSelectPage,
  onCreatePage,
  onRenamePage,
  onDeletePage,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  const toggleNode = (nodeId: string): void => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number = 0): React.ReactNode => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children.length > 0;
    const isSelected = node.id === selectedPageId;

    if (node.isSection) {
      return (
        <div key={node.id} className="tree-node">
          <div className="tree-node-header section">
            <span className="tree-node-title">{node.title}</span>
          </div>
          <div className="tree-node-children">
            {node.children.map((child) => renderNode(child, depth + 1))}
            <button
              className="tree-add-button"
              onClick={() => onCreatePage(node.id)}
            >
              <span className="tree-add-button-icon">+</span>
              <span>Add page</span>
            </button>
          </div>
        </div>
      );
    }

    return (
      <div key={node.id} className="tree-node">
        <div
          className={`tree-node-header ${isSelected ? 'selected' : ''}`}
          onClick={() => onSelectPage(node.id)}
        >
          {hasChildren ? (
            <span
              className="tree-node-toggle"
              onClick={(e) => {
                e.stopPropagation();
                toggleNode(node.id);
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          ) : (
            <span className="tree-node-toggle empty" />
          )}
          <span className="tree-node-icon">📄</span>
          <span className="tree-node-title">{node.title}</span>
          <div className="tree-node-actions">
            <button
              className="tree-node-action"
              onClick={(e) => {
                e.stopPropagation();
                onCreatePage(node.id);
              }}
              title="Add sub-page"
            >
              +
            </button>
            <button
              className="tree-node-action"
              onClick={(e) => {
                e.stopPropagation();
                onRenamePage(node.id);
              }}
              title="Rename"
            >
              ✏️
            </button>
            <button
              className="tree-node-action"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePage(node.id);
              }}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>
        {isExpanded && hasChildren && (
          <div className="tree-node-children">
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="navigation-tree">
      {tree.map((node) => renderNode(node, 0))}
    </div>
  );
};
