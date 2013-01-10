# .zshrc

# User specific aliases and functions

alias g='hub'
alias hub='git'
alias r='rails'

alias heroku='/usr/bin/heroku'

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'

# alias ls="ls -aFh --color=auto --show-control-chars"
alias ls="ls -aFGh"
alias la="ls -aF"
alias ll="ls -l"

alias rm="rm -i"
alias rmback="rm *~;rm .*~;rm *.bak"
alias rmbackr="rm **/*~"
alias rmbackd="rm ~/Dropbox/**/*~"
alias rmstore="rm .DS_Store; rm */.DS_Store"
alias rmstorer="rm **/.DS_Store"

alias cp="cp -i"

alias h="history"
alias x="exit"

alias cemacs="/Applications/Emacs.app/Contents/MacOS/Emacs"

# http://www.clear-code.com/blog/2011/9/5.html

alias grep="grep --color=auto"

alias -g L="|& lv"
alias -g G="| grep"
alias -g C="| pbcopy"

# history pattern search

bindkey '^R' history-incremental-pattern-search-backward
bindkey '^S' history-incremental-pattern-search-forward

# forbid C-s
stty stop undef

# History

HISTFILE=$HOME/.zsh-history
HISTSIZE=100000
SAVEHIST=100000
setopt extended_history
function history-all { history -E 1 }

setopt share_history

# Auto complete

autoload -U compinit
compinit

# Case insensitive complete

zstyle ':completion:*' matcher-list 'm:{a-z}={A-Z}'

# http://d.hatena.ne.jp/Yoshiori/20120814/1344913023

REPORTTIME=5

# z

. `brew --prefix`/etc/profile.d/z.sh
function precmd () {
   z --add "$(pwd -P)"
}

# Prompt
## Show current ruby version
## Show git branch name

local PURPLE=$'%{[35m%}'
local RED=$'%{[31m%}'
local DEFAULT=$'%{[m%}'

precmd() {
    RUBY_VERSION="$(rvm-prompt v s g)"
}

PROMPT=$RED'[j]($RUBY_VERSION)%(!.#.$) '$DEFAULT
setopt PROMPT_SUBST

autoload -Uz VCS_INFO_get_data_git; VCS_INFO_get_data_git 2> /dev/null

function git_prompt_stash_count {
  local COUNT=$(git stash list 2>/dev/null | wc -l | tr -d ' ')
  if [ "$COUNT" -gt 0 ]; then
    echo "[$COUNT]"
  fi
}

function rprompt-git-current-branch {
    local name st color gitdir action
    if [[ "$PWD" =~ '/\.git(/.*)?$' ]]; then
        return
    fi
    name=$(basename "`git symbolic-ref HEAD 2> /dev/null`")
    if [[ -z $name ]]; then
        return
    fi

    gitdir=`git rev-parse --git-dir 2> /dev/null`
    action=`VCS_INFO_git_getaction "$gitdir"` && action="($action)"

    st=`git status 2> /dev/null`
    if [[ -n `echo "$st" | grep "^nothing to"` ]]; then
        color=%F{green}
    elif [[ -n `echo "$st" | grep "^nothing added"` ]]; then
        color=%F{yellow}
    elif [[ -n `echo "$st" | grep "^# Untracked"` ]]; then
        color=%B%F{red}
    else
        color=%F{red}
    fi

    echo "($color$name$action%f%b)`git_prompt_stash_count`"
}

RPROMPT='`rprompt-git-current-branch`'$PURPLE'[%~]'$DEFAULT
setopt PROMPT_SUBST

# Some settings

setopt autopushd
setopt auto_list
setopt auto_param_keys
setopt auto_param_slash
setopt hist_ignore_dups
setopt magic_equal_subst
setopt mark_dirs
function chpwd() { ls }
setopt auto_cd

# screen

if [ "$TERM" = "screen" ]; then
        chpwd () { echo -n "_`dirs`\\" }
        preexec() {
                emulate -L zsh
                local -a cmd; cmd=(${(z)2})
                case $cmd[1] in
                        fg)
                                if (( $#cmd == 1 )); then
                                        cmd=(builtin jobs -l %+)
                                else
                                        cmd=(builtin jobs -l $cmd[2])
                                fi
                                ;;
                        %*)
                                cmd=(builtin jobs -l $cmd[1])
                                ;;
                        cd)
                                if (( $#cmd == 2 )); then
                                        cmd[1]=$cmd[2]
                                fi
                                ;&
                        *)
                                echo -n "k$cmd[1]:t\\"
                                return
                                ;;
                esac

                local -A jt; jt=(${(kv)jobtexts})

                $cmd >>(read num rest
                        cmd=(${(z)${(e):-\$jt$num}})
                        echo -n "k$cmd[1]:t\\") 2>/dev/null
        }
        chpwd
fi
