import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageContainer } from '../../components/layout/PageContainer';
import { ItemForm } from '../../components/items/ItemForm';
import { Loader } from '../../components/common/Loader';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import { itemService } from '../../services/itemService';
import { useAuth } from '../../hooks/useAuth';

export const EditItemPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await itemService.getItemById(id);
        if (data.owner_id !== user?.id) {
          setError('You can only edit your own listings.');
        } else {
          setItem(data);
        }
      } catch (err) {
        setError(err.message || 'Item could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, user]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await itemService.updateItem(id, formData);
      navigate(`/app/items/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <Loader label="Loading listing..." />
      </PageContainer>
    );
  }

  return (
    <PageContainer maxWidth="max-w-2xl">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-extrabold text-ink-primary tracking-tight">Edit Listing</h1>
        <p className="text-xs text-ink-muted mt-0.5">Update details for "{item?.title}"</p>
      </div>

      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {item && (
        <ItemForm
          initialValues={item}
          onSubmit={handleSubmit}
          loading={submitting}
          submitLabel="Save Changes"
        />
      )}
    </PageContainer>
  );
};

