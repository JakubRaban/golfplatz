import os

windows = os.name == 'nt'

steps = [
    'cd frontend && npm install',
    'npm run build --prefix frontend',
    'git add -f frontend/static/frontend/main.js',
    'git rm --cached .env',
    'git commit -m "deploy"',
    'heroku login',
    'echo Now login to heroku',
    'pause' if windows else 'read -p "Press enter to continue"',
    'cd .. && git subtree push --prefix Server heroku master',
    'git reset --hard HEAD~1',
]

for step in steps:
    print(step)
    os.system(step)
    print()
