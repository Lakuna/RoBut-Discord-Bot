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
const INFO_COLOR = 0x5078C8;

// Error handling.
client.on("error", console.error);
client.on("shardError", console.error);

// Startup.
client.on("ready", async () => client.user.setActivity("Role Buttons"));

// Handle slash commands.
client.ws.on("INTERACTION_CREATE", async (interaction) => {
	if (interaction.data.name == "setup") {
		// Build output message.
		const data = {
			type: 4,
			data: {
				embeds: [
					{
						title: "Select your roles:",
						type: "rich",
						color: INFO_COLOR
					}
				],
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
		return client.api.interactions(interaction.id, interaction.token).callback.post({ data });
	} else if (interaction.data.component_type == 2) {
		// Buttons.

		// Find the guild.
		const guild = await client.guilds.fetch(interaction.guild_id);
		if (!guild) { return console.error("Failed to fetch button's guild."); }

		// Find the member.
		const member = await guild.members.fetch(interaction.member.user.id);
		if (!member) { return console.error("Failed to fetch interaction's member."); }

		// Find the role.
		const role = await guild.roles.fetch(interaction.data.custom_id);
		if (!role) { return; } // Role has been deleted.

		// Give it to or remove it from the member.
		if (member.roles.cache.has(role.id)) {
			try { await member.roles.remove(role); } catch { return; }
		} else {
			try { await member.roles.add(role); } catch { return; }
		}

		// No output message, but prevent an error from showing.
		return client.api.interactions(interaction.id, interaction.token).callback.post({ data: { type: 6 } });
	}
});

// Login.
client.login(process.env.TOKEN);