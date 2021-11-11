import re
import json
with open('epic.log', 'r') as log:
    log = log.readlines()
# print(log)
hook_content = []
colors = {'WARN': 14177041, 'INFO': 1127128}
for i in log[3:]:
    ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')
    result = ansi_escape.sub('', i).strip().split('|')
    result = [i.strip() for i in result]
    try:
        result = {'title': result[2], 'description': result[3], 'color': colors[result[2]]}
    except IndexError:
        continue
    # print(result)
    hook_content.append(result)
# print(hook_content)
discord_hook = {
    "username": "Epic Log",
    "avatar_url": "https://i.imgur.com/4M34hi2.png",
    "content": "",
    "embeds": [
        {
            "author": {
                "name": "Log Bot",
                "url": "https://github.com/scatking/epicgames-freebies-claimer",
                "icon_url": "https://i.imgur.com/R66g1Pe.jpg"
            },
            "title": "Claim Log",
            "url": "https://google.com/",
            "description": "Here is your free game log",
            "color": 15258703
        }
    ]
}
discord_hook['embeds'] += hook_content
# print(discord_hook)
with open('webhook.json','w') as webhook:
    json.dump(discord_hook,webhook)