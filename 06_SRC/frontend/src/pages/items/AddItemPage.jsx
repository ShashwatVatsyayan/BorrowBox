import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { ItemForm } from '../../components/items/ItemForm';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { itemService } from '../../services/itemService';

export const AddItemPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const created = await itemService.createItem(formData);
      navigate(`/app/items/${created.id}`);
    } catch (err) {
      setError(err.message || 'Failed to publish listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">List an Item for Lending</h1>
        <p className="text-xs text-ink-muted mt-0.5">
          Share calculators, textbooks, lab equipment, or tools with students on campus
        </p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <ItemForm onSubmit={handleSubmit} loading={loading} submitLabel="Publish Listing" />
    </PageContainer>
  );
};

