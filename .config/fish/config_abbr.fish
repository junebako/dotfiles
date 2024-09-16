abbr -a cdr 'cd (ghq list -p | sort | peco)'
abbr -a glsa 'git ls-files | peco | xargs atom'
abbr -a ghq-get 'ghq get -p'
abbr -a memo 'lv ~/Dropbox/memo/memo.txt'

abbr -a rm 'rm -i'
abbr -a cp 'cp -i'
abbr -a mv 'mv -i'

abbr -a ls 'eza -aGh'
abbr -a ll 'eza -al'

abbr -a rmd 'rm *競合コピー*'
abbr -a rmback 'rm *~;rm .*~;rm *.bak'
abbr -a rmbackr 'rm **/*~'
abbr -a rmbackd 'rm ~/Dropbox/**/*~'
abbr -a rmstore 'rm .DS_Store; rm */.DS_Store'
abbr -a rmstorer 'rm **/.DS_Store'

abbr -a h 'history'
abbr -a x 'exit'

abbr -a e '~/Applications/Emacs.app/Contents/MacOS/bin/emacsclient -n'
abbr -a c 'cursor'

abbr -a tree 'tree -CN'

# Ruby

abbr -a r 'rails'
abbr -a be 'bundle exec'
abbr -a bi 'bundle install'

# Git

abbr -a g 'git'
abbr -a gtmp 'git add .; git commit -m "tmp"'
