import { create } from 'zustand';

interface CarState {
  topOfCar: number;
  setTopOfCar: (position: number) => void;
}

const useCarStore = create<CarState>((set) => ({
  topOfCar: 0,
  setTopOfCar: (position) => set({ topOfCar: position }),
}));

export default useCarStore; 