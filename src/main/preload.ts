import { contextBridge, ipcRenderer } from 'electron';
import { CreatePageParams, UpdatePageParams, ReorderPageParams, Page, Section } from '../shared/types';

const api = {
  kb: {
    getSections: (): Promise<Section[]> => ipcRenderer.invoke('kb:getSections'),
    getAllPages: (): Promise<Page[]> => ipcRenderer.invoke('kb:getAllPages'),
    getPage: (id: string): Promise<Page | null> => ipcRenderer.invoke('kb:getPage', id),
    getChildPages: (parentId: string | null): Promise<Page[]> => ipcRenderer.invoke('kb:getChildPages', parentId),
    createPage: (params: CreatePageParams): Promise<Page> => ipcRenderer.invoke('kb:createPage', params),
    updatePage: (params: UpdatePageParams): Promise<Page | null> => ipcRenderer.invoke('kb:updatePage', params),
    deletePage: (id: string): Promise<boolean> => ipcRenderer.invoke('kb:deletePage', id),
    reorderPage: (params: ReorderPageParams): Promise<Page | null> => ipcRenderer.invoke('kb:reorderPage', params),
  },
};

contextBridge.exposeInMainWorld('api', api);

export type API = typeof api;
