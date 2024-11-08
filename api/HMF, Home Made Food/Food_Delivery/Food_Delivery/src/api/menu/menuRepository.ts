import { Menu } from '@/api/menu/menuModel';

export const menuRepository = {
  getByRestaurantIdAsync: async (restaurantId: string): Promise<Menu[] | null> => {
    const menus = await Menu.findAll({ where: { restaurantId } });
    return menus;
  },

  getByIdAsync: async (menuId: string): Promise<Menu | null> => {
    const menu = await Menu.findByPk(menuId);
    return menu;
  },
};
