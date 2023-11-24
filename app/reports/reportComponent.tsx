'use client'
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Title } from "@tremor/react";
import { TextReport, deleteTextReportById } from "@akfreas/tangential-core";
import { DeleteIcon, EditIcon, ShareIcon } from '../../utils/icons';
import { DateTime } from 'luxon';  
import { nextApiFetch } from '../../utils/frontendRequest';
import { useSession } from 'next-auth/react';

export default function ReportComponent(report: TextReport) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedText, setEditedText] = useState(report.text);
  const [expanded, setExpanded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const auth = useSession();
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleShare = () => {
    // Handle share click
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const handleConfirmDelete = () => {
    // Your delete logic here
    if (report.id === undefined) {
      setIsDeleting(false);
      return;
    }

    nextApiFetch(auth, `/report/delete/${report.id}`).then(() => {
      setIsDeleted(true);
    })
  };

  const handleCancelDelete = () => {
    setIsDeleting(false);
  };

  const handleSave = () => {
    nextApiFetch(auth, `/report/edit/${report.id}`, 'post', {
      id: report.id,
      text: editedText,
      name: report.name,
      description: report.description,
    }).then(() => {
      setIsEditing(false);
    })
    // Handle the save operation here
  };

  const handleDiscard = () => {
    setEditedText(report.text);
    setIsEditing(false);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  }

  // Auto-resize text area
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'inherit';
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [editedText]);

  if (isDeleted) {
    return null;
  }

  return (
    <Card onClick={toggleExpand} key={report.id} className="p-4">
      <Title>{report.name}</Title>
      <p>Generated on: {DateTime.fromISO(report.generatedOn).toFormat('yyyy.MM.dd hh:mm a')}</p>
      
      {expanded && !isDeleting && !isEditing && (
        <p>
          {editedText.split("\n").map((line, index, array) => (
            <React.Fragment key={index}>
              {line}
              {index !== array.length - 1 && <br />}
            </React.Fragment>
          ))}
        </p>
      )}

      {isEditing && (
        <div>
          <textarea 
            ref={textAreaRef}
            value={editedText} 
            onChange={(e) => setEditedText(e.target.value)} 
            className="w-full border-gray-300 rounded-md shadow-sm" 
          />
          <div className="flex justify-end space-x-2 mt-2">
            <Button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded-md">Save</Button>
            <Button onClick={handleDiscard} className="bg-red-500 text-white px-4 py-2 rounded-md">Discard</Button>
          </div>
        </div>
      )}

      {!isEditing && (
        <div id="buttonPanel" className="flex justify-end space-x-2 mt-2">
          {isDeleting ? (
            <>
              <Button onClick={handleConfirmDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Confirm Delete</Button>
              <Button onClick={handleCancelDelete} className="bg-gray-500 text-white px-4 py-2 rounded-md">Cancel</Button>
            </>
          ) : (
            <>
              <button onClick={handleEdit} className="p-2"><EditIcon /></button>
              <button onClick={handleShare} className="p-2"><ShareIcon /></button>
              <button onClick={handleDelete} className="p-2"><DeleteIcon /></button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
