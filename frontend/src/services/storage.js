// Serviço de armazenamento local (simula banco de dados)
import { APP_VERSION } from '../config/version';

const STORAGE_KEYS = {
  FILAMENTS: 'calc3d_filaments',
  MACHINES: 'calc3d_machines',
  PROJECTS: 'calc3d_projects',
  SALES: 'calc3d_sales',
  EXPENSES: 'calc3d_expenses',
  PACKAGES: 'calc3d_packages',
  PLATFORMS: 'calc3d_platforms'
};

// Filamentos
export const getFilaments = () => {
  const data = localStorage.getItem(STORAGE_KEYS.FILAMENTS);
  return data ? JSON.parse(data) : [];
};

export const saveFilament = (filament) => {
  const filaments = getFilaments();
  const newFilament = {
    ...filament,
    id: Date.now(),
    costPerGram: (filament.cost / filament.weight).toFixed(4),
    createdAt: new Date().toISOString()
  };
  filaments.push(newFilament);
  localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
  return newFilament;
};

export const updateFilament = (id, filament) => {
  const filaments = getFilaments();
  const index = filaments.findIndex(f => f.id === id);
  if (index !== -1) {
    filaments[index] = {
      ...filaments[index],
      ...filament,
      costPerGram: (filament.cost / filament.weight).toFixed(4),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
    return filaments[index];
  }
  return null;
};

export const deleteFilament = (id) => {
  const filaments = getFilaments();
  const filtered = filaments.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filtered));
};

// Máquinas
export const getMachines = () => {
  const data = localStorage.getItem(STORAGE_KEYS.MACHINES);
  return data ? JSON.parse(data) : [];
};

export const saveMachine = (machine) => {
  const machines = getMachines();
  const newMachine = {
    ...machine,
    id: Date.now(),
    energyCostPerHour: ((machine.power / 1000) * machine.costPerKwh).toFixed(2),
    depreciationPerHour: (machine.machineCost / machine.lifespan).toFixed(2),
    createdAt: new Date().toISOString()
  };
  machines.push(newMachine);
  localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
  return newMachine;
};

export const updateMachine = (id, machine) => {
  const machines = getMachines();
  const index = machines.findIndex(m => m.id === id);
  if (index !== -1) {
    machines[index] = {
      ...machines[index],
      ...machine,
      energyCostPerHour: ((machine.power / 1000) * machine.costPerKwh).toFixed(2),
      depreciationPerHour: (machine.machineCost / machine.lifespan).toFixed(2),
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(machines));
    return machines[index];
  }
  return null;
};

export const deleteMachine = (id) => {
  const machines = getMachines();
  const filtered = machines.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(filtered));
};

// Projetos
export const getProjects = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
  return data ? JSON.parse(data) : [];
};

export const saveProject = (project) => {
  const projects = getProjects();
  const filament = getFilaments().find(f => f.id === parseInt(project.filamentId));
  const machine = getMachines().find(m => m.id === parseInt(project.machineId));
  
  if (!filament || !machine) {
    throw new Error('Filamento ou máquina não encontrados');
  }

  // Buscar embalagem e plataforma se selecionadas
  const pkg = project.packageId ? getPackages().find(p => p.id === parseInt(project.packageId)) : null;
  const platform = project.platformId ? getPlatforms().find(p => p.id === parseInt(project.platformId)) : null;

  // Calcular custos
  const filamentCost = (project.weight * parseFloat(filament.costPerGram)).toFixed(2);
  const energyCost = (project.printTime * parseFloat(machine.energyCostPerHour)).toFixed(2);
  const depreciationCost = (project.printTime * parseFloat(machine.depreciationPerHour)).toFixed(2);
  const packageCost = pkg ? parseFloat(pkg.cost) : 0;
  const totalCost = (parseFloat(filamentCost) + parseFloat(energyCost) + parseFloat(depreciationCost) + packageCost).toFixed(2);
  
  // Calcular preço de venda com margem
  let salePrice = (parseFloat(totalCost) * (1 + project.profitMargin / 100)).toFixed(2);
  
  // Calcular taxa da plataforma
  const platformFee = platform ? (parseFloat(salePrice) * (platform.feePercentage / 100)).toFixed(2) : 0;
  const finalPrice = platform ? (parseFloat(salePrice) + parseFloat(platformFee)).toFixed(2) : salePrice;

  const newProject = {
    ...project,
    id: Date.now(),
    filamentName: filament.name,
    machineName: machine.name,
    packageName: pkg?.name,
    platformName: platform?.name,
    costs: {
      filament: parseFloat(filamentCost),
      energy: parseFloat(energyCost),
      depreciation: parseFloat(depreciationCost),
      package: packageCost,
      total: parseFloat(totalCost)
    },
    platformFee: parseFloat(platformFee),
    salePrice: parseFloat(finalPrice),
    baseSalePrice: parseFloat(salePrice),
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  projects.push(newProject);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  return newProject;
};

export const updateProject = (id, updates) => {
  const projects = getProjects();
  const index = projects.findIndex(p => p.id === id);
  if (index !== -1) {
    projects[index] = {
      ...projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    return projects[index];
  }
  return null;
};

export const deleteProject = (id) => {
  const projects = getProjects();
  const filtered = projects.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
};

// Vendas
export const getSales = () => {
  const data = localStorage.getItem(STORAGE_KEYS.SALES);
  return data ? JSON.parse(data) : [];
};

export const saveSale = (sale) => {
  const sales = getSales();
  
  // Descontar embalagem do estoque se houver
  if (sale.packageId && sale.quantity) {
    const success = decreasePackageStock(parseInt(sale.packageId), sale.quantity);
    if (!success) {
      throw new Error('Estoque insuficiente de embalagens');
    }
  }
  
  const newSale = {
    ...sale,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  sales.push(newSale);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  
  // Atualizar status do projeto se houver
  if (sale.projectId) {
    updateProject(sale.projectId, { status: 'sold' });
  }
  
  return newSale;
};

export const deleteSale = (id) => {
  const sales = getSales();
  const filtered = sales.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(filtered));
};

// Embalagens
export const getPackages = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PACKAGES);
  return data ? JSON.parse(data) : [];
};

export const savePackage = (pkg) => {
  const packages = getPackages();
  const newPackage = {
    ...pkg,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  packages.push(newPackage);
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
  return newPackage;
};

export const updatePackage = (id, pkg) => {
  const packages = getPackages();
  const index = packages.findIndex(p => p.id === id);
  if (index !== -1) {
    packages[index] = {
      ...packages[index],
      ...pkg,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    return packages[index];
  }
  return null;
};

export const deletePackage = (id) => {
  const packages = getPackages();
  const filtered = packages.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(filtered));
};

export const decreasePackageStock = (id, quantity) => {
  const packages = getPackages();
  const pkg = packages.find(p => p.id === id);
  if (pkg && pkg.stock >= quantity) {
    pkg.stock -= quantity;
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    return true;
  }
  return false;
};

// Plataformas de Venda
export const getPlatforms = () => {
  const data = localStorage.getItem(STORAGE_KEYS.PLATFORMS);
  return data ? JSON.parse(data) : [];
};

export const savePlatform = (platform) => {
  const platforms = getPlatforms();
  const newPlatform = {
    ...platform,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  platforms.push(newPlatform);
  localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
  return newPlatform;
};

export const updatePlatform = (id, platform) => {
  const platforms = getPlatforms();
  const index = platforms.findIndex(p => p.id === id);
  if (index !== -1) {
    platforms[index] = {
      ...platforms[index],
      ...platform,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(platforms));
    return platforms[index];
  }
  return null;
};

export const deletePlatform = (id) => {
  const platforms = getPlatforms();
  const filtered = platforms.filter(p => p.id !== id);
  localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(filtered));
};

// Despesas
export const getExpenses = () => {
  const data = localStorage.getItem(STORAGE_KEYS.EXPENSES);
  return data ? JSON.parse(data) : [];
};

export const saveExpense = (expense) => {
  const expenses = getExpenses();
  const newExpense = {
    ...expense,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };
  expenses.push(newExpense);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  return newExpense;
};

export const deleteExpense = (id) => {
  const expenses = getExpenses();
  const filtered = expenses.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(filtered));
};

// Backup e Restauração
export const exportDatabase = () => {
  const database = {
    filaments: getFilaments(),
    machines: getMachines(),
    projects: getProjects(),
    sales: getSales(),
    expenses: getExpenses(),
    packages: getPackages(),
    platforms: getPlatforms(),
    exportedAt: new Date().toISOString(),
    version: APP_VERSION
  };
  
  const dataStr = JSON.stringify(database, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `calc3d_backup_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const importDatabase = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const database = JSON.parse(e.target.result);
        
        // Validar estrutura
        if (!database.filaments || !database.machines || !database.projects || !database.sales) {
          throw new Error('Arquivo de backup inválido');
        }
        
        // Restaurar dados
        localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(database.filaments));
        localStorage.setItem(STORAGE_KEYS.MACHINES, JSON.stringify(database.machines));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(database.projects));
        localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(database.sales));
        if (database.expenses) {
          localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(database.expenses));
        }
        if (database.packages) {
          localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(database.packages));
        }
        if (database.platforms) {
          localStorage.setItem(STORAGE_KEYS.PLATFORMS, JSON.stringify(database.platforms));
        }
        
        resolve(database);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
};

// Limpar todos os dados
export const clearAllData = () => {
  localStorage.removeItem(STORAGE_KEYS.FILAMENTS);
  localStorage.removeItem(STORAGE_KEYS.MACHINES);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.SALES);
  localStorage.removeItem(STORAGE_KEYS.EXPENSES);
  localStorage.removeItem(STORAGE_KEYS.PACKAGES);
  localStorage.removeItem(STORAGE_KEYS.PLATFORMS);
};
