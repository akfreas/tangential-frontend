'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Title } from '@tremor/react';
import {
  TextReport,
  deleteTextReportById,
  jsonLog,
} from '@akfreas/tangential-core';
import { DateTime } from 'luxon';
import { nextApiFetch } from '../../utils/frontendRequest';
import { useSession } from 'next-auth/react';
import {
  DocumentDuplicateIcon,
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

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
  const [showCopiedMessage, setShowCopiedMessage] = useState(false); // New state variable

  const handleShare = () => {
    navigator.clipboard
      .writeText(editedText)
      .then(() => {
        console.log('Text successfully copied to clipboard');
        setShowCopiedMessage(true); // Set the copied message to show
        setTimeout(() => setShowCopiedMessage(false), 3000); // Hide the message after 3 seconds
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
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
    });
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
    });
    // Handle the save operation here
  };

  const handleDiscard = () => {
    setEditedText(report.text);
    setIsEditing(false);
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

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
  jsonLog('generatedDate', report.generatedDate);
  return (
    <Card key={report.id} className='p-4'>
      <div onClick={toggleExpand}>
        <Title>{report.name}</Title>
        <p>
          Generated on:{' '}
          {DateTime.fromJSDate(report.generatedDate).toFormat(
            'yyyy.MM.dd hh:mm a',
          )}
        </p>

        {expanded && !isDeleting && !isEditing && (
          <p>
            {editedText.split('\n').map((line, index, array) => (
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
              className='w-full border-gray-300 rounded-md shadow-sm'
            />
            <div className='flex justify-end space-x-2 mt-2'>
              <Button
                onClick={handleSave}
                className='bg-blue-500 text-white px-4 py-2 rounded-md'
              >
                Save
              </Button>
              <Button
                onClick={handleDiscard}
                className='bg-red-500 text-white px-4 py-2 rounded-md'
              >
                Discard
              </Button>
            </div>
          </div>
        )}
      </div>
      {!isEditing && (
        <div id='buttonPanel' className='flex justify-end space-x-2 mt-2'>
          {isDeleting ? (
            <>
              <Button
                onClick={handleConfirmDelete}
                className='bg-red-500 text-white px-4 py-2 rounded-md'
              >
                Confirm Delete
              </Button>
              <Button
                onClick={handleCancelDelete}
                className='bg-gray-500 text-white px-4 py-2 rounded-md'
              >
                Cancel
              </Button>
            </>
          ) : (
            <>
              {showCopiedMessage && <p>Copied to Clipboard</p>}
              <button onClick={handleEdit} className='p-2'>
                <PencilSquareIcon className='h-6 w-6' />
              </button>
              <button onClick={handleShare} className='p-2'>
                <DocumentDuplicateIcon className='h-6 w-6' />
              </button>
              <button onClick={handleDelete} className='p-2'>
                <TrashIcon className='h-6 w-6' />
              </button>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
