import LocalStorage from "./localStorage";
import BasicStorage from "./basicStorage";

class StorageFactory {
    public create(id: string, isPersistent: boolean): StorageInterface {
        if (isPersistent) {
            return new LocalStorage(id, new BasicStorage());
        }

        return new BasicStorage();
    }
}

export default StorageFactory;