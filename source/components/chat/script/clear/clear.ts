class Clear implements ClearInterface {
	constructor(private storage: StorageInterface) {}

	public clear(): void {
		const items = this.storage.getAll();

		items.forEach((item) => {
			item.delete();
		});

		this.storage.deleteAll();
	}
}

export default Clear;
