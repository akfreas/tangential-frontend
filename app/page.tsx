import React, { useEffect, useState } from 'react';
import {
  Badge,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
  Title
} from '@tremor/react';
import ProgramsPage from './programsPage';
export const dynamic = 'force-dynamic';

export default async function ClientProgramsPage({}) {

    return (

      <main className="p-4 md:p-10 mx-auto max-w-screen-2xl">
        <ProgramsPage/>
      </main>
    );
}