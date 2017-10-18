// ################################################################################################ //
// ### Start the module on duelist2 (the loser) first so we get their character id for duelist1 ### //
// ################################################################################################ //

const Command = require('command')

module.exports = function Deathmatcher(dispatch) {
	let enabled = false,
		name = '',
		duelist1 = 'Meishu', // this person will create and win the deathmatches
		duelist2 = 'Spacecats', // this person accepts and surrenders the deathmatches
		partner = '',
		partnerid = null,
		timeout = null
	
	dispatch.hook('S_LOGIN', 4, event => {
		name = event.name
		if(name == duelist1) partner = duelist2.toLowerCase()
		else if(name == duelist2) partner = duelist1.toLowerCase()
		enabled = false
	})
	
	dispatch.hook('S_REQUEST_CONTRACT', 1, (event) => { 
		// decline a duel request by duelist2 once to get their character id
		if(!partnerid && name == duelist1 && event.type == 11) {
			partnerid = event.senderId
			dispatch.toServer('C_REJECT_CONTRACT', 1, { 
				type: event.type,
				id: event.id
			})
			return false
		}
		if(enabled) {
			if(event.senderName.toLowerCase() == partner) {
				partnerid = event.senderId
				if(name == duelist2 && event.type == 18) {
					dispatch.toServer('C_ACCEPT_CONTRACT', 1, { 
						type: event.type,
						id: event.id
					})
				}
				return false
			}
		}
	})
	
	dispatch.hook('S_ACCEPT_CONTRACT', 1, (event) => { 
		if(partnerid && enabled && partnerid.equals(event.recipientId)) {
			setTimeout(() => {
				dispatch.toServer('C_MOVE_SLOT_IN_GROUP_DUEL', 1, { 
					fromteam: 1,
					fromslot: 1,
					toteam: 0,
					toslot: 0
				})
			}, 500)
		}
	})
	
	dispatch.hook('S_GROUP_DUEL_INIT', 'raw', (code, data) => { 
		clearTimeout(timeout) // so we don't spam the server
		if(enabled) {
			if(name == duelist2) {
				timeout = setTimeout(() => { 
					dispatch.toServer('C_TOGGLE_GROUP_DUEL_READY', 1, {ok: 1}) 
				}, 700)
			}
			else if(name == duelist1) {
				timeout = setTimeout(() => { 
					dispatch.toServer('C_TOGGLE_GROUP_DUEL_READY', 1, {ok: 1}) 
				}, 900)
			}
		}
	})

	dispatch.hook('S_CHANGE_RELATION', 1, (event) => { 
		if(enabled && partnerid.equals(event.target) && name != duelist1) {
			if(event.relation == 5) {
				dispatch.toServer('C_DUEL_CANCEL', 1)
				dispatch.toServer('C_LEAVE_GROUP_DUEL', 1)
			}
		}
	})

	dispatch.hook('S_GROUP_DUEL_FIN', 1, (event) => {
		if(enabled) {
			if(name == duelist1) {
				dispatch.toServer('C_CREATE_GROUP_DUEL', 1, { 
					kills: 0,
					open: 0,
					advertisement: 'A'
				})
				setTimeout(() => {
					dispatch.toServer('C_REQUEST_CONTRACT', 1, { 
						type: 18,
						unk2: 0,
						unk3: 0,
						unk4: 0,
						name: partner
					})
				}, 500)
			}
		}
	})
	
	const command = Command(dispatch)
	command.add('deathmatch', () => {
		enabled = !enabled
		if(enabled) {
			if(name == duelist1) {
				command.message('[Deathmatcher] It\'s time to d-d-d-d-d-d-d-deathmatch ' + duelist2 + '!')
				dispatch.toServer('C_CREATE_GROUP_DUEL', 1, { 
					kills: 0,
					open: 0,
					advertisement: 'A'
				})
				setTimeout(() => {
					dispatch.toServer('C_REQUEST_CONTRACT', 1, { 
						type: 18,
						unk2: 0,
						unk3: 0,
						unk4: 0,
						name: partner
					})
				}, 500)
			}
			if(name == duelist2) {
				command.message('[Deathmatcher] It\'s time to d-d-d-d-d-d-d-deathmatch ' + duelist1 + '!')
				dispatch.toServer('C_REQUEST_CONTRACT', 1, { 
					type: 11,
					unk2: 0,
					unk3: 0,
					unk4: 0,
					name: partner
				})
			}
		}
		else command.message('[Deathmatcher] Stopping deathmatch with ' + partner)
	})
}