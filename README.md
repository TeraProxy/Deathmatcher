##### :heavy_exclamation_mark: Elin Gunner Patch Info :heavy_exclamation_mark:
Starting with this patch only a limited number of opcodes are mapped by default and most mods will not work when the update hits. This was necessary to prevent people from using exploits. Please be patient while the required opcodes for this module will be added.

# Deathmatcher
A tera-proxy module that farms deathmatches for you.  
Configured duelist 1 will create and win the deathmatches.  
Configured duelist 2 will join and surrender the deathmatches.  
  
## Usage  
Open index.js with a text editor of your choice and change the names of duelist1 and duelist2.  
Meet up in game.  
Enable the module on duelist2 first and on duelist1 after with the command below.  
  
While in game, open a proxy chat session by typing "/proxy" or "/8" in chat and hitting the space bar.  
This serves as the script's command interface.  
The following commands are supported:  
  
* deathmatch - enable/disable Deathmatcher  
  
## Safety
Whatever you send to the proxy chat in game is intercepted client-side. The chat is NOT sent to the server.  
  
## Changelog
### 1.0.0
* [*] Initial Release
