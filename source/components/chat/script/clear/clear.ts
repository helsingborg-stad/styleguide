class Clear implements ClearInterface {
    constructor(private storage: StorageInterface) {

    }

    public clear(): void {
        const messages = this.storage.getAll();

        messages.forEach((message) => {
            message.delete();
        });

        this.storage.deleteAll();
    }
}

export default Clear;