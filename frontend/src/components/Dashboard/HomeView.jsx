import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

function HomeView({ setCurrentView }) {
  const { t } = useTranslation();
  
  const features = [
    { id: 'filaments', icon: '🧵', title: t('filaments.title'), desc: t('filaments.subtitle') },
    { id: 'machines', icon: '🖨️', title: t('machines.title'), desc: t('machines.subtitle') },
    { id: 'projects', icon: '📦', title: t('projects.title'), desc: t('projects.subtitle') },
    { id: 'sales', icon: '💰', title: t('sales.title'), desc: t('sales.subtitle') },
    { id: 'packages', icon: '📦', title: t('packages.title'), desc: t('packages.subtitle') },
    { id: 'platforms', icon: '🛒', title: t('platforms.title'), desc: t('platforms.subtitle') },
    { id: 'expenses', icon: '💸', title: t('expenses.title'), desc: t('expenses.subtitle') },
    { id: 'financial', icon: '📊', title: t('financial.title'), desc: t('financial.subtitle') },
    { id: 'backup', icon: '💾', title: t('backup.title'), desc: t('backup.subtitle') },
    { id: 'status', icon: '🔧', title: 'Status', desc: t('dashboard.statusDesc') }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">{t('dashboard.welcomeTitle')} 🎉</h1>
        <p className="text-muted-foreground mt-2">{t('dashboard.welcomeSubtitle')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(feature => (
          <Card 
            key={feature.id}
            className="cursor-pointer hover:bg-accent hover:shadow-lg transition-all duration-200"
            onClick={() => setCurrentView(feature.id)}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-4xl mb-3">{feature.icon}</div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription className="text-sm mt-2">{feature.desc}</CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                ✓ {t('dashboard.active')}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default HomeView;
