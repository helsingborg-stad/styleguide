class MapFactory {
	private static providers: Record<string, any> = {};

	/**
	 * Creates a map instance for the specified provider using the provided arguments.
	 * If the provider's factory has not been loaded yet, it dynamically imports
	 * the module and initializes the factory before creating the map instance.
	 *
	 * @param provider - The name of the map provider (e.g., "openstreetmap").
	 * @param args     - Configuration arguments required to create the map instance.
	 * @returns A promise that resolves to the created map instance.
	 */
	public static async create(provider: string, args: MapArgs) {
		const key = provider.toLowerCase();

		if (!MapFactory.providers[key]) {
			switch (key) {
				case 'openstreetmap':
				default: {
					const module = await import(`./providers/openstreetmap/openstreetmapFactory`);

					MapFactory.providers[key] = new module.default();
					break;
				}
			}
		}

		return MapFactory.providers[key].create(args);
	}
}

export default MapFactory;
