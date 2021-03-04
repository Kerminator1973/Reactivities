import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

// MobX позволяет использовать несколько хранилищ состояний, но
// мы пока используем только одно. Определяем interface для
// строгой типизации
interface Store {
    activityStore: ActivityStore
}

// Определяем и инициализируем объект централизированного хранилища
export const store: Store = {
    activityStore: new ActivityStore()
}

// Генерируем функциональный компонент, через который будет
// доступно наше хранилище. Этот функциональный компонент должен
// быть определён в иерархии компонентов JSX на самом высоком
// уровне - в "index.tsx", см.:
//      <StoreContext.Provider value={store}>
export const StoreContext = createContext(store);

// Для удобства, определяем специальную wrapper-функцию
// для доступа к хранилищу из дочерних компонентов. Например,
// эта функция используется в "App.tsx"
export function useStore() {
    return useContext(StoreContext);
}