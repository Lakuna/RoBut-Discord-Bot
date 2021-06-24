const { Client } = require("discord.js");

// Create client.
// Invite link: https://discord.com/api/oauth2/authorize?client_id=857398032056320030&permissions=268504128&scope=bot%20applications.commands
const client = new Client({
	partials: [ "GUILD_MEMBER", "MESSAGE" ],
	ws: { intents: [ "GUILDS" ] }
});

// Application getter.
Object.defineProperty(client, "app", { get: () => client.api.applications(client.user.id) });

// Colors.
const SUCCESS_COLOR = "#50C878";
const WARNING_COLOR = "#FFE791";
const ERROR_COLOR = "C80815";

// Error handling.
client.on("error", console.error);
client.on("shardError", console.error);

// Startup.
client.on("ready", async () => {
	client.user.setActivity("Role Reactions");

	/*
	Print commands:
	console.log(await client.app.commands.get());

	Create command:
	// https://discord.com/developers/docs/interactions/slash-commands#registering-a-command
	await client.app.commands.post({
		data: {
			name: "command_name",
			description: "command_description"
		}
	});

	Delete command:
	// https://discord.com/developers/docs/interactions/slash-commands#updating-and-deleting-a-command
	await client.app.commands('command_id').delete();
	*/
});

// Handle slash commands.
client.ws.on("INTERACTION_CREATE", async (interaction) => {
	if (interaction.data.name == "setup") {
		// Build output message.
		const roles = Object.values(interaction.data.resolved.roles);

		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "Placeholder."
				}
			}
		});

		// console.log(interaction.data.resolved);

		/*
		interaction.data.resolved[x] {
			roles: {
				'role_id': {
					tags: [Object],
					position: #,
					permissions: '#######',
					name: 'role_name',
					mentionable: boolean,
					managed: boolean,
					id: '#######',
					hoist: boolean,
					color: #
				},
				'role_id': { ... }
			}
		}
		*/

		/*
		return client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "Select your roles:",
					components: [
						{
							"type": 1, // ActionRow
							"components": [
								{
									"type": 2, // Button
									"style": 1,
									"label": "Placeholder",
									"custom_id": "Placeholder ID"
								}
							]
						},
						{
							"type": 1, // ActionRow
							"components": [
								{
									"type": 2, // Button
									"style": 1,
									"label": "Placeholder 2",
									"custom_id": "Placeholder ID 2"
								}
							]
						}
					]
				}
			}
		});
		*/
	} else if (interaction.data.component_type == 2) {
		// Buttons!

		client.api.interactions(interaction.id, interaction.token).callback.post({
			data: {
				type: 4,
				data: {
					content: "Button placeholder."
				}
			}
		});

		/*
		interaction {
			message: { ... },
			member: {
				user: {
					username: 'username',
					id: '#######',
					...
				},
				...
			},
			id: '#######',
			guild_id: '########',
			data: {
				custom_id: 'button_assigned_id',
				component_type: #
			},
			channel_id: '########',
			application_id: '#######'
		}
		*/
	}
});

// Login.
client.login(process.env.TOKEN);