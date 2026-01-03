#!/usr/bin/env python3
"""
Manual Git Commit Date Rewriter
Most reliable method - creates new commits with new dates
Modified to distribute 124 commits from Jan 3rd, 2026 onwards
"""

import subprocess
import random
import sys
import tempfile
import os
from datetime import datetime, timedelta

def generate_date_range(start_date, total_commits):
    """Generate dates starting from start_date with random distribution"""
    dates = []
    current_date = datetime.strptime(start_date, "%Y-%m-%d")
    
    # Generate enough dates to cover all commits (about 30-40 days)
    date_list = []
    for i in range(50):  # Generate 50 days worth of dates
        date_list.append(current_date.strftime("%Y-%m-%d"))
        current_date += timedelta(days=1)
    
    return date_list

def distribute_commits(total_commits, available_dates):
    """Distribute commits across dates with random amounts (3-8 per day)"""
    distribution = []
    remaining_commits = total_commits
    
    for date in available_dates:
        if remaining_commits <= 0:
            break
            
        # Random commits per day (3-8), but ensure we don't exceed remaining
        if remaining_commits > 8:
            commits_today = random.randint(3, 8)
        else:
            commits_today = remaining_commits
            
        if commits_today > 0:
            distribution.append((date, commits_today))
            remaining_commits -= commits_today
    
    return distribution

# Starting from January 3rd, 2026
START_DATE = "2026-01-03"
TOTAL_COMMITS = 124

def run_command(cmd):
    """Run command and return output"""
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def main():
    print("=== Git Date Rewriter - January 2026 Distribution ===\n")
    
    # Verify git repo
    _, _, code = run_command("git rev-parse --git-dir")
    if code != 0:
        print("Error: Not a git repository")
        sys.exit(1)
    
    # Get info
    current_branch, _, _ = run_command("git rev-parse --abbrev-ref HEAD")
    commit_count_str, _, _ = run_command("git rev-list --count HEAD")
    commit_count = int(commit_count_str)
    
    print(f"Branch: {current_branch}")
    print(f"Total commits found: {commit_count}")
    print(f"Target commits to redistribute: {TOTAL_COMMITS}\n")
    
    if commit_count < TOTAL_COMMITS:
        print(f"Error: Repository has {commit_count} commits but script expects {TOTAL_COMMITS}")
        print("Please adjust TOTAL_COMMITS variable in the script")
        sys.exit(1)
    
    # Generate date range and distribution
    available_dates = generate_date_range(START_DATE, TOTAL_COMMITS)
    date_distribution = distribute_commits(TOTAL_COMMITS, available_dates)
    
    print("Commit Distribution Plan:")
    print("-" * 40)
    total_distributed = 0
    for date, count in date_distribution:
        print(f"  {date}: {count} commits")
        total_distributed += count
    print(f"\nTotal distributed: {total_distributed} commits")
    print(f"Starting date: {START_DATE}")
    print(f"Ending date: {date_distribution[-1][0]}\n")
    
    # Create backup
    backup = f"backup-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    print(f"Creating backup: {backup}")
    run_command(f"git branch {backup}")
    print("✓ Backup created\n")
    
    # Generate commit datetimes in sequential order
    commit_dates = []
    for date, count in date_distribution:
        for _ in range(count):
            # Random time between 9 AM and 6 PM
            h = random.randint(9, 18)
            m = random.randint(0, 59)
            s = random.randint(0, 59)
            commit_dates.append(f"{date} {h:02d}:{m:02d}:{s:02d}")
    
    # Confirm
    print("⚠️  WARNING: This will rewrite Git history!")
    print(f"📅 Commits will be redistributed from {START_DATE} onwards")
    print(f"📊 {len(commit_dates)} commits will be processed")
    confirm = input("\nContinue? Type 'yes' to proceed: ")
    if confirm.lower() != "yes":
        print("Aborted")
        sys.exit(0)
    
    print("\n🔍 Collecting commit information...")
    
    # Get all commits (newest to oldest)
    commits_raw, _, _ = run_command('git log --format="%H|||%an|||%ae|||%s"')
    if not commits_raw:
        print("Error: Could not read commits")
        sys.exit(1)
    
    commits = []
    for line in commits_raw.split('\n'):
        if '|||' in line:
            parts = line.split('|||')
            if len(parts) >= 4:
                commits.append({
                    'hash': parts[0],
                    'author': parts[1],
                    'email': parts[2],
                    'message': '|||'.join(parts[3:])  # In case message contains |||
                })
    
    # Take only the number of commits we want to redistribute
    commits = commits[:TOTAL_COMMITS]
    
    # Reverse to get oldest first
    commits.reverse()
    
    print(f"✅ Processing {len(commits)} commits")
    
    # Get root commit
    root_hash, _, _ = run_command("git rev-list --max-parents=0 HEAD")
    print(f"🌱 Root commit: {root_hash[:8]}...\n")
    
    # Create orphan branch to rebuild history
    temp_branch = f"temp-rewrite-{datetime.now().strftime('%H%M%S')}"
    
    # Checkout orphan branch
    run_command(f"git checkout --orphan {temp_branch}")
    
    # Process each commit
    print("🔄 Rewriting commit history...")
    for i, commit_info in enumerate(commits):
        new_date = commit_dates[i] if i < len(commit_dates) else commit_dates[-1]
        
        progress = f"[{i+1}/{len(commits)}]"
        short_hash = commit_info['hash'][:8]
        print(f"{progress} {short_hash} -> {new_date}")
        
        # Checkout files from original commit
        run_command(f"git checkout {commit_info['hash']} -- .")
        
        # Stage all changes
        run_command("git add -A")
        
        # Set environment variables for git commit
        env = os.environ.copy()
        env['GIT_AUTHOR_NAME'] = commit_info['author']
        env['GIT_AUTHOR_EMAIL'] = commit_info['email']
        env['GIT_AUTHOR_DATE'] = new_date
        env['GIT_COMMITTER_NAME'] = commit_info['author']
        env['GIT_COMMITTER_EMAIL'] = commit_info['email']
        env['GIT_COMMITTER_DATE'] = new_date
        
        # Commit with original message
        message = commit_info['message'].replace('"', '\\"')
        commit_cmd = f'git commit -m "{message}"'
        subprocess.run(commit_cmd, shell=True, env=env, capture_output=True)
    
    print("\n✅ Rewrite complete!\n")
    
    # Switch back to original branch and reset to new history
    print(f"🔄 Updating {current_branch}...")
    run_command(f"git branch -f {current_branch} {temp_branch}")
    run_command(f"git checkout {current_branch}")
    run_command(f"git branch -D {temp_branch}")
    
    # Show results
    print("\n📊 New commit dates (last 15):")
    output, _, _ = run_command('git log --pretty=format:"%h %ad %s" --date=short -15')
    print(output)
    
    print(f"\n\n🎉 SUCCESS! 🎉")
    print("=" * 50)
    print(f"✅ {len(commits)} commits redistributed")
    print(f"📅 Date range: {START_DATE} to {date_distribution[-1][0]}")
    print(f"💾 Backup branch: {backup}")
    print(f"\n📤 To push changes:")
    print(f"   git push --force origin {current_branch}")
    print(f"\n🔙 To restore original:")
    print(f"   git reset --hard {backup}")
    print("=" * 50)

if __name__ == "__main__":
    main()