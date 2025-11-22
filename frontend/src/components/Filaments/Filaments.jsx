import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFilaments, saveFilament, updateFilament, deleteFilament } from '../../services/storage';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';

function Filaments() {
  const { t } = useTranslation();
  const [filaments, setFilaments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'PLA',
    weight: 1000,
    cost: 0
  });

  useEffect(() => {
    loadFilaments();
  }, []);

  const loadFilaments = () => {
    setFilaments(getFilaments());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateFilament(editingId, formData);
      setEditingId(null);
    } else {
      saveFilament(formData);
    }
    setFormData({ name: '', type: 'PLA', weight: 1000, cost: 0 });
    setShowForm(false);
    loadFilaments();
  };

  const handleEdit = (filament) => {
    setFormData({
      name: filament.name,
      type: filament.type,
      weight: filament.weight,
      cost: filament.cost
    });
    setEditingId(filament.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm(t('filaments.confirmDelete'))) {
      deleteFilament(id);
      loadFilaments();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">🧵 {t('filaments.title')}</h1>
          <p className="text-muted-foreground">{t('filaments.subtitle')}</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? `✕ ${t('common.cancel')}` : `+ ${t('filaments.new')}`}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? t('filaments.edit') : t('filaments.new')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('filaments.name')}</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: PLA Branco"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">{t('filaments.type')}</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="PLA">PLA</option>
                    <option value="ABS">ABS</option>
                    <option value="PETG">PETG</option>
                    <option value="TPU">TPU</option>
                    <option value="Nylon">Nylon</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">{t('filaments.weight')} (g)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight}
                    onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value)})}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">{t('filaments.cost')} (R$)</Label>
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">{t('common.save')}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filaments.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">{t('filaments.empty')}</p>
              <Button variant="secondary" onClick={() => setShowForm(true)}>
                {t('filaments.addFirst')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filaments.map(filament => (
            <Card key={filament.id} className="hover:bg-accent transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{filament.name}</CardTitle>
                  <Badge variant="secondary">{filament.type}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('filaments.weight')}:</span>
                    <span className="font-medium">{filament.weight}g</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('filaments.cost')}:</span>
                    <span className="font-medium">R$ {filament.cost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('filaments.costPerGram')}:</span>
                    <span className="font-medium">R$ {filament.costPerGram}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(filament)}
                    className="flex-1"
                  >
                    ✏️ {t('common.edit')}
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(filament.id)}
                    className="flex-1"
                  >
                    🗑️ {t('common.delete')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Filaments;
