# General

abbr -a cdr 'cd (ghq list -p | sort | peco)'
abbr -a glsa 'git ls-files | peco | xargs atom'
abbr -a ghq-get 'ghq get -p'
abbr -a memo 'lv ~/Dropbox/memo/memo.txt'

abbr -a rm 'rm -i'
abbr -a cp 'cp -i'
abbr -a mv 'mv -i'

abbr -a ls 'eza -aGh'
abbr -a ll 'eza -al'

abbr -a h 'history'
abbr -a x 'exit'

abbr -a c 'cursor'

abbr -a tree 'tree -CN'

# Ruby

abbr -a r 'rails'
abbr -a be 'bundle exec'
abbr -a bi 'bundle install'

# Git

abbr -a g 'git'
abbr -a gtmp 'git add .; git commit -m "tmp"'
abbr -a gst 'git status'
abbr -a gdf 'git diff'
abbr -a gdfc 'git diff --cached'
abbr -a gadd 'git add .'

# Docker Compose

abbr -a dcb 'docker compose build'
abbr -a dce 'docker compose exec'
abbr -a dcr 'docker compose run --rm'
abbr -a dcu 'docker compose up'
