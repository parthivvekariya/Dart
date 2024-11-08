import { Menu } from '@/api/menu/menuModel';
import { Restaurant } from '@/api/restaurant/restaurantModel';
import { Review } from '@/api/review/reviewModel';

export const restaurantRepository = {
  findAllAsync: async (): Promise<Restaurant[] | null> => {
    const restaurants = await Restaurant.findAll();
    return restaurants;
  },

  findByIdAsync: async (id: string): Promise<Restaurant | null> => {
    const restaurant = await Restaurant.findByPk(id, {
      include: [Menu, Review],
    });
    return restaurant;
  },

  searchAsync: async (filter: Record<string, any>): Promise<Restaurant[] | null> => {
    const restaurants = await Restaurant.findAll({ where: filter, include: [Menu, Review] });
    return restaurants;
  },
};
