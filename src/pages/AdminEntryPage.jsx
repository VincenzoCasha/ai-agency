import React from 'react';
import { PageScaffold } from '../components/PageScaffold';

export default function AdminEntryPage() {
  return (
    <PageScaffold
      eyebrow="Acceso restringido"
      title="Panel CRUDO."
      intro="El panel admin movil llegara en una fase posterior. El backend ya expone los endpoints protegidos por JWT bajo `/api/v1/admin/**`."
    />
  );
}
