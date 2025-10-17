import { ipcMain } from 'electron';
import { KnowledgeBaseDB } from './database';
import { CreatePageParams, UpdatePageParams, ReorderPageParams } from '../shared/types';

export function setupIpcHandlers(db: KnowledgeBaseDB): void {
  ipcMain.handle('kb:getSections', () => {
    return db.getSections();
  });

  ipcMain.handle('kb:getAllPages', () => {
    return db.getAllPages();
  });

  ipcMain.handle('kb:getPage', (_event, id: string) => {
    return db.getPage(id);
  });

  ipcMain.handle('kb:getChildPages', (_event, parentId: string | null) => {
    return db.getChildPages(parentId);
  });

  ipcMain.handle('kb:createPage', (_event, params: CreatePageParams) => {
    return db.createPage(params);
  });

  ipcMain.handle('kb:updatePage', (_event, params: UpdatePageParams) => {
    return db.updatePage(params);
  });

  ipcMain.handle('kb:deletePage', (_event, id: string) => {
    return db.deletePage(id);
  });

  ipcMain.handle('kb:reorderPage', (_event, params: ReorderPageParams) => {
    return db.reorderPage(params);
  });
}
