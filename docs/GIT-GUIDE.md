# Git commands for this project

Git saves the history of your code. GitHub keeps a copy online.
Run every command from the project root folder.

## One time only

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
```

Start tracking this project:

```bash
git init
git add .
git commit -m "First commit: MERN base setup"
```

Connect it to an empty GitHub repository:

```bash
git remote add origin https://github.com/your-name/your-repo.git
git branch -M main
git push -u origin main
```

`-u` links your branch to the online one. After this, plain `git push` is enough.

## The daily loop

This is the cycle you repeat every working day.

```bash
git pull                      # 1. Get other people's latest work
# ...write your code...
git status                    # 2. See what you changed
git add .                     # 3. Stage the changes
git commit -m "Add login page"  # 4. Save them with a message
git push                      # 5. Send them to GitHub
```

Staging means choosing what goes into the next save.
Committing means saving that choice into your history.

## Checking things

```bash
git status                    # Which files changed
git diff                      # What changed, line by line
git diff --staged             # What is already staged
git log --oneline --graph     # Short history
git log -p filename           # History of one file
git show <commit-id>          # Everything inside one commit
git remote -v                 # Which GitHub repo you are linked to
```

## Adding files

```bash
git add .                     # Everything that changed
git add filename              # One file only
git add folder/               # One folder
git reset filename            # Unstage a file, keep the edit
```

## Committing

```bash
git commit -m "message"       # Save staged changes
git commit -am "message"      # Stage tracked files and save, in one step
git commit --amend -m "new"   # Fix the last message, before pushing
```

Write messages that say what changed: "Fix login error message", not "update".

## Branches

A branch is a safe copy where you build one feature.

```bash
git branch                    # List branches
git checkout -b feature-login # Create a branch and switch to it
git checkout main             # Switch back
git merge feature-login       # Bring the feature into main
git branch -d feature-login   # Delete it once merged
git push -u origin feature-login  # Put the branch on GitHub
```

## Getting other people's work

```bash
git pull                      # Fetch and merge in one step
git fetch                     # Download only, do not merge yet
git merge origin/main         # Merge what you fetched
```

Always `git pull` before you start work. It prevents most conflicts.

## Undoing

```bash
git restore filename          # Throw away edits in one file
git restore --staged filename # Unstage, keep the edit
git revert <commit-id>        # Undo a pushed commit safely
git reset --soft HEAD~1       # Undo last commit, keep the changes
git reset --hard HEAD~1       # Undo last commit and DELETE the changes
git stash                     # Park your changes for a moment
git stash pop                 # Bring them back
```

`--hard` destroys work permanently. Be sure before you run it.

## When two people edit the same line

Git stops and marks a conflict.

1. Run `git status` to see which files conflict.
2. Open each file. Git writes `<<<<<<<`, `=======` and `>>>>>>>` markers.
3. Keep the correct lines. Delete all three marker lines.
4. Then:

```bash
git add .
git commit -m "Resolve merge conflict"
git push
```

## Cloning on another computer

```bash
git clone https://github.com/your-name/your-repo.git
cd your-repo
npm run setup
npm install
npm run dev
```

## What must never go to GitHub

`.env` files hold your database password and JWT secret.
`node_modules` is huge and can be reinstalled anytime.

This project's `.gitignore` already blocks both. Check before your first push:

```bash
git status --short
```

If you see `.env` or `node_modules` in that list, stop and fix `.gitignore` first.

Already committed a `.env` by mistake:

```bash
git rm --cached backend/.env
git commit -m "Remove .env from git"
```

Then treat that secret as leaked. Run `npm run setup` on a fresh `.env` to make a new one.
