interface RoutePermission {
    path: string;
    allowedProfiles: string[];
  }
  
  interface MenuItem {
    text: string;
    path: string;
    allowedProfiles: string[];
  }
  
  export const routePermissions: RoutePermission[] = [
    { path: '/cadastrar-tarefa', allowedProfiles: ['SYSA'] }, // Só admins
    { path: '/gerenciar-arvores', allowedProfiles: ['SYSA'] }, // Só admins
    { path: '/dashboard', allowedProfiles: ['SYSA'] }, // Só admins
    { path: '/users', allowedProfiles: ['SYSA'] }, // Só admins
    { path: '/settings', allowedProfiles: ['SYSA'] }, // Só admins
  ];
  
  export const menuItems: MenuItem[] = [
    { text: 'Gerenciar Tarefa', path: '/cadastrar-tarefa', allowedProfiles: ['SYSA'] },
    { text: 'Gerenciar Árvores', path: '/gerenciar-arvores', allowedProfiles: ['SYSA'] },
    { text: 'Dashboard', path: '/dashboard', allowedProfiles: ['SYSA'] },
    { text: 'Usuários', path: '/users', allowedProfiles: ['SYSA'] },
    { text: 'Configurações', path: '/settings', allowedProfiles: ['SYSA'] },
  ];
  
  // Função pra verificar se o perfil tem acesso à rota
  export const hasRouteAccess = (path: string, profiles: string[]): boolean => {
    const route = routePermissions.find((r) => r.path === path);
    if (!route) return false; // Rota não encontrada = sem acesso
    return route.allowedProfiles.some((allowedProfile) =>
      profiles.includes(allowedProfile)
    );
  };
  
  // Função pra filtrar itens do menu
  export const getAllowedMenuItems = (profiles: string[]): MenuItem[] => {
    return menuItems.filter((item) =>
      item.allowedProfiles.some((allowedProfile) => profiles.includes(allowedProfile))
    );
  };