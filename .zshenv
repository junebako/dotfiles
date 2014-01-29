export LC_COLLATE=C
export LC_CTYPE=ja_JP.UTF-8
export LC_MESSAGES=C
export LC_MONETARY=C
export LC_NUMERIC=C
export LC_TIME=C

export GOROOT=/usr/local/go
export PATH=$PATH:$GOROOT/bin

export MAKEOPTS="-j4"

# notifier

export SYS_NOTIFIER="/usr/local/bin/terminal-notifier"
export NOTIFY_COMMAND_COMPLETE_TIMEOUT=10

# nvm

source ~/.nvm/nvm.sh
