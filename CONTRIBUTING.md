### DecidrAI


## How To Create PR

# 1. Create branch from main
git checkout main
git pull origin main
git checkout -b issue-1-setup-repo

# 2. Do your work (create folders, README, etc.)
# ... make changes ...

# 3. Commit changes
git add .
git commit -m "Setup repository structure and README (#1)"

# 4. Push branch to GitHub
git push origin issue-1-setup-repo

# 5. Create PR (use GitHub CLI or website)
gh pr create --title "Setup repository structure (#1)" --body "Closes #1"

# 6. Review & Merge (on GitHub website)
# 7. Delete branch after merge
git checkout main
git pull origin main
git branch -d issue-1-setup-repo
```

### Branch Naming Convention:
```
issue-1-setup-repo
issue-2-mongodb-setup
issue-3-redis-setup
feature/flow-engine
bugfix/search-error
