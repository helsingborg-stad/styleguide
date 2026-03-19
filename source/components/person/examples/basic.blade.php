
<div class="o-grid">
	@for($index = 0; $index < 6; $index++)
		<div class="o-grid-12@xs o-grid-6@md o-grid-4@lg">
			@person([
				"givenName" => "John",
				"familyName" => "Doe",
				"jobTitle" => "Web Developer",
				"description" => "John is a skilled web developer with over 10 years of experience in creating dynamic and responsive websites. He specializes in front-end development and has a passion for crafting user-friendly interfaces.",
				"administrationUnit" => "IT Department",
				"image" => "https://i.pravatar.cc/144?img={$index}",
				"socialMedia" => [
					[
						"url" => "https://www.linkedin.com/in/johndoe",
						"media" => "linkedin",
						"label" => "LinkedIn"
					],
					[
						"url" => "https://twitter.com/johndoe",
						"media" => "twitter",
						"label" => "Twitter"
					],
					[
						"url" => "https://www.facebook.com/johndoe",
						"media" => "facebook",
						"label" => "Facebook"
					]
				],
				"email" => "john.doe@example.com",
				"telephone" => [[
					"number" => "+46 123 456 789"
				]],
				"address" => "123 Main Street, 12345 City, Country",
				"visitingAddress" => "456 Another Street, 54321 City, Country",
			])
			@endperson
		</div>
	@endfor
</div>