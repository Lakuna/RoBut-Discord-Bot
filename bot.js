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
		const data = {
			type: 4,
			data: {
				content: "Select your roles:",
				components: []
			}
		};
		const roles = Object.values(interaction.data.resolved.roles);
		for (let i = 0; i < roles.length; i++) {
			const row = Math.floor(i / 5);

			while (data.data.components.length <= row) {
				data.data.components.push({
					type: 1,
					components: []
				});
			}

			data.data.components[row].components.push({
				type: 2,
				style: 1,
				label: roles[i].name,
				custom_id: roles[i].id
			});
		}

		// Send output message.
		client.api.interactions(interaction.id, interaction.token).callback.post({ data });
	} else if (interaction.data.component_type == 2) {
		// Buttons.

		client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 6 } }); // No output message.
	}
});

// Login.
client.login(process.env.TOKEN);