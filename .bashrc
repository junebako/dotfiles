# .bashrc

PS1 = '\[\033[0;33m\][june29@lab:\W] $'
PATH=.:/home/june29/plagger:$PATH

# Source global definitions
if [ -f /etc/bashrc ]; then
        . /etc/bashrc
fi

# User specific aliases and functions

alias ls="ls -aFh --color=auto --show-control-chars"
alias la="ls -aF"
alias ll="ls -l"

alias rm="rm -i"
alias rmback="rm *~ *.bak"
alias cp="cp -i"

alias h="history"
alias x="exit"
