import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Page, Section, TreeNode, AutosaveStatus } from '../../shared/types';
import { NavigationTree } from './NavigationTree';
import { RichTextEditor } from './RichTextEditor';
import { PageMetadata } from './PageMetadata';
import { Modal } from './Modal';

export const KnowledgeBase: React.FC = () => {
  const [sections, setSections] = useState<Section[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [autosaveStatus, setAutosaveStatus] = useState<AutosaveStatus>({ status: 'idle' });
  
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    type: 'create' | 'rename' | 'delete' | null;
    targetId: string | null;
    parentId: string | null;
  }>({
    isOpen: false,
    type: null,
    targetId: null,
    parentId: null,
  });

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingChangesRef = useRef<{ title?: string; content?: string } | null>(null);

  const buildChildren = useCallback((node: TreeNode, pageMap: Map<string, TreeNode>): void => {
    const children = Array.from(pageMap.values())
      .filter((n) => n.parentId === node.id)
      .sort((a, b) => a.order - b.order);

    children.forEach((child) => {
      buildChildren(child, pageMap);
      node.children.push(child);
    });
  }, []);

  const buildTree = useCallback((): void => {
    const tree: TreeNode[] = [];
    const pageMap = new Map<string, TreeNode>();

    pages.forEach((page) => {
      pageMap.set(page.id, {
        id: page.id,
        title: page.title,
        parentId: page.parentId,
        order: page.order,
        children: [],
        isSection: false,
      });
    });

    sections.forEach((section) => {
      const sectionNode: TreeNode = {
        id: section.id,
        title: section.title,
        parentId: null,
        order: section.order,
        children: [],
        isSection: true,
      };

      const sectionPages = Array.from(pageMap.values())
        .filter((node) => node.parentId === section.id)
        .sort((a, b) => a.order - b.order);

      sectionPages.forEach((pageNode) => {
        buildChildren(pageNode, pageMap);
        sectionNode.children.push(pageNode);
      });

      tree.push(sectionNode);
    });

    tree.sort((a, b) => a.order - b.order);
    setTreeData(tree);
  }, [sections, pages, buildChildren]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildTree();
  }, [buildTree]);

  useEffect(() => {
    if (selectedPageId) {
      loadPage(selectedPageId);
    } else {
      setCurrentPage(null);
    }
  }, [selectedPageId]);

  const loadData = async (): Promise<void> => {
    const [sectionsData, pagesData] = await Promise.all([
      window.api.kb.getSections(),
      window.api.kb.getAllPages(),
    ]);
    setSections(sectionsData);
    setPages(pagesData);
  };

  const loadPage = async (pageId: string): Promise<void> => {
    const page = await window.api.kb.getPage(pageId);
    setCurrentPage(page);
  };

  const handleCreatePage = (parentId: string | null): void => {
    setModalState({
      isOpen: true,
      type: 'create',
      targetId: null,
      parentId,
    });
  };

  const handleRenamePage = (pageId: string): void => {
    setModalState({
      isOpen: true,
      type: 'rename',
      targetId: pageId,
      parentId: null,
    });
  };

  const handleDeletePage = (pageId: string): void => {
    setModalState({
      isOpen: true,
      type: 'delete',
      targetId: pageId,
      parentId: null,
    });
  };

  const handleModalConfirm = async (value: string): Promise<void> => {
    if (modalState.type === 'create') {
      const newPage = await window.api.kb.createPage({
        title: value,
        parentId: modalState.parentId,
        content: '',
      });
      setPages((prev) => [...prev, newPage]);
      setSelectedPageId(newPage.id);
    } else if (modalState.type === 'rename' && modalState.targetId) {
      const updated = await window.api.kb.updatePage({
        id: modalState.targetId,
        title: value,
      });
      if (updated) {
        setPages((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        if (currentPage?.id === updated.id) {
          setCurrentPage(updated);
        }
      }
    } else if (modalState.type === 'delete' && modalState.targetId) {
      const success = await window.api.kb.deletePage(modalState.targetId);
      if (success) {
        setPages((prev) => prev.filter((p) => p.id !== modalState.targetId));
        if (selectedPageId === modalState.targetId) {
          setSelectedPageId(null);
        }
      }
    }

    setModalState({ isOpen: false, type: null, targetId: null, parentId: null });
  };

  const handleModalClose = (): void => {
    setModalState({ isOpen: false, type: null, targetId: null, parentId: null });
  };

  const scheduleAutosave = useCallback(() => {
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    setAutosaveStatus({ status: 'saving' });

    autosaveTimerRef.current = setTimeout(async () => {
      if (!currentPage || !pendingChangesRef.current) return;

      try {
        const updated = await window.api.kb.updatePage({
          id: currentPage.id,
          ...pendingChangesRef.current,
        });

        if (updated) {
          setPages((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          setCurrentPage(updated);
          setAutosaveStatus({
            status: 'saved',
            lastSaved: updated.updatedAt,
          });
          pendingChangesRef.current = null;

          setTimeout(() => {
            setAutosaveStatus({ status: 'idle' });
          }, 2000);
        }
      } catch (error) {
        setAutosaveStatus({
          status: 'error',
          error: 'Failed to save',
        });
      }
    }, 1000);
  }, [currentPage]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (!currentPage) return;

    const newTitle = e.target.value;
    setCurrentPage({ ...currentPage, title: newTitle });
    pendingChangesRef.current = {
      ...pendingChangesRef.current,
      title: newTitle,
    };
    scheduleAutosave();
  };

  const handleContentChange = (content: string): void => {
    if (!currentPage) return;

    setCurrentPage({ ...currentPage, content });
    pendingChangesRef.current = {
      ...pendingChangesRef.current,
      content,
    };
    scheduleAutosave();
  };

  const getModalConfig = () => {
    if (modalState.type === 'create') {
      return {
        title: 'Create New Page',
        initialValue: 'New Page',
        confirmText: 'Create',
        isDanger: false,
      };
    } else if (modalState.type === 'rename') {
      const page = pages.find((p) => p.id === modalState.targetId);
      return {
        title: 'Rename Page',
        initialValue: page?.title || '',
        confirmText: 'Rename',
        isDanger: false,
      };
    } else if (modalState.type === 'delete') {
      const page = pages.find((p) => p.id === modalState.targetId);
      return {
        title: `Delete "${page?.title}"?`,
        initialValue: page?.title || '',
        confirmText: 'Delete',
        isDanger: true,
      };
    }
    return null;
  };

  const modalConfig = getModalConfig();

  return (
    <div className="app">
      <div className="navigation-panel">
        <div className="navigation-header">
          <h1>Knowledge Base</h1>
        </div>
        <NavigationTree
          tree={treeData}
          selectedPageId={selectedPageId}
          onSelectPage={setSelectedPageId}
          onCreatePage={handleCreatePage}
          onRenamePage={handleRenamePage}
          onDeletePage={handleDeletePage}
        />
      </div>
      <div className="content-panel">
        {currentPage ? (
          <>
            <div className="content-header">
              <input
                type="text"
                className="content-title-input"
                value={currentPage.title}
                onChange={handleTitleChange}
                placeholder="Untitled Page"
              />
              <PageMetadata
                createdAt={currentPage.createdAt}
                updatedAt={currentPage.updatedAt}
                author={currentPage.author}
                autosaveStatus={autosaveStatus}
              />
            </div>
            <div className="editor-container">
              <RichTextEditor
                content={currentPage.content}
                onChange={handleContentChange}
                placeholder="Start writing your content here..."
              />
            </div>
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">📚</div>
            <div className="empty-state-title">No Page Selected</div>
            <div className="empty-state-description">
              Select a page from the navigation panel or create a new one to get started.
            </div>
          </div>
        )}
      </div>
      {modalConfig && (
        <Modal
          isOpen={modalState.isOpen}
          title={modalConfig.title}
          initialValue={modalConfig.initialValue}
          confirmText={modalConfig.confirmText}
          isDanger={modalConfig.isDanger}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  );
};
