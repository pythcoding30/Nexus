import React from 'react';
import { AutosaveStatus } from '../../shared/types';

interface PageMetadataProps {
  createdAt?: string;
  updatedAt?: string;
  author?: string;
  autosaveStatus: AutosaveStatus;
}

export const PageMetadata: React.FC<PageMetadataProps> = ({
  createdAt,
  updatedAt,
  author,
  autosaveStatus,
}) => {
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAutosaveText = (): string => {
    switch (autosaveStatus.status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return autosaveStatus.lastSaved 
          ? `Saved at ${new Date(autosaveStatus.lastSaved).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          : 'Saved';
      case 'error':
        return 'Error saving';
      default:
        return '';
    }
  };

  return (
    <div className="content-metadata">
      {author && (
        <div className="content-metadata-item">
          <span>👤</span>
          <span>{author}</span>
        </div>
      )}
      {createdAt && (
        <div className="content-metadata-item">
          <span>📅</span>
          <span>Created: {formatDate(createdAt)}</span>
        </div>
      )}
      {updatedAt && (
        <div className="content-metadata-item">
          <span>🕒</span>
          <span>Modified: {formatDate(updatedAt)}</span>
        </div>
      )}
      {autosaveStatus.status !== 'idle' && (
        <div className={`autosave-status ${autosaveStatus.status}`}>
          <div className="autosave-indicator" />
          <span>{getAutosaveText()}</span>
        </div>
      )}
    </div>
  );
};
