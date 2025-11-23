import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { APP_VERSION } from '../../config/version';

function Sidebar({ currentView, setCurrentView, backendStatus, user, onLogout }) {
  const { t } = useTranslation();
  
  const NavButton = ({ view, icon, label }) => (
    <Button
      variant={currentView === view ? "secondary" : "ghost"}
      className="w-full justify-start gap-3"
      onClick={() => setCurrentView(view)}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Button>
  );
  
  return (
    <aside className="w-64 min-w-64 bg-card border-r flex flex-col h-screen">
      <div className="p-6 border-b space-y-3">
        <h2 className="text-2xl font-bold">💎 Calc 3D</h2>
        <LanguageSelector />
      </div>
      
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          <NavButton view="home" icon="🏠" label={t('dashboard.home')} />
          
          <Button
            variant={currentView === 'status' ? "secondary" : "ghost"}
            className="w-full justify-start gap-3"
            onClick={() => setCurrentView('status')}
          >
            <span className="text-lg">
              {backendStatus === 'online' ? '🟢' : backendStatus === 'offline' ? '🔴' : '🟡'}
            </span>
            <span>{t('dashboard.status')}</span>
          </Button>
          
          <Separator className="my-2" />
          
          <NavButton view="filaments" icon="🧵" label={t('dashboard.filaments')} />
          <NavButton view="machines" icon="🖨️" label={t('dashboard.machines')} />
          <NavButton view="projects" icon="📦" label={t('dashboard.projects')} />
          <NavButton view="sales" icon="💰" label={t('dashboard.sales')} />
          <NavButton view="expenses" icon="💸" label={t('dashboard.expenses')} />
          <NavButton view="packages" icon="📦" label={t('dashboard.packages')} />
          <NavButton view="platforms" icon="🛒" label={t('dashboard.platforms')} />
          
          <Separator className="my-2" />
          
          <NavButton view="financial" icon="📊" label={t('dashboard.financial')} />
          
          <Separator className="my-2" />
          
          <NavButton view="backup" icon="💾" label={t('dashboard.backup')} />
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t space-y-3">
        <a 
          href="https://ko-fi.com/koalitos" 
          target="_blank" 
          rel="noopener noreferrer"
          title={t('support.kofiTitle')}
          className="kofi-support-link"
        >
          <Button variant="outline" className="w-full gap-2 kofi-support-btn">
            <span className="kofi-icon">☕</span>
            <span>{t('support.kofi')}</span>
          </Button>
        </a>
        
        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
          <Avatar className="h-8 w-8">
            <AvatarFallback>👤</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">{user?.username}</span>
        </div>
        
        <Button 
          onClick={onLogout} 
          variant="destructive"
          className="w-full"
        >
          {t('auth.logout')}
        </Button>
        
        <div className="text-center text-xs text-muted-foreground pt-2">
          v{APP_VERSION}
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
